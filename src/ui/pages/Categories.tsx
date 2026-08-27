import CategoryCards from "@/ui/components/CategoryCards";
import CategoryForm from "@/ui/components/CategoryForm";
import { changeActiveTab } from "@/ui/features/activeTabSlice";
import { MOCK_CATEGORIES } from "@/ui/mock";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Categories = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(changeActiveTab("questions-categories"));
  }, [dispatch]);

  //todo: replace by api call or stored number of categories
  const CATEGORY_COUNT = MOCK_CATEGORIES.length;

  async function createCategory() {
    try {
      const created = await window.electron.categories.create("Surgery");
      console.log("Created: ", created);
    } catch (error) {
      console.log(error);
    }
  }
  createCategory();

  return (
    <div className="w-full p-10 ">
      <div className="flex  items-center gap-2">
        <h1 className="text-4xl font-semibold ">All Topics</h1>
        <span className="text-muted/50 text-3xl font-semibold">
          ({CATEGORY_COUNT})
        </span>
      </div>
      <div className="w-full flex justify-end ">
        <CategoryForm />
      </div>

      <div className="mt-5 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CategoryCards />
      </div>
    </div>
  );
};

export default Categories;
