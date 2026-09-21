import {
  IChoice,
  IExamBase,
  IQuestionBase,
} from "@/shared/interfaces/index.js";
import { SubCategoryService } from "../services/subcategory.service.js";
import { CategoryService } from "../services/category.service.js";

export const validateBaseQuestion = (
  question: Partial<IQuestionBase>,
  categoryService: CategoryService,
  subCategoriesService: SubCategoryService,
) => {
  const { categoryId, difficulty, header, subcategoryId } = question;

  if (!categoryId || !difficulty || !header || !subcategoryId) {
    throw new Error("Question is missing required fields");
  }
  if (!categoryService.findCategoryById(categoryId)) {
    throw new Error("Category does not exist");
  }
  if (!subCategoriesService.findSubcategoryById(subcategoryId)) {
    throw new Error("Subcategory does not exist");
  }
  if (
    !(
      difficulty === "easy" ||
      difficulty === "moderate" ||
      difficulty === "difficult"
    )
  ) {
    throw new Error("Difficulty is invalid");
  }
};

export const validateChoices = (choices: IChoice[]) => {
  if (choices.length !== 5)
    throw new Error("MCQ Question must have 1 key and 4 distractors");
  const key = choices.filter((choice) => choice.isCorrect === true);
  if (key.length !== 1) throw new Error("MCQ question must have 1 key");
  const distractors = choices.filter((choice) => choice.isCorrect === false);
  if (distractors.length !== 4)
    throw new Error("MCQ question must have 4 distractors");
};

export const validateModelAnswer = (modelAnswer: string) => {
  if (!modelAnswer || modelAnswer.length === 0)
    throw new Error("Model answer is required for essay questions.");
};

export const validateSubcategory = async (
  name: string,
  categoryId: number,
  categoriesService: CategoryService,
) => {
  if (!name.trim()) throw new Error("Name is required.");

  if (!categoryId) throw new Error("category is required");
  if (!categoriesService.findCategoryById(categoryId))
    throw new Error("The category you are assigning does not exist.");
};

export const validateExam = (exam: IExamBase) => {
  const {
    title,
    numberOfQuestionsAdded,
    examQuestions,
    totalNumberOfQuestions,
    type,
  } = exam;
  if (!title.trim()) throw new Error("Exam Title is required");
  if (!type) throw new Error("Exam Type is required");
  if (!totalNumberOfQuestions)
    throw new Error("Total number of questions is required");
  if (!numberOfQuestionsAdded)
    throw new Error("Number of questions added is required");
  if (totalNumberOfQuestions !== numberOfQuestionsAdded)
    throw new Error(
      "Number of questions added does not match total number of questions needed",
    );
  if (examQuestions.length === 0)
    throw new Error("Exam must have at least one question");
};

export const validateExamUpdates = (updates: Partial<IExamBase>) => {
  const {
    examQuestions,
    numberOfQuestionsAdded,
    status,
    title,
    totalNumberOfQuestions,
  } = updates;
  if (!title || !title.trim()) throw new Error("Exam Title is required");
  if (status === "draft") {
    return;
  }

  if (totalNumberOfQuestions !== numberOfQuestionsAdded)
    throw new Error(
      "Number of questions added does not match total number of questions needed",
    );
  if (examQuestions && examQuestions.length === 0)
    throw new Error("Exam must have at least one question");
};
