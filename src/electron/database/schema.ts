import type Database from "better-sqlite3";

const migrations: string[] = [
  // --- Migration 1: initial schema ---
  ` 
  CREATE TABLE categories (
    _id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL UNIQUE,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE subcategories (
    _id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(_id) ON DELETE CASCADE,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (name, category_id)
  );

  CREATE TABLE questions (
    _id             INTEGER PRIMARY KEY AUTOINCREMENT,
    type           TEXT NOT NULL CHECK (type IN ('mcq', 'essay')),
    header         TEXT NOT NULL,
    difficulty     TEXT NOT NULL CHECK (type IN ('easy','moderate','difficult')),
    headerImageUrl  TEXT,
    category_id    INTEGER NOT NULL REFERENCES categories(_id) ON DELETE RESTRICT,
    subcategory_id INTEGER NOT NULL REFERENCES subcategories(_id) ON DELETE RESTRICT,
    created_at     TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- One-to-one extension of "questions" for type = 'mcq'.
  CREATE TABLE mcq_key (
    question_id    INTEGER PRIMARY KEY REFERENCES questions(_id) ON DELETE CASCADE,
    correct_answer TEXT NOT NULL
  );

  -- Exactly 4 rows per MCQ question; the count is enforced in the
  -- repository layer (SQLite has no declarative "exactly N rows" constraint).
  CREATE TABLE mcq_distractors (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id     INTEGER NOT NULL REFERENCES questions(_id) ON DELETE CASCADE,
    distractor_text TEXT NOT NULL
  );

  -- One-to-one extension of "questions" for type = 'essay'.
  CREATE TABLE essay_details (
    question_id  INTEGER PRIMARY KEY REFERENCES questions(_id) ON DELETE CASCADE,
    model_answer TEXT NOT NULL
  );

  CREATE TABLE exams (
    _id                    INTEGER PRIMARY KEY AUTOINCREMENT,
    title                 TEXT NOT NULL,    
    target_question_count INTEGER NOT NULL,
    selection_criteria    TEXT NOT NULL, -- JSON snapshot of the request that generated it
    status                TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'final')),
    created_at            TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at            TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- Join table: which questions belong to which exam, in what order, worth what.
  CREATE TABLE exam_questions (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_id      INTEGER NOT NULL REFERENCES exams(_id) ON DELETE CASCADE,
    question_id  INTEGER NOT NULL REFERENCES questions(_id) ON DELETE RESTRICT,
    mark_awarded REAL NOT NULL,
    position     INTEGER NOT NULL,
    UNIQUE (exam_id, question_id)
  );

  -- Indexes matching the two hottest query patterns:
  -- the grouped question-bank view, and the exam generator's filter.
  CREATE INDEX idx_questions_lookup
    ON questions (category_id, subcategory_id, difficulty);

  CREATE INDEX idx_exam_questions_exam
    ON exam_questions (exam_id);
  `,
];

export function runMigrations(db: Database.Database): void {
  const currentVersion = db.pragma("user_version", { simple: true }) as number;

  for (let version = currentVersion; version < migrations.length; version++) {
    const migration = migrations[version];
    const applyMigration = db.transaction(() => {
      db.exec(migration);
      db.pragma(`user_version = ${version + 1}`);
    });
    applyMigration();
  }
}
