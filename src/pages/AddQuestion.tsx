import { EditQuestionForm } from "@/components/EditQuestionForm";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { defaultMcqQuestion, defaultQuestion } from "@/data";
import type { IMcqQuestion, IQuestions } from "@/interfaces";
import { Dot } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AddQuestion = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<IQuestions>(
    params.type === "essay" ? defaultQuestion : defaultMcqQuestion,
  );

  const onSubmit = () => {
    // TODO: API request to to edit question
    // TODO: revisit setQuestionToEdit logic
    console.log("Submitted");
    setQuestion(question as IQuestions);
  };

  const onCancel = () => {
    navigate("/questions");
  };
  console.log(question);
  const renderDistractors = (q: IMcqQuestion) =>
    q.distractors?.map((distractor, idx) => {
      return (
        <span key={idx} className="flex items-center">
          <Dot />
          <Input
            className="flex items-center capitalize"
            name={idx.toString()}
            id={idx.toString()}
            value={distractor}
            onChange={(e) => {
              const { name, value } = e.target;
              const newDistractors = q.distractors?.with(idx, value);
              setQuestion((prev) => ({
                ...prev,
                [name]: newDistractors,
              }));
            }}
          />
        </span>
      );
    });

  return (
    <div className="max-w-6xl mx-auto gap-y-3 flex flex-col mb-20">
      <Card>
        {question?.type === "essay" ? (
          <EditQuestionForm
            questionToEdit={question as IQuestions}
            setQuestionToEdit={setQuestion}
            onSubmit={onSubmit}
            onCancel={onCancel}
          >
            <Field>
              <FieldLabel
                htmlFor="modelAnswer"
                className="text-black font-bold mb-2 text-[16px]"
              >
                Model Answer
              </FieldLabel>
              <Textarea
                id="modelAnswer"
                placeholder="Enter the model answer"
                name="modelAnswer"
                value={question.modelAnswer}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setQuestion((prev) => ({ ...prev, [name]: value }));
                }}
                className="text-[16px] text-black font-semibold text-justify min-h-fit "
              />
            </Field>
          </EditQuestionForm>
        ) : (
          <EditQuestionForm
            questionToEdit={question as IQuestions}
            setQuestionToEdit={setQuestion}
            onSubmit={onSubmit}
            onCancel={onCancel}
          >
            <div className="flex w-[80%] gap-x-5 justify-center">
              <Field className="text-green-900 font-semibold flex flex-col  ">
                <FieldLabel htmlFor="questionKey" className="text-[16px]">
                  Key:
                </FieldLabel>
                <span className="flex items-center  ">
                  <Dot />
                  <Input
                    id="questionKey"
                    name="key"
                    value={question?.key}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      setQuestion((prev) => ({
                        ...prev,
                        [name]: value,
                      }));
                    }}
                    className=" flex items-center capitalize"
                  />
                </span>
              </Field>

              <Field className="text-black font-semibold flex flex-col ">
                <FieldLabel className="text-[16px]">Distractors:</FieldLabel>

                {question?.type === "mcq" && renderDistractors(question)}
              </Field>
            </div>
          </EditQuestionForm>
        )}
      </Card>
    </div>
  );
};

export default AddQuestion;
