import type Database from "better-sqlite3";
import type { SubcategoryRow } from "../interfaces/index.js";

export class SubcategoriesRepository {
  constructor(private readonly db: Database.Database) {}

  create(name: string, categoryId: number): SubcategoryRow {
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

  findAll(): SubcategoryRow[] {
    return this.db
      .prepare<
        [],
        SubcategoryRow
      >("SELECT * FROM subcategories ORDER BY name ASC")
      .all();
  }

  findByCategory(categoryId: number): SubcategoryRow[] {
    return this.db
      .prepare<
        [number],
        SubcategoryRow
      >("SELECT * FROM subcategories WHERE category_id = ? ORDER BY name ASC")
      .all(categoryId);
  }

  findById(id: number): SubcategoryRow | undefined {
    return this.db
      .prepare<
        [number],
        SubcategoryRow
      >("SELECT * FROM subcategories WHERE _id = ?")
      .get(id);
  }

  update(id: number, name: string, categoryId: number): SubcategoryRow {
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
