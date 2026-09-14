import { IChoice, IQuestionBase } from "@/shared/interfaces/index.js";
import { SubCategoryService } from "../services/subcategory.service.js";
import { CategoryService } from "../services/category.service.js";

export const validateBaseQuestion = (
  question: Partial<IQuestionBase>,
  categoryService: CategoryService,
  subCategoriesService: SubCategoryService,
) => {
  const { categoryId, difficulty, header, subcategoryId, type } = question;

  if (!categoryId || !difficulty || !header || !subcategoryId || !type) {
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
  if (!(type === "mcq" || type === "essay")) {
    throw new Error("Question must be either MCQ or Essay");
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
