import type { INavbar } from "@/interfaces";

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
