import type Database from "better-sqlite3";
import type { QuestionRow } from "../interfaces/index.js";
import {
  ICategory,
  ICreateEssayQuestion,
  ICreateMcqQuestion,
  IEssayQuestion,
  IGroupedQuestionCategory,
  IMcqQuestion,
  IQuestionCountByCategory,
  IQuestions,
} from "@/shared/interfaces/index.js";

export type GroupedQuestions = Record<string, Record<string, IQuestions[]>>;

export class QuestionsRepository {
  constructor(private readonly db: Database.Database) {}

  createMcq(input: ICreateMcqQuestion): IMcqQuestion {
    const insertQuestion = this.db.transaction((data: ICreateMcqQuestion) => {
      const info = this.db
        .prepare(
          `INSERT INTO questions (type, header, difficulty, headerImageUrl, category_id, subcategory_id)
           VALUES ('mcq', ?, ?, ?, ?, ?)`,
        )
        .run(
          data.header,
          data.difficulty,
          data.headerImageUrl,
          data.categoryId,
          data.subcategoryId,
        );

      const questionId = info.lastInsertRowid as number;

      this.db
        .prepare(
          "INSERT INTO mcq_key (question_id, correct_answer) VALUES (?, ?)",
        )
        .run(
          questionId,
          data.choices.find((choice) => choice.isCorrect === true)?.choice,
        );

      const insertDistractor = this.db.prepare(
        "INSERT INTO mcq_distractors (question_id, distractor_text) VALUES (?, ?)",
      );
      const distractors = data.choices.filter(
        (choice) => choice.isCorrect === false,
      );
      for (const distractor of distractors) {
        insertDistractor.run(questionId, distractor.choice);
      }

      return questionId;
    });

    const questionId = insertQuestion(input);
    return this.findById(questionId)! as IMcqQuestion;
  }

  createEssay(input: ICreateEssayQuestion): IEssayQuestion {
    const insertQuestion = this.db.transaction((data: ICreateEssayQuestion) => {
      const info = this.db
        .prepare(
          `INSERT INTO questions (type, header, difficulty, headerImageUrl,  category_id, subcategory_id)
           VALUES ('essay', ?, ?, ?, ?, ?)`,
        )
        .run(
          data.header,
          data.difficulty,
          data.headerImageUrl,
          data.categoryId,
          data.subcategoryId,
        );

      const questionId = info.lastInsertRowid as number;

      this.db
        .prepare(
          "INSERT INTO essay_details (question_id, model_answer) VALUES (?, ?)",
        )
        .run(questionId, data.modelAnswer);

      return questionId;
    });

    const questionId = insertQuestion(input);
    return this.findById(questionId)! as IEssayQuestion;
  }

  findById(id: number): IQuestions | undefined {
    const question = this.db
      .prepare<[number], QuestionRow>("SELECT * FROM questions WHERE _id = ?")
      .get(id);
    if (!question) return undefined;

    return this.attachDetails(question);
  }

  findAllGrouped(): IGroupedQuestionCategory[] {
    interface Row extends QuestionRow {
      category_id_ref: number;
      category_name: string;
      category_description: string | null;
      subcategory_id_ref: number;
      subcategory_name: string;
    }

    const rows = this.db
      .prepare<[], Row>(
        `SELECT
         q.*,
         c._id AS category_id_ref,
         c.name AS category_name,
         c.description AS category_description,
         s._id AS subcategory_id_ref,
         s.name AS subcategory_name
       FROM questions q
       JOIN categories c ON c._id = q.category_id
       JOIN subcategories s ON s._id = q.subcategory_id
       ORDER BY c.name, s.name, q._id`,
      )
      .all();

    // categoryId -> { category, subcategories: Map<subcategoryId, {...}> }
    const categoryMap = new Map<
      number,
      {
        category: ICategory;
        subcategories: Map<
          number,
          {
            subcategory: { name: string; _id: number };
            questions: IQuestions[];
          }
        >;
      }
    >();

    for (const row of rows) {
      const question = this.attachDetails(row);

      let categoryEntry = categoryMap.get(row.category_id_ref);
      if (!categoryEntry) {
        categoryEntry = {
          category: {
            _id: row.category_id_ref,
            name: row.category_name,
          },
          subcategories: new Map(),
        };
        categoryMap.set(row.category_id_ref, categoryEntry);
      }

      let subcategoryEntry = categoryEntry?.subcategories.get(
        row.subcategory_id_ref,
      );
      if (!subcategoryEntry) {
        subcategoryEntry = {
          subcategory: {
            _id: row.subcategory_id_ref,
            name: row.subcategory_name,
          },
          questions: [],
        };
        categoryEntry?.subcategories.set(
          row.subcategory_id_ref,
          subcategoryEntry,
        );
      }

      subcategoryEntry.questions.push(question);
    }

    const result: IGroupedQuestionCategory[] = [];
    for (const { category, subcategories } of categoryMap.values()) {
      result.push({
        category,
        grouped: Array.from(subcategories.values()),
      });
    }

    return result;
  }

  findByCategory(categoryId: number) {
    const rows = this.db
      .prepare<
        [number],
        QuestionRow
      >("SELECT * FROM questions WHERE category_id = ?")
      .all(categoryId);

    const result: IQuestions[] = [];
    if (rows)
      for (const row of rows) {
        result.push(this.attachDetails(row));
      }
    return result;
  }

