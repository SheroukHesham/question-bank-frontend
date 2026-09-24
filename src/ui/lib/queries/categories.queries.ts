import { categoryKeys } from "./keys";

export const categoryQueries = {
  findAllDetails: () => ({
    queryKey: categoryKeys.findAllDetails(),
    queryFn: () => window.electron.category.findAllCategoriesDetails(),
  }),
  getGroupedSubcategory: () => ({
    queryKey: categoryKeys.groupedCategorySubcategory(),
    queryFn: () => window.electron.category.getGroupedCategorySubcategory(),
  }),
  findById: (categoryId: number) => ({
    queryKey: categoryKeys.byId(categoryId),
    queryFn: () => window.electron.category.getCategoryById(categoryId),
  }),
};
