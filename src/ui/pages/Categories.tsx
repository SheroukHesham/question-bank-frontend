import CategoryCards from "@/ui/components/CategoryCards";
import CategoryForm from "@/ui/components/CategoryForm";
import { changeActiveTab } from "@/ui/features/activeTabSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useFetch } from "../hooks/custom";
import { categoryQueries } from "../lib/queries/categories.queries";

const Categories = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(changeActiveTab("questions-categories"));
  }, [dispatch]);

  const { data: categoriesDetails } = useFetch(
    categoryQueries.findAllDetails(),
  );

  return (
    <div className="w-full p-10 ">
      <div className="flex items-center gap-2">
        <h1 className="text-4xl font-semibold ">All Topics</h1>
        {categoriesDetails && categoriesDetails?.length > 0 && (
          <span className="text-muted/50 text-3xl font-semibold">
            ({categoriesDetails?.length})
          </span>
        )}
      </div>
      <div className="w-full flex justify-end ">
        <CategoryForm />
      </div>

      <div className="mt-5 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CategoryCards categoriesDetails={categoriesDetails} />
      </div>
    </div>
  );
};

export default Categories;
