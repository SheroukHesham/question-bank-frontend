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
  _id: -1,
  header: "",
  difficulty: "" as TQuestionDifficulty,
  categoryId: -1,
  subcategoryId: -1,

  type: "essay",
  modelAnswer: "",
};

export const defaultMcqQuestion: IMcqQuestion = {
  _id: -1,
  header: "",
  difficulty: "" as TQuestionDifficulty,
  categoryId: -1,
  subcategoryId: -1,

  type: "mcq",
  choices: [],
};

export const defaultEssayFormValues: QuestionFormValues = {
  type: "essay",
  header: "",
  difficulty: "" as TQuestionDifficulty,
  categoryId: -1,
  subcategoryId: -1,
  headerImageFile: "",
  modelAnswer: "",
};

export const defaultMcqFormValues: QuestionFormValues = {
  type: "mcq",
  header: "",
  difficulty: "" as TQuestionDifficulty,
  categoryId: -1,
  subcategoryId: -1,
  headerImageFile: "",
  choices: Array.from({ length: 5 }, () => ({ choice: "", isCorrect: false })),
};
