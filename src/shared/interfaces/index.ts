import type { TQuestionDifficulty, TQuestionTypes } from "../types/index.ts";

interface ICreateQuestionBase {
  header: string;
  difficulty: TQuestionDifficulty;
  categoryId: number;
  subcategoryId: number;
  headerImageUrl?: string;
}

export interface ICreateMcqQuestion extends ICreateQuestionBase {
  type: "mcq";
  choices: IChoice[];
}
export interface ICreateEssayQuestion extends ICreateQuestionBase {
  type: "essay";
  modelAnswer: string;
}

export interface ICategory {
  _id: number;
  name: string;
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

export interface IQuestionBase {
  _id: number;
  header: string;
  difficulty: TQuestionDifficulty;
  categoryId: number;
  subcategoryId: number;
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
export interface IQuestionCountByCategory {
  categoryId: number;
  total: number;
}

export interface ICategoryDetails {
  totalQuestions: number;
  categoryName: string;
  categoryId: number;
  subcategories: string[];
}

export interface IGroupedQuestionCategory {
  category: ICategory;
  grouped: {
    subcategory: { name: string; _id: number };
    questions: IQuestions[];
  }[];
}
