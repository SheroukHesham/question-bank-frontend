import type { TQuestionDifficulty } from "@/shared/types";

export const questionKeys = {
  all: ["questions"] as const,
  total: () => [...questionKeys.all, "total"] as const,
  totalPerCategory: () => [...questionKeys.all, "totalPerCategory"] as const,
  byExam: (examId: number) =>
    [...questionKeys.all, "findByExam", examId] as const,
  filtered: (params: {
    categoryId?: number;
    typeFilter?: string;
    specializationFilter?: number | null;
    search?: string;
    page?: number;
    difficulty?: TQuestionDifficulty;
  }) => [...questionKeys.all, "filtered", params] as const,
};

export const categoryKeys = {
  all: ["categories"] as const,
  findAllDetails: () => [...categoryKeys.all, "findAllDetails"] as const,
  byId: (id: number) => [...categoryKeys.all, "byId", id] as const,
  groupedCategorySubcategory: () =>
    [...categoryKeys.all, "getGroupedSubCat"] as const,
};

export const subcategoryKeys = {
  all: ["subcategories"] as const,
  byCategoryId: (categoryId: number) =>
    [...subcategoryKeys.all, "findByCategoryId", categoryId] as const,
  findById: (questionId: number) =>
    [...subcategoryKeys.all, "findById", questionId] as const,
  findAllDetails: () => [...subcategoryKeys.all, "findAllDetails"] as const,
};

export const examKeys = {
  all: ["exams"] as const,
  findAll: () => [...examKeys.all, "getAll"] as const,
  //   list: () => [...examKeys.all, "list"] as const,
  //   byId: (id: number) => [...examKeys.all, "byId", id] as const,
};