  /** Used internally by the exam generator: raw matches for one (category, subcategory, difficulty) cell. */
  findByFilter(
    categoryId: number,
    subcategoryId: number,
    difficulty: number,
  ): QuestionRow[] {
    return this.db
      .prepare<[number, number, number], QuestionRow>(
        `SELECT * FROM questions
         WHERE category_id = ? AND subcategory_id = ? AND difficulty = ?`,
      )
      .all(categoryId, subcategoryId, difficulty);
  }

  updateMcq(updatedQuestion: IMcqQuestion): IMcqQuestion {
    const { choices, _id: id, ...base } = updatedQuestion;
    if (updatedQuestion.type === "mcq") {
      const key = choices.find((choice) => choice.isCorrect === true);
      const distractors = choices.filter(
        (choice) => choice.isCorrect === false,
      );

      this.db
        .prepare("UPDATE mcq_key SET correct_answer = ? WHERE question_id = ?")
        .run(key?.choice, id);

      this.db
        .prepare("DELETE FROM mcq_distractors WHERE question_id = ?")
        .run(id);
      const insertDistractor = this.db.prepare(
        "INSERT INTO mcq_distractors (question_id, distractor_text) VALUES (?, ?)",
      );
      for (const distractor of distractors) {
        insertDistractor.run(id, distractor.choice);
      }
      const applyUpdate = this.db.transaction(() => {
        this.updateBaseFields(id, base);
      });
      applyUpdate();
    }

    const updated = this.findById(id);
    if (!updated) throw new Error(`MCQ question ${id} not found`);
    return updated as IMcqQuestion;
  }

  updateEssay(updatedQuestion: IEssayQuestion): IEssayQuestion {
    const { _id: id, modelAnswer, ...base } = updatedQuestion;

    const applyUpdate = this.db.transaction(() => {
      this.updateBaseFields(id, base);

      if (modelAnswer !== undefined) {
        this.db
          .prepare(
            "UPDATE essay_details SET model_answer = ? WHERE question_id = ?",
          )
          .run(modelAnswer, id);
      }
    });

    applyUpdate();
    const updated = this.findById(id);
    if (!updated) throw new Error(`Essay question ${id} not found`);
    return updated as IEssayQuestion;
  }

  /** Cascades to mcq_key/mcq_distractors/essay_details automatically via ON DELETE CASCADE. */
  delete(id: number): void {
    console.log(id);
    const result = this.db
      .prepare("DELETE FROM questions WHERE _id = ?")
      .run(id);
    if (result.changes === 0) {
      throw new Error(`Question ${id} not found`);
    }
  }

  totalQuestionCount(): { total: number } | undefined {
    const result = this.db
      .prepare<
        [],
        { total: number }
      >("SELECT COUNT (*) as total FROM questions;")
      .get();
    return result;
  }

  totalQuestionsOfCategory() {
    const result = this.db
      .prepare<
        [],
        IQuestionCountByCategory[]
      >("SELECT  category_id, COUNT (*) as total FROM questions GROUP BY category_id;")
      .get();
    return result;
  }

  private updateBaseFields(id: number, updates: Partial<IQuestions>): void {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (updates.header !== undefined) {
      fields.push("header = ?");
      values.push(updates.header);
    }
    if (updates.difficulty !== undefined) {
      fields.push("difficulty = ?");
      values.push(updates.difficulty);
    }
    if (updates.headerImageUrl !== undefined) {
      fields.push("headerImageUrl = ?");
      values.push(updates.headerImageUrl);
    }

    if (updates.categoryId !== undefined) {
      fields.push("category_id = ?");
      values.push(updates.categoryId);
    }
    if (updates.subcategoryId !== undefined) {
      fields.push("subcategory_id = ?");
      values.push(updates.subcategoryId);
    }
    if (fields.length === 0) return;

    fields.push("updated_at = datetime('now')");
    values.push(id);

    this.db
      .prepare(`UPDATE questions SET ${fields.join(", ")} WHERE _id = ?`)
      .run(...values);
  }

  private attachDetails(question: QuestionRow): IQuestions {
    if (question.type === "mcq") {
      const key = this.db
        .prepare<
          [number],
          { correct_answer: string }
        >("SELECT correct_answer FROM mcq_key WHERE question_id = ?")
        .get(question._id);

      const distractors = this.db
        .prepare<[number], { distractor_text: string }>(
          "SELECT distractor_text FROM mcq_distractors WHERE question_id = ?",
        )
        .all(question._id)
        .map((row) => row.distractor_text);

      const choiceDistractors = distractors.map((distractor) => {
        return { choice: distractor, isCorrect: false };
      });

      return {
        ...question,
        categoryId: question.category_id,
        subcategoryId: question.subcategory_id,
        choices: [
          { choice: key?.correct_answer as string, isCorrect: true },
          ...choiceDistractors,
        ],
      };
    }

    const essayDetails = this.db
      .prepare<
        [number],
        { model_answer: string }
      >("SELECT model_answer FROM essay_details WHERE question_id = ?")
      .get(question._id);

    return {
      ...question,
      categoryId: question.category_id,
      subcategoryId: question.subcategory_id,
      modelAnswer: essayDetails?.model_answer as string,
    };
  }
}
