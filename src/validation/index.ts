import * as yup from "yup";

export const questionSchema = yup.object({
  type: yup.mixed<"essay" | "mcq">().oneOf(["essay", "mcq"]).required(),
  header: yup.string().required("Question header is required"),
  difficulty: yup
    .number()
    .min(1, "Difficulty is required")
    .max(5, "Difficulty must be between 1 and 5")
    .required("Question difficulty is required"),
  mark: yup.number().min(1, "Mark is required").required("Mark is required"),
  categoryId: yup.string().required("Category is required"),
  subcategoryId: yup.string().required("Subcategory is required"),

  modelAnswer: yup.string().when("type", {
    is: "essay",
    then: (schema) => schema.required("Model Answer is required"),
    otherwise: (schema) => schema.strip(),
  }),

  key: yup.string().when("type", {
    is: "mcq",
    then: (schema) => schema.required("Key is required"),
    otherwise: (schema) => schema.strip(),
  }),

  distractors: yup
    .array()
    .of(
      yup.object({
        value: yup.string().required("Distractor is required"),
      }),
    )
    .when("type", {
      is: "mcq",
      then: (schema) => schema.min(4, "4 distractors are required").required(),
      otherwise: (schema) => schema.strip(),
    }),
});

export type QuestionFormValues = yup.InferType<typeof questionSchema>;
