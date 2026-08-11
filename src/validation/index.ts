import * as yup from "yup";

const choiceSchema = yup.object({
  value: yup.string().required("Choice text is required"),
  isCorrect: yup.boolean().required(),
});

export const questionSchema = yup.object({
  type: yup.mixed<"essay" | "mcq">().oneOf(["essay", "mcq"]).required(),
  header: yup.string().required("Question header is required"),
  // difficulty: yup
  //   .number()
  //   .min(1)
  //   .max(5)
  //   .required("Question difficulty is required"),
  mark: yup.number().min(1, "Mark is required").required("Mark is required"),
  categoryId: yup.string().required("Category is required"),
  subcategoryId: yup.string().required("Subcategory is required"),

  modelAnswer: yup.string().when("type", {
    is: "essay",
    then: (schema) => schema.required("Model Answer is required"),
    otherwise: (schema) => schema.strip(),
  }),

  choices: yup
    .array()
    .of(choiceSchema)
    .when("type", {
      is: "mcq",
      then: (schema) =>
        schema
          .min(5, "Choices are required")
          .required("Choices are required")
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

export const categorySchema = yup.object({
  name: yup.string().required("Category name is required"),
  subCategories: yup
    .array()
    .of(yup.string())
    .min(1, "You must assign at least 1 subcategory")
    .required("You must assign at least 1 subcategory"),
});

export type CategoryFormValues = yup.InferType<typeof categorySchema>;

export const subcategorySchema = yup.object({
  name: yup.string().required("Subcategory name is required"),
});

export type SubcategoryFormValues = yup.InferType<typeof subcategorySchema>;
