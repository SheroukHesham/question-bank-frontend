import type { ICreateMcqQuestion } from "@/shared/interfaces";
import CategoryCards from "@/ui/components/CategoryCards";
import QuestionForm from "@/ui/components/QuestionForm";
import { changeActiveTab } from "@/ui/features/activeTabSlice";
import { CircleQuestionMark, LayoutGrid } from "lucide-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Questions = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(changeActiveTab("all-questions"));
  }, [dispatch]);

  const question: ICreateMcqQuestion = {
    type: "mcq",
    header: "Which keyword creates a subclass in Java?",
    difficulty: "easy",
    categoryId: 1,
    subcategoryId: 4,
    choices: [
      {
        choice: "extends",
        isCorrect: true,
      },
      {
        choice: "implements",
        isCorrect: false,
      },
      {
        choice: "inherits",
        isCorrect: false,
      },
      {
        choice: "super",
        isCorrect: false,
      },
    ],
  };

  const createdQuestion = async () => {
    try {
      const created = await window.electron.questions.createMcq(question);
      console.log(created);
    } catch (error) {
      console.log("Errod", error);
    }
  };
  createdQuestion();

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
            <span className="font-semibold text-2xl text-black ">1135</span>
          </div>
        </div>

        <div className="border-2 border-border rounded-md px-5 py-3 sm:flex sm:flex-col sm:justify-center  md:flex-row    items-center gap-3">
          <span className="text-primary ">
            <LayoutGrid size={45} />
          </span>
          <div className="flex flex-col  sm:items-center md:items-start">
            <span className="text-muted font-semibold  ">Total Topics</span>
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
