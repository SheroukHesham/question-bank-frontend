import QuestionCard from "@/components/QuestionCard";
import QuestionForm from "@/components/QuestionForm";
import { SingleSelect } from "@/components/SingleSelect";
import { SelectItem } from "@/components/ui/select";
import { MOCK_QUESTIONS } from "@/mock";
import type { TQuestionTypeFilter } from "@/types";
import { useState } from "react";
import { useParams } from "react-router-dom";

const CategoryQuestions = () => {
  const params = useParams();

  //todo:replace by api call
  const allQuestions = MOCK_QUESTIONS.filter(
    (items) => items.categoryId === params.id,
  );

  const [questions, setQuestions] = useState(allQuestions);

  const filterQuestions = (filterBy: TQuestionTypeFilter) => {
    if (filterBy === "Mcq") {
      const filtered = allQuestions?.filter((item) => item.type === "mcq");
      setQuestions(filtered);
    } else if (filterBy === "Essay") {
      const filtered = allQuestions?.filter((item) => item.type === "essay");
      setQuestions(filtered);
    } else {
      setQuestions(allQuestions);
    }
  };

  const onSelectValueChange = (value: string) => {
    filterQuestions(value as TQuestionTypeFilter);
  };

  const renderQuestions = questions.map((question, idx) => {
    return <QuestionCard key={question._id} idx={idx} question={question} />;
  });

  return (
    <div className="w-full p-10 ">
      <div className="flex  items-center gap-2">
        <h1 className="text-4xl font-semibold ">All Categories</h1>
        <span className="text-muted/50 text-3xl font-semibold">
          ({allQuestions.length})
        </span>
      </div>
      <div className="w-full flex justify-end ">
        <QuestionForm />
      </div>

      <div className="w-full mt-3">
        <SingleSelect
          placeholder="Question Type"
          onValueChange={onSelectValueChange}
        >
          <SelectItem value="All">All</SelectItem>
          <SelectItem value="Mcq">MCQ</SelectItem>
          <SelectItem value="Essay">Essay</SelectItem>
        </SingleSelect>
      </div>

      <div className="w-full flex flex-col gap-5 mt-5">{renderQuestions}</div>
    </div>
  );
};

export default CategoryQuestions;
