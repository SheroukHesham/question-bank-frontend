import CategoryCards from "@/ui/components/CategoryCards";
import QuestionForm from "@/ui/components/QuestionForm";
import { changeActiveTab } from "@/ui/features/activeTabSlice";
import { CircleQuestionMark, LayoutGrid } from "lucide-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useFetch } from "../hooks/custom";
import ErrorHandler from "../errors/ErrorHandler";
import { Spinner } from "../components/ui/spinner";

//TODO: ADD LOADING AND ERROR STATES

const Questions = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(changeActiveTab("all-questions"));
  }, [dispatch]);

  const { data: categoriesDetails } = useFetch({
    queryKey: ["categories", "findAllDetails"],
    queryFn: () => window.electron.category.findAllCategoriesDetails(),
  });

  const {
    data: totalQuestions,
    isLoading,
    isError,
  } = useFetch({
    queryKey: ["questions", "total"],
    queryFn: () => window.electron.question.getTotalQuestions(),
  });

  if (isError) {
    return <ErrorHandler />;
  }

  return (
    <div className="w-full p-10 ">
      <h1 className="text-4xl font-semibold ">All Questions</h1>
      <div className="w-full flex justify-end mt-2">
        <QuestionForm />
      </div>
      <div className="w-full p-3 grid grid-cols-3 gap-5 mt-5 bg-white rounded-md">
        <div className="border-2 border-border rounded-md px-5 py-3 sm:flex sm:flex-col sm:justify-center  md:flex-row    items-center gap-3">
          <span className="text-primary ">
            <CircleQuestionMark size={45} />
          </span>
          <div className="flex flex-col sm:items-center md:items-start">
            <span className="text-muted font-semibold  ">Total Questions</span>
            <span className="font-semibold text-2xl text-black ">
              {isLoading ? <Spinner /> : totalQuestions?.total}
            </span>
          </div>
        </div>

        <div className="border-2 border-border rounded-md px-5 py-3 sm:flex sm:flex-col sm:justify-center  md:flex-row    items-center gap-3">
          <span className="text-primary ">
            <LayoutGrid size={45} />
          </span>
          <div className="flex flex-col  sm:items-center md:items-start">
            <span className="text-muted font-semibold  ">Total Topics</span>
            <span className="font-semibold text-2xl text-black ">
              {categoriesDetails?.length}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-5 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CategoryCards categoriesDetails={categoriesDetails} />
      </div>
    </div>
  );
};

export default Questions;
