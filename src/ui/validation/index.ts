import type { TQuestionDifficulty, TQuestionTypes } from "@/shared/types";
import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup.string().required("Password is Required"),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;

const choiceSchema = yup.object({
  choice: yup.string().required("This Field is Required"),
  isCorrect: yup.boolean().required(),
});

//todo: choices must be unique
export const questionSchema = yup.object({
  type: yup.mixed<TQuestionTypes>().oneOf(["essay", "mcq"]).required(),
  difficulty: yup
    .mixed<TQuestionDifficulty>()
    .oneOf(["easy", "moderate", "difficult"], "Difficulty is required")
    .required("Difficulty level is required"),
  header: yup.string().required("Question header is required"),
  categoryId: yup
    .number()
    .positive("Topic is required")
    .required("Topic is required"),
  subcategoryId: yup
    .number()
    .positive("Type is required")
    .required("Type is required"),
  modelAnswer: yup.string().when("type", {
    is: "essay",
    then: (schema) => schema.required("Model Answer is required"),
    otherwise: (schema) => schema.strip(),
  }),
  headerImageFile: yup.mixed(),
  choices: yup
    .array()
    .of(choiceSchema)
    .when("type", {
      is: "mcq",
      then: (schema) =>
        schema
          .min(5, "5 choices are required")
          .required()
          .test(
            "one-correct",
            "Select exactly one correct choice",
            (choices) =>
              (choices ?? []).filter((c) => c.isCorrect).length === 1,
          ),
      otherwise: (schema) => schema.strip(),
    }),
});

export type QuestionFormValues = yup.InferType<typeof questionSchema>;
export const subcategorySchema = yup.object({
  name: yup
    .string()
    .required("Subtopic name is required")
    .test(
      "not-purely-numeric",
      "Subtopic name cannot be only numbers",
      (value) => !/^\d+$/.test(value ?? ""),
    ),
});

export type SubcategoryFormValues = yup.InferType<typeof subcategorySchema>;

export const categorySchema = yup.object({
  name: yup
    .string()
    .required("Topic name is required")
    .test(
      "not-purely-numeric",
      "Topic name cannot be only numbers",
      (value) => !/^\d+$/.test(value ?? ""),
    ),
});

export type CategoryFormValues = yup.InferType<typeof categorySchema>;

export const examSchema = yup.object({
  title: yup.string().required("Exam title is required"),
  totalNumberOfQuestions: yup
    .number()
    .min(1, "Exam must have at least 1 question.")
    .required("Total number of questions is required"),

  numberOfQuestionsAdded: yup
    .number()
    .min(1, "You must add at least one question")
    .required()
    .test(
      "matches-total",
      "Added questions must equal the total number of questions",
      (value, context) => value === context.parent.totalNumberOfQuestions,
    ),
});

export type ExamFormValues = yup.InferType<typeof examSchema>;

export const criteriaSchema = yup.object({
  _id: yup.string().required("criteria id is required"),
  numberOfQuestions: yup
    .number()
    .min(1, "Number of Questions is Required")
    .required("Number of questions is required for each criteria"),
  difficulty: yup
    .mixed<TQuestionDifficulty>()
    .oneOf(["difficult", "easy", "moderate"], "Difficulty is required")
    .required("Difficulty is required"),
  categoryId: yup.string().required("Topic is required"),
  subcategoryId: yup.string().required("Subtopic is required"),
  examType: yup.mixed<TQuestionTypes>().oneOf(["essay", "mcq"]).required(),
});

export const generateQuestionsSchema = yup.object({
  criteria: yup
    .array()
    .of(criteriaSchema)
    .min(1, "You must add at least 1 criteria")
    .required("Criteria is required"),
});

export type GenerateQuestionFormValues = yup.InferType<
  typeof generateQuestionsSchema
>;
