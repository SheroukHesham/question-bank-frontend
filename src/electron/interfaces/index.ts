import type {
  TQuestionDifficulty,
  TQuestionTypes,
} from "../../shared/types/index.ts";

export interface CategoryRow {
  _id: number;
  name: string;
  created_at: string;
}

export interface SubcategoryRow {
  _id: number;
  name: string;
  category_id: number;
  created_at: string;
}

export interface QuestionRow {
  _id: number;
  type: TQuestionTypes;
  header: string;
  difficulty: TQuestionDifficulty;
  category_id: number;
  subcategory_id: number;
  created_at: string;
  updated_at: string;
}

export interface FilteredQuestionRow extends QuestionRow {
  category_name: string;
  subcategory_name: string;
}

export interface McqKeyRow {
  question_id: number;
  correct_answer: string;
}

export interface McqDistractorRow {
  id: number;
  question_id: number;
  distractor_text: string;
}

export interface EssayDetailRow {
  question_id: number;
  model_answer: string;
}

export type ExamStatus = "draft" | "final";

export interface ExamRow {
  _id: number;
  title: string;
  totalNumberOfQuestions: number;
  numberOfQuestionsAdded: number;
  type: TQuestionTypes;
  status: ExamStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ExamQuestionRow {
  id: number;
  examId: number;
  questionId: number;
  position: number;
}
