import path from "node:path";
import Database from "better-sqlite3";
import { runMigrations } from "./schema.js";
import { app } from "electron";

let dbInstance: Database.Database | null = null;

function getDefaultDbPath(): string {
  return path.join(app.getPath("userData"), "question-bank.sqlite");
}

export function getDb(customPath?: string): Database.Database {
  if (dbInstance) return dbInstance;

  const dbPath = customPath ?? getDefaultDbPath();
  const db = new Database(dbPath);

  // Off by default in SQLite - must be enabled per-connection for
  // ON DELETE CASCADE / RESTRICT to actually be enforced.
  db.pragma("foreign_keys = ON");
  // WAL gives much better concurrent read/write behavior for a desktop
  // app where the UI may read while a background save is happening.
  db.pragma("journal_mode = WAL");

  runMigrations(db);

  dbInstance = db;
  return dbInstance;
}

/** Mainly for tests: closes and clears the cached connection. */
export function closeDb(): void {
  dbInstance?.close();
  dbInstance = null;
}
