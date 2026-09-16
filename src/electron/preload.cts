import {
  ICategory,
  ICreateEssayQuestion,
  ICreateMcqQuestion,
  IEssayQuestion,
  IMcqQuestion,
  ISubCategory,
} from "@/shared/interfaces";
import { TQuestionTypes } from "@/shared/types";
import { webUtils } from "electron";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  question: {
    createMcq: (input: ICreateMcqQuestion) => {
      return ipcRenderer.invoke("question:createMcq", input);
    },
    createEssay: (input: ICreateEssayQuestion) => {
      return ipcRenderer.invoke("question:createEssay", input);
    },
    findQuestionById: (id: number) => {
      return ipcRenderer.invoke("question:findById", id);
    },
    findGroupedQuestions: () => {
      return ipcRenderer.invoke("question:findGroupedQuestions");
    },
    findByCategoryId: (categoryId: number) => {
      return ipcRenderer.invoke("question:findByCategoryId", categoryId);
    },
    filterQuestions: (
      questionType?: TQuestionTypes,
      categoryId?: number,
      subcategoryId?: number,
      difficulty?: number,
    ) => {
      return ipcRenderer.invoke(
        "question:findByFilter",
        questionType,
        categoryId,
        subcategoryId,
        difficulty,
      );
    },
    updateMcq: (id: number, updatedQuestion: IMcqQuestion) => {
      return ipcRenderer.invoke("question:updateMcq", id, updatedQuestion);
    },
    updateEssay: (id: number, updatedQuestion: IEssayQuestion) => {
      return ipcRenderer.invoke("question:updateEssay", id, updatedQuestion);
    },
    deleteQuestion: (id: number) => {
      return ipcRenderer.invoke("question:delete", id);
    },
    getTotalQuestions: () => {
      return ipcRenderer.invoke("question:findTotalQuestions");
    },
    getTotalQuestionsPerCategory: () => {
      return ipcRenderer.invoke("question:findTotalQuestionsPerCategory");
    },
  },
  image: {
    getPathForFile: (file: File): string => webUtils.getPathForFile(file),
  },

  category: {
    createCategory: (name: string) => {
      return ipcRenderer.invoke("category:create", name);
    },
    updateCategory: (category: ICategory) => {
      return ipcRenderer.invoke("category:update", category);
    },
    deleteCategory: (id: number) => {
      return ipcRenderer.invoke("category:delete", id);
    },
    getAllCategories: () => {
      return ipcRenderer.invoke("category:findAll");
    },
    getCategoryById: (id: number) => {
      return ipcRenderer.invoke("category:findById", id);
    },
    findCategoryByName: (name: string) => {
      return ipcRenderer.invoke("category:findByName", name);
    },
    findAllCategoriesDetails: () => {
      return ipcRenderer.invoke("category:findAllCategoriesDetails");
    },
    getGroupedCategorySubcategory: () => {
      return ipcRenderer.invoke("category:getGroupedCategorySubcategory");
    },
  },

  subcategory: {
    createSubcategory: (name: string, categoryId: number) => {
      return ipcRenderer.invoke("subcategory:create", name, categoryId);
    },
    updateSubcategory: (subcategory: ISubCategory) => {
      return ipcRenderer.invoke("subcategory:update", subcategory);
    },
    deleteSubcategory: (id: number) => {
      return ipcRenderer.invoke("subcategory:delete", id);
    },
    findAllSubcategories: () => {
      return ipcRenderer.invoke("subcategory:findAll");
    },
    findSubcategoryById: (id: number) => {
      return ipcRenderer.invoke("subcategory:findById", id);
    },
    findSubcategoryByCategoryId: (categoryId: number) => {
      return ipcRenderer.invoke("subcategory:findByCategory", categoryId);
    },
  },
});
