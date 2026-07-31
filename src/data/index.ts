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
