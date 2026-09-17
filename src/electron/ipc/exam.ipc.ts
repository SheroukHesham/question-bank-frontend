import { ipcMain } from "electron";
import { ExamService } from "../services/exam.service.js";
import { IExam, IExamBase } from "@/shared/interfaces/index.js";

export function registerExamIPC(examService: ExamService) {
  ipcMain.handle("exam:createExam", async (_event, exam: IExamBase) => {
    return examService.createExam(exam);
  });
  ipcMain.handle(
    "exam:updateExam",
    async (_event, examId: number, updates: Partial<IExam>) => {
      return examService.updateExam(examId, updates);
    },
  );
  ipcMain.handle("exam:deleteExam", async (_event, examId: number) => {
    return examService.deleteExam(examId);
  });
  ipcMain.handle("exam:findExamById", async (_event, examId: number) => {
    return examService.findExamById(examId);
  });
  ipcMain.handle("exam:findAllExams", async (_event) => {
    return examService.findAllExams();
  });
}
