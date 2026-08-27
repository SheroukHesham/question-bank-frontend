import type {
  ICreateMcqQuestion,
  IMcqQuestion,
} from "../../shared/interfaces/index.js";

import { QuestionsRepository } from "../repositories/question.repository.js";

export class QuestionsService {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  createMcq(input: ICreateMcqQuestion): IMcqQuestion {
    // Business-level validation can happen here.

    if (!input.header.trim()) {
      throw new Error("Question header is required.");
    }

    return this.questionsRepository.createMcq(input);
  }
}
