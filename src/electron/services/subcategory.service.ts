import { ISubCategory } from "@/shared/interfaces/index.js";
import { SubcategoryRepository } from "../repositories/subcategory.repository.js";
import { validateSubcategory } from "../validation/index.js";
import { CategoryService } from "./category.service.js";

export class SubCategoryService {
  constructor(
    private readonly SubcategoriesRepository: SubcategoryRepository,
    private readonly categoriesService: CategoryService,
  ) {}

  findSubcategoryByName(name: string): ISubCategory | undefined {
    return this.SubcategoriesRepository.findByName(name);
  }

  findSubcategoryByNameAndCategory(
    name: string,
    categoryId: number,
    excludeId?: number,
  ): ISubCategory | undefined {
    return this.SubcategoriesRepository.findByNameAndCategory(
      name,
      categoryId,
      excludeId,
    );
  }

  findSubcategoryById(id: number): ISubCategory | undefined {
    return this.SubcategoriesRepository.findById(id);
  }

  createSubcategory(name: string, categoryId: number): ISubCategory {
    validateSubcategory(
      name,
      categoryId,
      () => this.findSubcategoryByName(name),
      this.categoriesService,
    );
    return this.SubcategoriesRepository.create(name, categoryId);
  }

  updateSubcategory(subcategory: ISubCategory): ISubCategory {
    const { _id, categoryId, name } = subcategory;
    if (!this.findSubcategoryById(_id))
      throw new Error("This type does not exist");

    try {
      validateSubcategory(
        name,
        categoryId,
        () => this.findSubcategoryByNameAndCategory(name, categoryId, _id),
        this.categoriesService,
      );
    } catch (error) {
      throw new Error("Failed to validate subcategory", { cause: error });
    }

    return this.SubcategoriesRepository.update(_id, name, categoryId);
  }

  deleteSubcategory(id: number): void {
    if (!this.findSubcategoryById(id))
      throw new Error("This type does not exist");

    return this.SubcategoriesRepository.delete(id);
  }

  getAllSubcategories(): ISubCategory[] {
    return this.SubcategoriesRepository.findAll();
  }

  async getSubcategoryByCategory(categoryId: number): Promise<ISubCategory[]> {
    if (!categoryId) throw new Error("Topic is required");
    if (!this.categoriesService.findCategoryById(categoryId))
      throw new Error("This Topic does not exist");

    return this.SubcategoriesRepository.findByCategory(categoryId);
  }
}
