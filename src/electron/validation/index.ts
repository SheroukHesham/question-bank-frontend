import { IChoice, IQuestionBase } from "@/shared/interfaces/index.js";

export const validateBaseQuestion = (question: Partial<IQuestionBase>) => {
  const { categoryId, difficulty, header, subcategoryId, type } = question;

  if (!categoryId || !difficulty || !header || !subcategoryId || !type) {
    throw new Error("Question is missing required fields");
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
