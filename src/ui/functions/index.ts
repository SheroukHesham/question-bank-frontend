import type {
  IEssayQuestion,
  IMcqQuestion,
  IQuestions,
} from "@/shared/interfaces";

// import type { QuestionFormValues } from "@/validation";

export const isEssayQuestion = (q: IQuestions): q is IEssayQuestion =>
  q.type === "essay";
export const isMcqQuestion = (q: IQuestions): q is IMcqQuestion =>
  q.type === "mcq";

export const splitFunction = (text: string, splitter: string) => {
  return text.split(splitter);
};
