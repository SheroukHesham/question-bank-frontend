import type { IEssayQuestion, IMcqQuestion, IQuestions } from "@/interfaces";
import type { QuestionFormValues } from "@/validation";

export const isEssayQuestion = (q: IQuestions): q is IEssayQuestion =>
  q.type === "essay";
export const isMcqQuestion = (q: IQuestions): q is IMcqQuestion =>
  q.type === "mcq";

export const toFormValues = (q: IQuestions): QuestionFormValues =>
  q.type === "essay"
    ? {
        type: "essay",
        header: q.header,
        difficulty: q.difficulty,
        mark: q.mark,
        categoryId: q.categoryId,
        subcategoryId: q.subcategoryId,
        modelAnswer: q.modelAnswer,
      }
    : {
        type: "mcq",
        header: q.header,
        difficulty: q.difficulty,
        mark: q.mark,
        categoryId: q.categoryId,
        subcategoryId: q.subcategoryId,
        key: q.key,
        distractors: q.distractors.map((value) => ({ value })),
      };
