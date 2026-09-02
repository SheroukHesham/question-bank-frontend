import type {
  ICreateEssayQuestion,
  ICreateMcqQuestion,
  IEssayQuestion,
  IGroupedQuestionCategory,
  IMcqQuestion,
  IQuestionCountByCategory,
  IQuestions,
} from "../../shared/interfaces/index.js";
import { QuestionRow } from "../interfaces/index.js";

import { QuestionsRepository } from "../repositories/question.repository.js";
import {
  validateBaseQuestion,
  validateChoices,
  validateModelAnswer,
} from "../validation/index.js";
import { CategoryService } from "./category.service.js";
import { SubCategoryService } from "./subcategory.service.js";

export class QuestionsService {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly categoryService: CategoryService,
    private readonly subcategoryService: SubCategoryService,
  ) {}

  createMcq(input: ICreateMcqQuestion): IMcqQuestion | undefined {
    console.log("in service");
    const { choices, ...base } = input;
    validateChoices(choices);
    validateBaseQuestion(base, this.categoryService, this.subcategoryService);

    return this.questionsRepository.createMcq(input);
  }

  createEssay(input: ICreateEssayQuestion): IEssayQuestion {
    const { modelAnswer, ...base } = input;
    validateModelAnswer(modelAnswer);
    validateBaseQuestion(base, this.categoryService, this.subcategoryService);

    return this.questionsRepository.createEssay(input);
  }

  findById(id: number): IQuestions | undefined {
    return this.questionsRepository.findById(id);
  }

  findGroupedQuestions(): IGroupedQuestionCategory[] {
    return this.questionsRepository.findAllGrouped();
  }

  findByCategory(categoryId: number): IQuestions[] {
    return this.questionsRepository.findByCategory(categoryId);
  }

  findByFilter(
    categoryId: number,
    subcategoryId: number,
    difficulty: number,
  ): QuestionRow[] {
    return this.questionsRepository.findByFilter(
      categoryId,
      subcategoryId,
      difficulty,
    );
  }

  updateMcq(updatedQuestion: IMcqQuestion): IMcqQuestion {
    return this.questionsRepository.updateMcq(updatedQuestion);
  }

  updateEssay(updatedQuestion: IEssayQuestion): IEssayQuestion {
    return this.questionsRepository.updateEssay(updatedQuestion);
  }

  delete(id: number): void {
    return this.questionsRepository.delete(id);
  }

  getTotalQuestions(): { total: number } | undefined {
    return this.questionsRepository.totalQuestionCount();
  }

  getTotalQuestionsPerCategory(): IQuestionCountByCategory[] | undefined {
    return this.questionsRepository.totalQuestionsOfCategory();
  }
}
