import type { IGroupedQuestions } from "@/ui/interfaces";
import type {
  ICategory,
  ICreateEssayQuestion,
  IEssayQuestion,
  IQuestionCountByCategory,
  IQuestions,
  ISubCategory,
} from "./interfaces";
import type { ICreateMcqQuestion, IMcqQuestion } from "./question";

export {};

declare global {
  interface Window {
    electron: {
      question: {
        createMcq(input: ICreateMcqQuestion): Promise<IMcqQuestion>;
        createEssay(input: ICreateEssayQuestion): Promise<IEssayQuestion>;
        findQuestionById(id: number): Promise<IQuestions>;
        findGroupedQuestions(): Promise<IGroupedQuestions[]>;
        filterQuestions(
          categoryId: number,
          subcategoryId: number,
          difficulty: number,
        ): Promise<IQuestions[]>;
        updateMcq(updatedQuestion: IMcqQuestion): Promise<IMcqQuestion>;
        updateEssay(updatedQuestion: IEssayQuestion): Promise<IEssayQuestion>;
        deleteQuestion(id: number): Promise<void>;
        getTotalQuestions(): Promise<{ total: number } | undefined>;
        getTotalQuestionsPerCategory(): Promise<
          IQuestionCountByCategory[] | undefined
        >;
      };
      category: {
        createCategory(name: string): Promise<ICategory>;
        updateCategory(category: ICategory): Promise<ICategory>;
        deleteCategory(id: number): void;
        getAllCategories(): Promise<ICategory[]>;
        getCategoryById(id: number): Promise<ICategory | undefined>;
      };
      subcategory: {
        findSubcategoryByName(name: string): Promise<ISubCategory | undefined>;
        findSubcategoryById(id: number): Promise<ISubCategory | undefined>;
        createSubcategory(
          name: string,
          categoryId: number,
        ): Promise<ISubCategory>;
        updateSubcategory(subcategory: ISubCategory): Promise<ISubCategory>;
        deleteSubcategory(id: number): void;
        findAllSubcategories(): Promise<ISubCategory[]>;
        findSubcategoryByCategoryId(
          categoryId: number,
        ): Promise<ISubCategory[]>;
      };
    };
  }
}
