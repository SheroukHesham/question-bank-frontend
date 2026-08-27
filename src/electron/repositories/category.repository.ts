import type Database from "better-sqlite3";
import type { CategoryRow } from "../interfaces/index.js";

export class CategoriesRepository {
  constructor(private readonly db: Database.Database) {}

  create(name: string): CategoryRow {
    const existing = this.db
      .prepare<[string], CategoryRow>("SELECT * FROM categories WHERE name = ?")
      .get(name);
    if (existing) {
      throw new Error(`Category "${name}" already exists`);
    }

    const info = this.db
      .prepare("INSERT INTO categories (name) VALUES (?)")
      .run(name ?? null);

    return this.findById(info.lastInsertRowid as number)!;
  }

  findAll(): CategoryRow[] {
    return this.db
      .prepare<[], CategoryRow>("SELECT * FROM categories ORDER BY name ASC")
      .all();
  }

  findById(id: number): CategoryRow | undefined {
    return this.db
      .prepare<[number], CategoryRow>("SELECT * FROM categories WHERE id = ?")
      .get(id);
  }

  update(id: number, name: string, description?: string): CategoryRow {
    const result = this.db
      .prepare("UPDATE categories SET name = ?, description = ? WHERE id = ?")
      .run(name, description ?? null, id);
    if (result.changes === 0) {
      throw new Error(`Category ${id} not found`);
    }
    return this.findById(id)!;
  }

  /**
   * Deletes a category and cascades to its subcategories (via ON DELETE CASCADE).
   * Questions referencing this category use ON DELETE RESTRICT, so this will
   * throw a foreign-key error if any question still belongs to it - by design,
   * to stop a professor accidentally deleting a category full of questions.
   */
  delete(id: number): void {
    const result = this.db
      .prepare("DELETE FROM categories WHERE id = ?")
      .run(id);
    if (result.changes === 0) {
      throw new Error(`Category ${id} not found`);
    }
  }
}
