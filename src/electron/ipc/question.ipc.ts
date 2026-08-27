import { ipcMain } from "electron";
import type { ICreateMcqQuestion } from "../../shared/interfaces/index.js";
import { QuestionsService } from "../services/question.service.js";

export function registerQuestionIPC(questionsService: QuestionsService) {
  ipcMain.handle(
    "questions:createMcq",
    async (_event, input: ICreateMcqQuestion) => {
      return questionsService.createMcq(input);
    },
  );
}
