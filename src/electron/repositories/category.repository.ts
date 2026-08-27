import type Database from "better-sqlite3";
import type { CategoryRow } from "../interfaces/index.js";
import { ICategory } from "@/shared/interfaces/index.js";

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
}
