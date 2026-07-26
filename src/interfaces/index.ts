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
}

export interface ISubCategories {
  _id: string;
  name: string;
  categoryId: string;
}

export interface IQuestions {
  _id: string;
  type: "mcq" | "essay";
  header: string;
  difficulty: number;
  mark: number;
  categoryId: string;
  subcategoryId: string;
  key?: string;
  distractors?: string[];
  modelAnswer?: string;
  createdBy: string;
}

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
