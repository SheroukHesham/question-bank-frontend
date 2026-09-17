import Database from "better-sqlite3";

export class ExamRepository {
  constructor(private readonly db: Database.Database) {}
}
