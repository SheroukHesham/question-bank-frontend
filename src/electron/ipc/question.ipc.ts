import { ipcMain } from "electron";
import type {
  ICreateEssayQuestion,
  ICreateMcqQuestion,
  IEssayQuestion,
  IGroupedQuestionCategory,
  IMcqQuestion,
  IQuestionCountByCategory,
  IQuestions,
} from "../../shared/interfaces/index.js";
import { QuestionsService } from "../services/question.service.js";
import { QuestionRow } from "../interfaces/index.js";

export function registerQuestionIPC(questionsService: QuestionsService) {
  ipcMain.handle(
    "question:createMcq",
    async (
      _event,
      input: ICreateMcqQuestion,
    ): Promise<IMcqQuestion | undefined> => {
      return questionsService.createMcq(input);
    },
  );
  ipcMain.handle(
    "question:createEssay",
    async (_event, input: ICreateEssayQuestion): Promise<IEssayQuestion> => {
      return questionsService.createEssay(input);
    },
  );
  ipcMain.handle(
    "question:findById",
    async (_event, id: number): Promise<IQuestions | undefined> => {
      return questionsService.findById(id);
    },
  );
  ipcMain.handle(
    "question:findGroupedQuestions",
    async (_event): Promise<IGroupedQuestionCategory[]> => {
      return questionsService.findGroupedQuestions();
    },
  );
  ipcMain.handle(
    "question:findByCategoryId",
    async (_event, categoryId: number): Promise<IQuestions[]> => {
      return questionsService.findByCategory(categoryId);
    },
  );
  ipcMain.handle(
    "question:findByFilter",
    async (
      _event,
      categoryId: number,
      subcategoryId: number,
      difficulty: number,
    ): Promise<QuestionRow[]> => {
      return questionsService.findByFilter(
        categoryId,
        subcategoryId,
        difficulty,
      );
    },
  );
  ipcMain.handle(
    "question:updateMcq",
    async (
      _event,

      updatedQuestion: IMcqQuestion,
    ): Promise<IMcqQuestion> => {
      return questionsService.updateMcq(updatedQuestion);
    },
  );
  ipcMain.handle(
    "question:updateEssay",
    async (
      _event,

      updatedQuestion: IEssayQuestion,
    ): Promise<IEssayQuestion> => {
      return questionsService.updateEssay(updatedQuestion);
    },
  );
  ipcMain.handle(
    "question:delete",
    async (_event, id: number): Promise<void> => {
      return questionsService.delete(id);
    },
  );
  ipcMain.handle(
    "question:findTotalQuestions",
    async (_event): Promise<{ total: number } | undefined> => {
      return questionsService.getTotalQuestions();
    },
  );
  ipcMain.handle(
    "question:findTotalQuestionsPerCategory",
    async (_event): Promise<IQuestionCountByCategory[] | undefined> => {
      return questionsService.getTotalQuestionsPerCategory();
    },
  );
}
