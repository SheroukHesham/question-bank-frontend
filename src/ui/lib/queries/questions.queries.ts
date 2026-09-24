import { questionKeys } from "./keys";
import type { TQuestionTypeFilter } from "@/ui/types";
import type { TQuestionDifficulty } from "@/shared/types";

export const questionQueries = {
  total: () => ({
    queryKey: questionKeys.total(),
    queryFn: () => window.electron.question.getTotalQuestions(),
  }),

  byExam: (examId?: number) => ({
    queryKey: questionKeys.byExam(examId!),
    queryFn: () => window.electron.question.findQuestionsForExam(examId!),
    enabled: examId !== undefined,
  }),

  totalPerCategory: () => ({
    queryKey: questionKeys.totalPerCategory(),
    queryFn: () => window.electron.question.getTotalQuestionsPerCategory(),
  }),

  filtered: (params: {
    categoryId?: number;
    typeFilter?: TQuestionTypeFilter;
    specializationFilter?: number | null;
    search?: string;
    difficulty?: TQuestionDifficulty;
    currentPage: number;
    PAGE_SIZE: number;
  }) => ({
    queryKey: questionKeys.filtered(params),
    queryFn: () =>
      window.electron.question.findByFilterPaginated({
        categoryId: params.categoryId,
        questionType:
          params.typeFilter === "all" ? undefined : params.typeFilter,
        subcategoryId: params.specializationFilter
          ? Number(params.specializationFilter)
          : undefined,
        difficulty: params.difficulty,
        search: params.search || undefined,
        limit: params.PAGE_SIZE,
        offset: (params.currentPage - 1) * params.PAGE_SIZE,
      }),

    placeholderData: (prev: unknown) => prev,
  }),
};
