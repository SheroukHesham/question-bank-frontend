import type Database from "better-sqlite3";
import type { SubcategoryRow } from "../interfaces/index.js";
import { ISubCategory } from "@/shared/interfaces/index.js";

export class SubcategoryRepository {
  constructor(private readonly db: Database.Database) {}

  create(name: string, categoryId: number): ISubCategory {
    const existing = this.db
      .prepare<
        [string, number],
        SubcategoryRow
      >("SELECT * FROM subcategories WHERE name = ? AND category_id = ?")
      .get(name, categoryId);
    if (existing) {
      throw new Error(`Subcategory "${name}" already exists in this category`);
    }

    const info = this.db
      .prepare("INSERT INTO subcategories (name, category_id) VALUES (?, ?)")
      .run(name, categoryId);

    return this.findById(info.lastInsertRowid as number)!;
  }

  findAll(): ISubCategory[] {
    const rawSubcategories = this.db
      .prepare<
        [],
        SubcategoryRow
      >("SELECT * FROM subcategories ORDER BY name ASC")
      .all();

    const subcategories: ISubCategory[] = rawSubcategories.map(
      (subcategory) => {
        return {
          _id: subcategory._id,
          name: subcategory.name,
          categoryId: subcategory?.category_id,
        };
      },
    );

    return subcategories;
  }

  findByCategory(categoryId: number): ISubCategory[] {
    const rawSubcategories = this.db
      .prepare<
        [number],
        SubcategoryRow
      >("SELECT * FROM subcategories WHERE category_id = ? ORDER BY name ASC")
      .all(categoryId);

    const subcategories: ISubCategory[] = rawSubcategories.map(
      (subcategory) => {
        return {
          _id: subcategory._id,
          name: subcategory.name,
          categoryId: subcategory?.category_id,
        };
      },
    );

    return subcategories;
  }

  findByName(name: string): ISubCategory | undefined {
    const subcategory = this.db
      .prepare<
        string,
        SubcategoryRow
      >("SELECT * FROM subcategories WHERE name = ?")
      .get(name);
    if (subcategory)
      return {
        _id: subcategory._id,
        name: subcategory.name,
        categoryId: subcategory?.category_id,
      };
    else return undefined;
  }

  findById(id: number): ISubCategory | undefined {
    const subcategory = this.db
      .prepare<
        [number],
        SubcategoryRow
      >("SELECT * FROM subcategories WHERE _id = ?")
      .get(id);
    if (subcategory)
      return {
        _id: subcategory._id,
        name: subcategory.name,
        categoryId: subcategory?.category_id,
      };
    else return undefined;
  }

  update(id: number, name: string, categoryId: number): ISubCategory {
    const result = this.db
      .prepare(
        "UPDATE subcategories SET name = ?, category_id = ? WHERE _id = ?",
      )
      .run(name, categoryId, id);
    if (result.changes === 0) {
      throw new Error(`Subcategory ${id} not found`);
    }
    return this.findById(id)!;
  }

  delete(id: number): void {
    const result = this.db
      .prepare("DELETE FROM subcategories WHERE _id = ?")
      .run(id);
    if (result.changes === 0) {
      throw new Error(`Subcategory ${id} not found`);
    }
  }
}
