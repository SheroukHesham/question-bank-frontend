import type { IQuestions } from "@/shared/interfaces";
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
