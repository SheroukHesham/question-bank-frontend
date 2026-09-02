import { ICategory } from "@/shared/interfaces/index.js";
import { CategoriesRepository } from "../repositories/category.repository.js";

export class CategoryService {
  constructor(private readonly categoryRepository: CategoriesRepository) {}

  findCategoryByName(name: string): ICategory | undefined {
    return this.categoryRepository.findByName(name);
  }

  createCategory(name: string): ICategory {
    if (!name.trim()) {
      throw new Error("Category name is required");
    }
    if (this.findCategoryByName(name)) {
      throw new Error("This category name already exists");
    }
    return this.categoryRepository.create(name);
  }

  updateCategory(category: ICategory): ICategory {
    const { _id, name } = category;
    if (!_id || !name.trim()) {
      throw new Error("Invalid Category");
    }

    if (this.findCategoryByName(name)) {
      throw new Error("This category name already exists.");
    }
    return this.categoryRepository.update(_id, name);
  }

  getAllCategories(): ICategory[] {
    return this.categoryRepository.findAll();
  }

  getCategoryById(id: number): ICategory | undefined {
    return this.categoryRepository.findById(id);
  }

  deleteCategory(id: number) {
    return this.categoryRepository.delete(id);
  }
  findCategoryById(id: number) {
    return this.categoryRepository.findById(id);
  }
  findAllCategoriesDetails() {
    return this.categoryRepository.findAllCategoriesDetails();
  }
}
