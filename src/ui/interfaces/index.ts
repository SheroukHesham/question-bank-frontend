import type { IQuestions } from "@/shared/interfaces";
import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { TNavBarLinks } from "../types";

export interface INavbar {
  id: TNavBarLinks;
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

export interface IQuestionSubcategory {
  _id: string;
  name: string;
  categoryId: string;
  questions: IQuestions[];
}
