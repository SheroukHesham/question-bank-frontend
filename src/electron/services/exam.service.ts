import { IExamBase } from "@/shared/interfaces/index.js";
import { ExamRepository } from "../repositories/exam.repository.js";
import { validateExam } from "../validation/index.js";

export class ExamService {
  constructor(private readonly examRepository: ExamRepository) {}

  createExam(exam: IExamBase) {
    if (exam.status === "final") {
      validateExam(exam);
    }
    return this.examRepository.createExam(exam);
  }
  findExamById(examId: number) {
    if (!examId) throw new Error("Exam Id is required to retrieve exam");
    return this.examRepository.findExamById(examId);
  }
  findAllExams() {
    return this.examRepository.findAllExams();
  }
  updateExam(examId: number, updates: Partial<IExamBase>) {
    return this.examRepository.updateExam(examId, updates);
  }

  deleteExam(examId: number) {
    if (!examId) throw new Error("Exam Id is required to delete exam");
    return this.examRepository.deleteExam(examId);
  }
}
