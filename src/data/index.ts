import type {
  IEssayQuestion,
  IMcqQuestion,
  INavbar,
  IRadioGroupItem,
} from "@/interfaces";
import type { QuestionFormValues } from "@/validation";
import {
  CircleQuestionMark,
  FileText,
  House,
  PenLine,
  SquareCheckBig,
} from "lucide-react";

export const NAVBAR_ITEMS: INavbar[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    to: "/",
    icon: House,
  },
  {
    id: "questions",
    label: "Questions",
    icon: CircleQuestionMark,
    subLinks: [
      {
        id: "all-questions",
        label: "All Questions",
        to: "/questions",
      },
      {
        id: "create-questions",
        label: "Create New Question",
        to: "/questions/essay",
      },

      {
        id: "questions-categories",
        label: "Question Category",
        to: "/categories",
      },
    ],
  },
  {
    id: "exams",
    label: "Exams",
    to: "/exams",
    icon: FileText,
  },
];

export const RadioQuestionGroup: IRadioGroupItem[] = [
  {
    id: "mcq",
    title: "MCQ",
    value: "mcq",
    icon: SquareCheckBig,
    description: "MCQ Question",
  },
  {
    id: "essay",
    title: "Essay",
    value: "essay",
    icon: PenLine,
    description: "Essay Question",
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
  choices: [
    // { value: "", isCorrect: false },
    // { value: "", isCorrect: false },
    // { value: "", isCorrect: false },
    // { value: "", isCorrect: false },
    // { value: "", isCorrect: false },
  ],
};
