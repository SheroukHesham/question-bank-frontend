import { ExamRepository } from "../repositories/exam.repository.js";
import { QuestionsService } from "./question.service.js";

export class ExamService {
  constructor(
    private readonly examRepository: ExamRepository,
    private readonly questionService: QuestionsService,
  ) {}
}
