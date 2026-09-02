import { ipcMain } from "electron";
import { CategoryService } from "../services/category.service.js";
import { ICategory } from "@/shared/interfaces/index.js";

export function registerCategoryIPC(categoryService: CategoryService) {
  ipcMain.handle("category:create", async (_event, name: string) => {
    return categoryService.createCategory(name);
  });
  ipcMain.handle("category:update", async (_event, category: ICategory) => {
    return categoryService.updateCategory(category);
  });
  ipcMain.handle("category:delete", (_event, id: number) => {
    return categoryService.deleteCategory(id);
  });
  ipcMain.handle("category:findAll", (_event) => {
    return categoryService.getAllCategories();
  });
  ipcMain.handle("category:findById", (_event, id: number) => {
    return categoryService.getCategoryById(id);
  });
  ipcMain.handle("category:findByName", (_event, name: string) => {
    return categoryService.findCategoryByName(name);
  });
  ipcMain.handle("category:findAllCategoriesDetails", (_event) => {
    return categoryService.findAllCategoriesDetails();
  });
  ipcMain.handle("category:getGroupedCategorySubcategory", (_event) => {
    return categoryService.getGroupCategorySubcategory();
  });
}
