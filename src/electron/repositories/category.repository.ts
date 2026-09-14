import type Database from "better-sqlite3";
import type { CategoryRow } from "../interfaces/index.js";
import {
  ICategory,
  ICategoryDetails,
  IGroupedCategorySubcategory,
} from "@/shared/interfaces/index.js";

export class CategoriesRepository {
  constructor(private readonly db: Database.Database) {}

  create(name: string): ICategory {
    const existing = this.db
      .prepare<[string], CategoryRow>("SELECT * FROM categories WHERE name = ?")
      .get(name);
    if (existing) {
      throw new Error(`Category "${name}" already exists`);
    }
    if (name === null) throw new Error(`Category name cannot be null.`);

    const info = this.db
      .prepare("INSERT INTO categories (name) VALUES (?)")
      .run(name);

    return this.findById(info.lastInsertRowid as number)!;
  }

  findAll(): ICategory[] {
    return this.db
      .prepare<[], ICategory>("SELECT * FROM categories ORDER BY name ASC")
      .all();
  }

  findById(id: number): ICategory | undefined {
    return this.db
      .prepare<[number], ICategory>("SELECT * FROM categories WHERE _id = ?")
      .get(id);
  }

  findByName(name: string): ICategory | undefined {
    return this.db
      .prepare<[string], ICategory>("SELECT * FROM categories WHERE name = ?")
      .get(name);
  }

  update(id: number, name: string): ICategory {
    const result = this.db
      .prepare("UPDATE categories SET name = ? WHERE _id = ?")
      .run(name, id);
    if (result.changes === 0) {
      throw new Error(`Category ${id} not found`);
    }
    return this.findById(id)!;
  }

  delete(id: number): void {
    const result = this.db
      .prepare("DELETE FROM categories WHERE _id = ?")
      .run(id);
    if (result.changes === 0) {
      throw new Error(`Category ${id} not found`);
    }
  }

  findAllCategoriesDetails(): ICategoryDetails[] {
    const rows = this.db
      .prepare<
        [],
        {
          totalQuestions: number;
          categoryName: string;
          categoryId: number;
          subcategoryName: string;
        }
      >(
        "SELECT c._id AS categoryId,c.name AS categoryName,s._id AS subcategoryId,s.name AS subcategoryName,COUNT(q._id) AS totalQuestions FROM categories c LEFT JOIN subcategories s ON s.category_id = c._id LEFT JOIN questions q ON q.subcategory_id = s._id GROUP BY c._id,  c.name,  s._id,  s.name ORDER BY c.name, s.name;",
      )
      .all();

    const category_subcategoryMap = new Map<number, ICategoryDetails>();

    for (const row of rows) {
      if (category_subcategoryMap.has(row.categoryId)) {
        const old_value = category_subcategoryMap.get(
          row.categoryId,
        ) as ICategoryDetails;
        const new_value: ICategoryDetails = {
          ...old_value,
          totalQuestions: old_value?.totalQuestions + row.totalQuestions,
          subcategories: [...old_value.subcategories, row.subcategoryName],
        };
        category_subcategoryMap.set(row.categoryId, new_value);
      } else {
        category_subcategoryMap.set(row.categoryId, {
          ...row,
          subcategories: [row.subcategoryName],
        });
      }
    }

    const result: ICategoryDetails[] = [];
    for (const value of category_subcategoryMap.values()) {
      result.push(value);
    }

    return result;
  }

  getGroupCategorySubcategory() {
    return this.db
      .prepare<
        [],
        IGroupedCategorySubcategory
      >("SELECT categories._id as categoryId, categories.name as categoryName, subcategories._id as subcategoryId, subcategories.name as subcategoryName FROM categories LEFT JOIN subcategories ON subcategories.category_id= categories._id ORDER BY categories.name, subcategories.name;")
      .all();
  }
}
