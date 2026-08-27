import { ipcMain } from "electron";
import { CategoryService } from "../services/category.service.js";
import { ICategory } from "@/shared/interfaces/index.js";

export function registerCategoryIPC(categoryService: CategoryService) {
  ipcMain.handle("categories:create", async (_event, name: string) => {
    return categoryService.createCategory(name);
  });
  ipcMain.handle("categories:update", async (_event, category: ICategory) => {
    return categoryService.updateCategory(category);
  });
  ipcMain.handle("categories:delete", (_event, id: number) => {
    return categoryService.deleteCategory(id);
  });
  ipcMain.handle("categories:findAll", (_event) => {
    return categoryService.getAllCategories();
  });
  ipcMain.handle("categories:findById", (_event, id: number) => {
    return categoryService.getCategoryById(id);
  });
}
