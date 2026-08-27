import type { IEssayQuestion, IMcqQuestion } from "@/shared/interfaces";
import type { TQuestionDifficulty } from "@/shared/types";
import type { INavbar, IRadioGroupItem } from "@/ui/interfaces";
import type { QuestionFormValues } from "@/ui/validation";
import {
  CircleQuestionMark,
  FileText,
  // House,
  PenLine,
  SquareCheckBig,
} from "lucide-react";

export const NAVBAR_ITEMS: INavbar[] = [
  // {
  //   id: "dashboard",
  //   label: "Dashboard",
  //   to: "/",
  //   icon: House,
  // },
  {
    id: "questions",
    label: "Questions",
    icon: CircleQuestionMark,
    subLinks: [
      {
        id: "all-questions",
        label: "All Questions",
        to: "/",
      },
      {
        id: "questions-categories",
        label: "Question Topics",
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
  difficulty: "" as TQuestionDifficulty,
  categoryId: "",
  subcategoryId: "",
  createdBy: "",
  type: "essay",
  modelAnswer: "",
};

export const defaultMcqQuestion: IMcqQuestion = {
  _id: "",
  header: "",
  difficulty: "" as TQuestionDifficulty,
  categoryId: "",
  subcategoryId: "",
  createdBy: "",
  type: "mcq",
  choices: [],
};

export const defaultEssayFormValues: QuestionFormValues = {
  type: "essay",
  header: "",
  difficulty: "" as TQuestionDifficulty,
  categoryId: "",
  subcategoryId: "",
  modelAnswer: "",
};

export const defaultMcqFormValues: QuestionFormValues = {
  type: "mcq",
  header: "",
  difficulty: "" as TQuestionDifficulty,
  categoryId: "",
  subcategoryId: "",
  choices: Array.from({ length: 5 }, () => ({ choice: "", isCorrect: false })),
};
