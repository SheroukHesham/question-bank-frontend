import { BrowserWindow, dialog, ipcMain } from "electron";
import { ExamService } from "../services/exam.service.js";
import { IExam, IExamBase } from "@/shared/interfaces/index.js";
import { safeHandle } from "./safeHandle.js";
import { QuestionsService } from "../services/question.service.js";
import { generateExamDocx } from "../services/exam-export.service.js";
import fs from "node:fs";

export function registerExamIPC(
  examService: ExamService,
  questionService: QuestionsService,
) {
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

  safeHandle("exam:exportToWord", async (event, examId: number) => {
    const exam = examService.findExamById(examId);
    if (!exam) throw new Error("Exam not found");

    const questions = questionService.findQuestionsForExam(examId);
    if (questions.length === 0)
      throw new Error("This exam has no questions to export");

    const win = BrowserWindow.fromWebContents(event.sender);
    const defaultFileName = `${exam.title.replace(/[\\/:*?"<>|]/g, "_")}.docx`;

    const { canceled, filePath } = await dialog.showSaveDialog(win!, {
      title: "Export Exam to Word",
      defaultPath: defaultFileName,
      filters: [{ name: "Word Document", extensions: ["docx"] }],
    });

    if (canceled || !filePath) {
      return { exported: false as const };
    }

    const buffer = await generateExamDocx(exam, questions);
    fs.writeFileSync(filePath, buffer);

    return { exported: true as const, filePath };
  });
}
