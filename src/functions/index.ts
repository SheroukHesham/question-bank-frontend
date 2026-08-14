import type { IEssayQuestion, IMcqQuestion, IQuestions } from "@/interfaces";
import { MOCK_CATEGORIES, MOCK_SUB_CATEGORIES } from "@/mock";
// import type { QuestionFormValues } from "@/validation";

export const isEssayQuestion = (q: IQuestions): q is IEssayQuestion =>
  q.type === "essay";
export const isMcqQuestion = (q: IQuestions): q is IMcqQuestion =>
  q.type === "mcq";

// export const toFormValues = (q: IQuestions): QuestionFormValues =>
//   q.type === "essay"
//     ? {
//         type: "essay",
//         header: q.header,
//         difficulty: q.difficulty,
//         mark: q.mark,
//         categoryId: q.categoryId,
//         subcategoryId: q.subcategoryId,
//         modelAnswer: q.modelAnswer,
//       }
//     : {
//         type: "mcq",
//         header: q.header,
//         difficulty: q.difficulty,
//         mark: q.mark,
//         categoryId: q.categoryId,
//         subcategoryId: q.subcategoryId,
//         choices: q.choices, // direct passthrough — no unwrap/rewrap needed anymore
//       };

export const findSubCategory = (subId: string) => {
  const subcategory = MOCK_SUB_CATEGORIES.find((item) => item._id === subId);
  return subcategory?.name;
};
export const findSubCategoryByName = (subName: string) => {
  const subcategory = MOCK_SUB_CATEGORIES.find((item) => item.name === subName);
  return subcategory?._id;
};

export const findCategory = (catId: string) => {
  const category = MOCK_CATEGORIES.find((item) => item._id === catId);
  return category;
};

export const splitFunction = (text: string, splitter: string) => {
  return text.split(splitter);
};
