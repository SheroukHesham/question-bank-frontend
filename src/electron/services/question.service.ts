import type {
  ICreateEssayQuestion,
  ICreateMcqQuestion,
  IEssayQuestion,
  IFilteredQuestion,
  IFindQuestionsParams,
  IGenerateExamInput,
  IGroupedQuestionCategory,
  IMcqQuestion,
  IQuestionCountByCategory,
  IQuestions,
} from "../../shared/interfaces/index.js";
import { QuestionsRepository } from "../repositories/question.repository.js";
import {
  validateBaseQuestion,
  validateChoices,
  validateModelAnswer,
} from "../validation/index.js";
import { CategoryService } from "./category.service.js";
import { ImageStorageService } from "./image-storage.service.js";
import { SubCategoryService } from "./subcategory.service.js";

export class QuestionsService {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly categoryService: CategoryService,
    private readonly subcategoryService: SubCategoryService,
    private readonly imageStorage: ImageStorageService,
  ) {}

  createMcq(input: ICreateMcqQuestion): IMcqQuestion | undefined {
    const imageURL = input.headerImageUrl
      ? this.imageStorage.saveImage(input.headerImageUrl)
      : undefined;

    const { choices, ...base } = input;
    validateChoices(choices);
    validateBaseQuestion(base, this.categoryService, this.subcategoryService);

    return this.questionsRepository.createMcq({
      ...input,
      headerImageUrl: imageURL,
    });
  }

  createEssay(input: ICreateEssayQuestion): IEssayQuestion {
    const imageURL = input.headerImageUrl
      ? this.imageStorage.saveImage(input.headerImageUrl)
      : undefined;

    const { modelAnswer, ...base } = input;
    validateModelAnswer(modelAnswer);
    validateBaseQuestion(base, this.categoryService, this.subcategoryService);

    return this.questionsRepository.createEssay({
      ...input,
      headerImageUrl: imageURL,
    });
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

  findByFilterPaginated(params: IFindQuestionsParams): {
    questions: IFilteredQuestion[];
    hasMore: boolean;
  } {
    return this.questionsRepository.findByFilterPaginated(params);
  }

  updateMcq(updatedQuestion: IMcqQuestion): IMcqQuestion {
    const imageURL = updatedQuestion.headerImageUrl
      ? this.imageStorage.saveImage(updatedQuestion.headerImageUrl)
      : undefined;
    return this.questionsRepository.updateMcq({
      ...updatedQuestion,
      headerImageUrl: imageURL,
    });
  }

  updateEssay(updatedQuestion: IEssayQuestion): IEssayQuestion {
    const existing = this.questionsRepository.findById(updatedQuestion._id);
    if (!existing) throw new Error(`Question not found`);
    let headerImageUrl = existing.headerImageUrl;

    // if updated header image
    if (
      updatedQuestion.headerImageUrl &&
      updatedQuestion.headerImageUrl !== headerImageUrl
    ) {
      this.imageStorage.deleteImage(existing.headerImageUrl);
      headerImageUrl = this.imageStorage.saveImage(
        updatedQuestion.headerImageUrl,
      );
    } else if (!updatedQuestion.headerImageUrl && headerImageUrl) {
      this.imageStorage.deleteImage(existing.headerImageUrl);
      headerImageUrl = undefined;
    }

    return this.questionsRepository.updateEssay({
      ...updatedQuestion,
      headerImageUrl: headerImageUrl,
    });
  }

  delete(id: number): void {
    const existing = this.questionsRepository.findById(id);
    if (existing) {
      this.imageStorage.deleteImage(existing.headerImageUrl);
    }
    return this.questionsRepository.delete(id);
  }

  getTotalQuestions(): { total: number } | undefined {
    return this.questionsRepository.totalQuestionCount();
  }

  getTotalQuestionsPerCategory(): IQuestionCountByCategory[] | undefined {
    return this.questionsRepository.totalQuestionsOfCategory();
  }

  generateExamQuestions(inputCriteria: IGenerateExamInput) {
    const excludeExamIds = inputCriteria.excludeExamIds ?? [];
    return inputCriteria.criteria.flatMap((criterion) =>
      this.questionsRepository.generateQuestionsFromCriteria(
        criterion,
        excludeExamIds,
      ),
    );
  }

  findQuestionsForExam(examId: number): IQuestions[] {
    return this.questionsRepository.findQuestionsForExam(examId);
  }
}
