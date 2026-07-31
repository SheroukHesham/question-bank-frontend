export interface INavbar {
  id: string;
  label: string;
  to: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  verified: boolean;
  role: string;
  profilePicture: string;
}

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

interface IQuestionBase {
  _id: string;
  header: string;
  difficulty: number;
  mark: number;
  categoryId: string;
  subcategoryId: string;
  createdBy: string;
}

export interface IEssayQuestion extends IQuestionBase {
  type: "essay";
  modelAnswer: string;
}
type d = [string, string, string, string];

export interface IMcqQuestion extends IQuestionBase {
  type: "mcq";
  key: string;
  distractors: d;
}

export type IQuestions = IEssayQuestion | IMcqQuestion;

export interface IGroupedQuestions {
  categories: IQuestionCategory[];
}

export interface IQuestionCategory {
  _id: string;
  name: string;
  description: string;
  subcategories: IQuestionSubcategory[];
}

export interface IQuestionSubcategory {
  _id: string;
  name: string;
  categoryId: string;
  questions: IQuestions[];
}
