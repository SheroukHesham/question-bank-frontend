import * as yup from "yup";

export const questionSchema = yup.object({
  type: yup.mixed<"essay" | "mcq">().oneOf(["essay", "mcq"]).required(),
  header: yup
    .string()
    .min(8, "Question header is required")
    .required("Question header is required"),
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
    then: (schema) =>
      schema
        .min(8, "Model Answer is required")
        .required("Model Answer is required"),
    otherwise: (schema) => schema.strip(),
  }),

  // key: yup.string().when("type", {
  //   is: "mcq",
  //   then: (schema) => schema.required("This field is required"),
  //   otherwise: (schema) => schema.strip(),
  // }),

  choices: yup
    .array()
    .of(
      yup.object({
        value: yup.string().required("Choices are required"),
      }),
    )
    .when("type", {
      is: "mcq",
      then: (schema) => schema.min(5, "5 choices are required").required(),
      otherwise: (schema) => schema.strip(),
    }),
});

export type QuestionFormValues = yup.InferType<typeof questionSchema>;
