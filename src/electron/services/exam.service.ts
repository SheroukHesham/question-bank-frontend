import { IExamBase } from "@/shared/interfaces/index.js";
import { ExamRepository } from "../repositories/exam.repository.js";

export class ExamService {
  constructor(private readonly examRepository: ExamRepository) {}

  createExam(exam: IExamBase) {
    return this.examRepository.createExam(exam);
  }
  findExamById(examId: number) {
    return this.examRepository.findExamById(examId);
  }
  findAllExams() {
    return this.examRepository.findAllExams();
  }
  updateExam(examId: number, updates: Partial<IExamBase>) {
    return this.examRepository.updateExam(examId, updates);
  }

  deleteExam(examId: number) {
    return this.examRepository.deleteExam(examId);
  }
}
