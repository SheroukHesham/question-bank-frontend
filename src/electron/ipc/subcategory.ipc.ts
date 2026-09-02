import { ipcMain } from "electron";
import { SubCategoryService } from "../services/subcategory.service.js";
import { ISubCategory } from "@/shared/interfaces/index.js";

export function registerSubcategoryIPC(subcategoryService: SubCategoryService) {
  ipcMain.handle(
    "subcategory:create",
    async (_event, name: string, categoryId: number) => {
      return subcategoryService.createSubcategory(name, categoryId);
    },
  );
  ipcMain.handle(
    "subcategory:update",
    async (_event, subcategory: ISubCategory) => {
      return subcategoryService.updateSubcategory(subcategory);
    },
  );
  ipcMain.handle("subcategory:delete", async (_event, id: number) => {
    return subcategoryService.deleteSubcategory(id);
  });
  ipcMain.handle("subcategory:findAll", async (_event) => {
    return subcategoryService.getAllSubcategories();
  });
  ipcMain.handle(
    "subcategory:findByCategory",
    async (_event, categoryId: number) => {
      return subcategoryService.getSubcategoryByCategory(categoryId);
    },
  );
  ipcMain.handle("subcategory:findById", async (_event, id: number) => {
    return subcategoryService.findSubcategoryById(id);
  });
}
