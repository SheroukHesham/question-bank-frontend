import { ipcMain } from "electron";
import type {
  ICreateEssayQuestion,
  ICreateMcqQuestion,
  IEssayQuestion,
  IFindQuestionsParams,
  IGenerateExamInput,
  IGroupedQuestionCategory,
  IMcqQuestion,
  IQuestionCountByCategory,
  IQuestions,
} from "../../shared/interfaces/index.js";
import { QuestionsService } from "../services/question.service.js";
import { safeHandle } from "./safeHandle.js";

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
  // electron/ipc/question.ipc.ts
  safeHandle(
    "question:findByFilterPaginated",
    (_e, params: IFindQuestionsParams) => {
      return questionsService.findByFilterPaginated(params);
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
  ipcMain.handle(
    "question:findQuestionsForExam",
    async (_event, examId: number): Promise<IQuestions[]> => {
      return questionsService.findQuestionsForExam(examId);
    },
  );
  safeHandle(
    "question:generateQuestions",
    async (
      _event,
      inputCriteria: IGenerateExamInput,
    ): Promise<IQuestions[]> => {
      return questionsService.generateExamQuestions(inputCriteria);
    },
  );
}
