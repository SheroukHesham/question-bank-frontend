import type { TQuestionDifficulty, TQuestionTypes } from "../types/index.ts";

export interface ICategory {
  _id: number;
  name: string;
  subCategories: string[];
}

export interface ISubCategory {
  _id: number;
  name: string;
  categoryId: number;
}

export interface IChoice {
  choice: string;
  isCorrect: boolean;
}

interface IQuestionBase {
  _id: number;
  header: string;
  difficulty: TQuestionDifficulty;
  categoryId: string;
  subcategoryId: string;
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
