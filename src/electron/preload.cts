import { ICategory, ICreateMcqQuestion } from "@/shared/interfaces";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  questions: {
    createMcq: (input: ICreateMcqQuestion) => {
      return ipcRenderer.invoke("questions:createMcq", input);
    },
  },
  categories: {
    createCategory: (name: string) => {
      return ipcRenderer.invoke("categories:create", name);
    },
    updateCategory: (category: ICategory) => {
      return ipcRenderer.invoke("categories:update", category);
    },
    deleteCategory: (id: number) => {
      return ipcRenderer.invoke("categories:delete", id);
    },
    getAllCategories: () => {
      return ipcRenderer.invoke("categories:findAll");
    },
    getCategoryById: (id: number) => {
      return ipcRenderer.invoke("categories:findById", id);
    },
  },
});
