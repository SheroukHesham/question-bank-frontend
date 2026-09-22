import type Database from "better-sqlite3";
import type { FilteredQuestionRow, QuestionRow } from "../interfaces/index.js";
import {
  ICategory,
  ICreateEssayQuestion,
  ICreateMcqQuestion,
  IEssayQuestion,
  IExamCriteria,
  IFilteredQuestion,
  IFindQuestionsParams,
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
      subcategory_id_ref: number;
      subcategory_name: string;
    }

    const rows = this.db
      .prepare<[], Row>(
        `SELECT q.*, c._id AS category_id_ref, c.name AS category_name,
              s._id AS subcategory_id_ref, s.name AS subcategory_name
       FROM questions q
       JOIN categories c ON c._id = q.category_id
       JOIN subcategories s ON s._id = q.subcategory_id
       ORDER BY c.name, s.name, q._id`,
      )
      .all();

    const questions = this.attachDetailsBulk(rows);

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

    rows.forEach((row, i) => {
      let categoryEntry = categoryMap.get(row.category_id_ref);
      if (!categoryEntry) {
        categoryEntry = {
          category: { _id: row.category_id_ref, name: row.category_name },
          subcategories: new Map(),
        };
        categoryMap.set(row.category_id_ref, categoryEntry);
      }
      let subEntry = categoryEntry.subcategories.get(row.subcategory_id_ref);
      if (!subEntry) {
        subEntry = {
          subcategory: {
            _id: row.subcategory_id_ref,
            name: row.subcategory_name,
          },
          questions: [],
        };
        categoryEntry.subcategories.set(row.subcategory_id_ref, subEntry);
      }
      subEntry.questions.push(questions[i]);
    });

    return Array.from(categoryMap.values()).map(
      ({ category, subcategories }) => ({
        category,
        grouped: Array.from(subcategories.values()),
      }),
    );
  }

  findByCategory(categoryId: number) {
    const rows = this.db
      .prepare<
        [number],
        QuestionRow
      >("SELECT * FROM questions WHERE category_id = ? ORDER BY created_at DESC;")
      .all(categoryId);

    return this.attachDetailsBulk(rows);
  }

  findByFilterPaginated(params: IFindQuestionsParams): {
    questions: IFilteredQuestion[];
    hasMore: boolean;
  } {
    const conditions: string[] = [];
    const sqlParams: (string | number)[] = [];

    if (params.questionType) {
      conditions.push("q.type = ?");
      sqlParams.push(params.questionType);
    }
    if (params.categoryId) {
      conditions.push("q.category_id = ?");
      sqlParams.push(params.categoryId);
    }
    if (params.subcategoryId) {
      conditions.push("q.subcategory_id = ?");
      sqlParams.push(params.subcategoryId);
    }
    if (params.difficulty) {
      conditions.push("q.difficulty = ?");
      sqlParams.push(params.difficulty);
    }
    if (params.search) {
      conditions.push("q.header LIKE ? ESCAPE '\\' COLLATE NOCASE");
      sqlParams.push(`%${params.search.replace(/[%_]/g, "\\$&")}%`);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const rows = this.db
      .prepare<unknown[], FilteredQuestionRow>(
        `SELECT q.*, c.name AS category_name, s.name AS subcategory_name
       FROM questions q
       JOIN categories c ON q.category_id = c._id
       JOIN subcategories s ON q.subcategory_id = s._id
       ${whereClause}
       ORDER BY q.created_at DESC
       LIMIT ? OFFSET ?`,
      )
      .all(...sqlParams, params.limit, params.offset);

    const questions = this.attachDetailsBulk(rows);

    return {
      questions: questions.map((q, i) => ({
        ...q,
        categoryName: rows[i].category_name,
        subcategoryName: rows[i].subcategory_name,
      })),
      hasMore: rows.length === params.limit,
    };
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

  findQuestionsForExam(examId: number): IQuestions[] {
    const rows = this.db
      .prepare<[number], QuestionRow>(
        `SELECT q.* FROM questions q
       JOIN exam_questions eq ON eq.question_id = q._id
       WHERE eq.exam_id = ?
       ORDER BY eq.position ASC`,
      )
      .all(examId);
    return this.attachDetailsBulk(rows);
  }

  /** Cascades to mcq_key/mcq_distractors/essay_details automatically via ON DELETE CASCADE. */
  delete(id: number): void {
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

  generateQuestionsFromCriteria(
    criterion: IExamCriteria,
    excludeExamIds: number[],
  ): IQuestions[] {
    const placeholders = excludeExamIds.map(() => "?").join(",") || "NULL";

    const rows = this.db
      .prepare<unknown[], QuestionRow>(
        `SELECT * FROM questions
       WHERE type = ? AND category_id = ? AND subcategory_id = ? AND difficulty = ?
       AND _id NOT IN (SELECT question_id FROM exam_questions WHERE exam_id IN (${placeholders}))
       ORDER BY RANDOM()
       LIMIT ?`,
      )
      .all(
        criterion.examType,
        criterion.categoryId,
        criterion.subcategoryId,
        criterion.difficulty,
        ...excludeExamIds,
        criterion.numberOfQuestions,
      );

    if (rows.length === 0) {
      throw new Error("No available questions for criteria.", {
        cause: `${criterion._id}`,
      });
    }
    if (rows.length < criterion.numberOfQuestions) {
      throw new Error(
        `Not enough questions for this criteria, only ${rows.length} available.`,
        { cause: `${criterion._id}` },
      );
    }

    return this.attachDetailsBulk(rows);
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
        type: "mcq",
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
      type: "essay",
      categoryId: question.category_id,
      subcategoryId: question.subcategory_id,
      modelAnswer: essayDetails?.model_answer as string,
    };
  }

  private attachDetailsBulk(rows: QuestionRow[]): IQuestions[] {
    if (rows.length === 0) return [];

    const mcqIds = rows.filter((r) => r.type === "mcq").map((r) => r._id);
    const essayIds = rows.filter((r) => r.type === "essay").map((r) => r._id);

    const keyMap = new Map<number, string>();
    const distractorsMap = new Map<number, string[]>();
    const essayMap = new Map<number, string>();

    if (mcqIds.length > 0) {
      const ph = mcqIds.map(() => "?").join(",");

      this.db
        .prepare<unknown[], { question_id: number; correct_answer: string }>(
          `SELECT question_id, correct_answer FROM mcq_key WHERE question_id IN (${ph})`,
        )
        .all(...mcqIds)
        .forEach((r) => keyMap.set(r.question_id, r.correct_answer));

      this.db
        .prepare<unknown[], { question_id: number; distractor_text: string }>(
          `SELECT question_id, distractor_text FROM mcq_distractors WHERE question_id IN (${ph})`,
        )
        .all(...mcqIds)
        .forEach((r) => {
          const list = distractorsMap.get(r.question_id) ?? [];
          list.push(r.distractor_text);
          distractorsMap.set(r.question_id, list);
        });
    }

    if (essayIds.length > 0) {
      const ph = essayIds.map(() => "?").join(",");
      this.db
        .prepare<unknown[], { question_id: number; model_answer: string }>(
          `SELECT question_id, model_answer FROM essay_details WHERE question_id IN (${ph})`,
        )
        .all(...essayIds)
        .forEach((r) => essayMap.set(r.question_id, r.model_answer));
    }

    return rows.map((row) => {
      if (row.type === "mcq") {
        const distractors = distractorsMap.get(row._id) ?? [];
        return {
          ...row,
          type: "mcq",
          categoryId: row.category_id,
          subcategoryId: row.subcategory_id,
          choices: [
            { choice: keyMap.get(row._id) as string, isCorrect: true },
            ...distractors.map((d) => ({ choice: d, isCorrect: false })),
          ],
        } as IMcqQuestion;
      }
      return {
        ...row,
        type: "essay",
        categoryId: row.category_id,
        subcategoryId: row.subcategory_id,
        modelAnswer: essayMap.get(row._id) as string,
      } as IEssayQuestion;
    });
  }
}
