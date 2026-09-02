import type Database from "better-sqlite3";
import type { CategoryRow } from "../interfaces/index.js";
import { ICategory, ICategoryDetails } from "@/shared/interfaces/index.js";

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
      .prepare("UPDATE categories SET name = ? WHERE id = ?")
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
        "SELECT Count (q._id) as totalQuestions, c.name AS categoryName, c._id as categoryId, s.name AS subcategoryName FROM questions q JOIN categories c ON c._id = q.category_id JOIN subcategories s ON s._id = q.subcategory_id GROUP BY c.name,s.name ORDER BY c.name, s.name, q._id;",
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
}
