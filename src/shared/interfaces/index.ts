import type { TQuestionDifficulty, TQuestionTypes } from "../types";

export interface ICategories {
  _id: string;
  name: string;
  description: string;
  subCategories: string[];
}

export interface ISubCategories {
  _id: string;
  name: string;
  categoryId: string;
}

export interface IChoice {
  choice: string;
  isCorrect: boolean;
}

interface IQuestionBase {
  _id: string;
  header: string;
  difficulty: TQuestionDifficulty;
  categoryId: string;
  subcategoryId: string;
  createdBy: string;
  type: TQuestionTypes;
  headerImageUrl?: string;
}

export interface IEssayQuestion extends IQuestionBase {
  modelAnswer: string;
}

export interface IMcqQuestion extends IQuestionBase {
  choices: IChoice[];
}

export type IQuestions = IEssayQuestion | IMcqQuestion;

export interface ICriteria {
  _id: string;
  numberOfQuestions: number;
  difficulty: TQuestionDifficulty;
  categoryId: string;
  subId: string;
}
