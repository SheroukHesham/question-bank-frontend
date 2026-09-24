import { subcategoryKeys } from "./keys";

export const subcategoryQueries = {
  findAllDetails: () => ({
    queryKey: subcategoryKeys.findAllDetails(),
    queryFn: () => window.electron.subcategory.findAllSubcategories(),
  }),
  findById: (subcategoryId: number, questionId: number) => ({
    queryKey: subcategoryKeys.findById(questionId),
    queryFn: () =>
      window.electron.subcategory.findSubcategoryById(subcategoryId),
  }),
  findByCategoryId: (categoryId: number) => ({
    queryKey: subcategoryKeys.byCategoryId(categoryId),
    queryFn: () =>
      window.electron.subcategory.findSubcategoryByCategoryId(categoryId),
  }),
};
