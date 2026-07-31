import type { IEssayQuestion, IMcqQuestion, IQuestions } from "@/interfaces";

export const isEssayQuestion = (q: IQuestions): q is IEssayQuestion =>
  q.type === "essay";
export const isMcqQuestion = (q: IQuestions): q is IMcqQuestion =>
  q.type === "mcq";
