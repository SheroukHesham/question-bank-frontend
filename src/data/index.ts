import type { IEssayQuestion, IMcqQuestion, INavbar } from "@/interfaces";

export const NAVBAR_ITEMS: INavbar[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    to: "/",
  },
  {
    id: "questions",
    label: "Questions",
    to: "/questions",
    subLinks: [
      {
        id: "essay",
        label: "Essay Questions",
        to: "/questions/essay",
      },
      {
        id: "mcq",
        label: "MCQ Questions",
        to: "/questions/mcq",
      },
    ],
  },
  {
    id: "categories",
    label: "Categories",
    to: "/categories",
  },
  {
    id: "exams",
    label: "Exams",
    to: "/exams",
  },
];
export const defaultQuestion: IEssayQuestion = {
  _id: "",
  header: "",
  difficulty: 1,
  mark: 1,
  categoryId: "",
  subcategoryId: "",
  createdBy: "",
  type: "essay",
  modelAnswer: "",
};

export const defaultMcqQuestion: IMcqQuestion = {
  _id: "",
  header: "",
  difficulty: 1,
  mark: 1,
  categoryId: "",
  subcategoryId: "",
  createdBy: "",
  type: "mcq",
  key: "",
  distractors: ["", "", "", ""],
};

import type { QuestionFormValues } from "@/validation";

export const defaultEssayFormValues: QuestionFormValues = {
  type: "essay",
  header: "",
  difficulty: 0,
  mark: 0,
  categoryId: "",
  subcategoryId: "",
  modelAnswer: "",
};

export const defaultMcqFormValues: QuestionFormValues = {
  type: "mcq",
  header: "",
  difficulty: 0,
  mark: 0,
  categoryId: "",
  subcategoryId: "",
  key: "",
  distractors: [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
};
