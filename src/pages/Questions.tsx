import CategoryCards from "@/components/CategoryCards";
import QuestionForm from "@/components/QuestionForm";
import { changeActiveTab } from "@/features/activeTabSlice";
import { CircleQuestionMark, LayoutGrid } from "lucide-react";
import { useDispatch } from "react-redux";

const Questions = () => {
  const dispatch = useDispatch();
  dispatch(changeActiveTab("all-questions"));

  return (
    <div className="w-full p-10 ">
      <h1 className="text-4xl font-semibold ">All Questions</h1>
      <div className="w-full flex justify-end ">
        <QuestionForm />
      </div>
      <div className="w-full p-3 grid grid-cols-3 gap-5 mt-5 bg-white rounded-md">
        <div className="border-2 border-border rounded-md px-5 py-3 flex items-center gap-3">
          <span className="text-primary ">
            <CircleQuestionMark size={45} />
          </span>
          <div className="flex flex-col">
            <span className="text-muted font-semibold  ">Total Questions</span>
            <span className="font-semibold text-2xl text-black ">1135</span>
          </div>
        </div>

        <div className="border-2 border-border rounded-md px-5 py-3 flex items-center gap-3">
          <span className="text-primary ">
            <LayoutGrid size={45} />
          </span>
          <div className="flex flex-col">
            <span className="text-muted font-semibold  ">Total Categories</span>
            <span className="font-semibold text-2xl text-black ">6</span>
          </div>
        </div>
      </div>
      <div className="mt-5 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CategoryCards />
      </div>
    </div>
  );
};

export default Questions;
