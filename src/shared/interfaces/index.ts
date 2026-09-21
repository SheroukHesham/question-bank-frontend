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
  // type: TQuestionTypes;
  headerImageUrl?: string;
}

export interface IEssayQuestion extends IQuestionBase {
  type: "essay";
  modelAnswer: string;
}

export interface IMcqQuestion extends IQuestionBase {
  type: "mcq";
  choices: IChoice[];
}

export type IQuestions = IEssayQuestion | IMcqQuestion;

export interface IFilteredQuestionBase {
  categoryName: string;
  subcategoryName: string;
}

export type IFilteredQuestion =
  | (IEssayQuestion & IFilteredQuestionBase)
  | (IMcqQuestion & IFilteredQuestionBase);

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

export interface IGroupedCategorySubcategory {
  categoryName: string;
  categoryId: number;
  subcategoryId: number;
  subcategoryName: string;
}

export interface IExamBase {
  title: string;
  totalNumberOfQuestions: number;
  numberOfQuestionsAdded: number;
  type: TQuestionTypes;
  examQuestions: { questionId: number; position: number }[];
  status: "final" | "draft";
}

export interface IExam extends IExamBase {
  _id: number;
  createdAt: string;
  updatedAt: string;
}

export interface IExamCriteria {
  _id: string;
  numberOfQuestions: number;
  difficulty: TQuestionDifficulty;
  categoryId: number;
  subcategoryId: number;
  examType: TQuestionTypes;
}
export interface IGenerateExamInput {
  criteria: IExamCriteria[];
  excludeExamIds?: number[];
}
