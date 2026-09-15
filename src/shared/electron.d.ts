import type {
  ICategory,
  ICategoryDetails,
  ICreateEssayQuestion,
  IEssayQuestion,
  IGroupedCategorySubcategory,
  IGroupedQuestionCategory,
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
        findGroupedQuestions(): Promise<IGroupedQuestionCategory[]>;
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
        findByCategoryId(categoryId: number): Promise<IQuestions[]>;
      };
      image: {
        getPathForFile(file: File): Promise<string>;
      };
      category: {
        createCategory(name: string): Promise<ICategory>;
        updateCategory(category: ICategory): Promise<ICategory>;
        deleteCategory(id: number): Promise<void>;
        getAllCategories(): Promise<ICategory[]>;
        getCategoryById(id: number): Promise<ICategory | undefined>;
        findCategoryByName(name: string): Promise<ICategory | undefined>;
        findAllCategoriesDetails(): Promise<ICategoryDetails[] | undefined>;
        getGroupedCategorySubcategory(): Promise<IGroupedCategorySubcategory[]>;
      };
      subcategory: {
        findSubcategoryByName(name: string): Promise<ISubCategory | undefined>;
        findSubcategoryById(id: number): Promise<ISubCategory | undefined>;
        createSubcategory(
          name: string,
          categoryId: number,
        ): Promise<ISubCategory>;
        updateSubcategory(subcategory: ISubCategory): Promise<ISubCategory>;
        deleteSubcategory(id: number): Promise<void>;
        findAllSubcategories(): Promise<ISubCategory[]>;
        findSubcategoryByCategoryId(
          categoryId: number,
        ): Promise<ISubCategory[]>;
      };
    };
  }
}
