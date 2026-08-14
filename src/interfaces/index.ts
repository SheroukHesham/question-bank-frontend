import type { TQuestionDifficulty } from "@/types";
import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export interface INavbar {
  id: string;
  label: string;
  to?: string;
  subLinks?: INavbar[];
  icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

export interface IRadioGroupItem {
  id: string;
  value: string;
  title: string;
  description?: string;
  icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
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
  type: "mcq" | "essay";
  headerImageUrl?: string;
}

export interface IEssayQuestion extends IQuestionBase {
  modelAnswer: string;
}

export interface IMcqQuestion extends IQuestionBase {
  choices: IChoice[];
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
