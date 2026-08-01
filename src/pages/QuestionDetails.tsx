import { Alert } from "@/components/Alert";
import { EditQuestionForm } from "@/components/EditQuestionForm";
import QuestionDetailsCard from "@/components/QuestionDetailsCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { defaultQuestion } from "@/data";
import { changeActiveTab } from "@/features/activeTabSlice";
import type { IMcqQuestion, IQuestions } from "@/interfaces";
import { MOCK_QUESTIONS } from "@/mock";
import { Dot, Pen, Trash } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const QuestionDetails = () => {
  const dispatch = useDispatch();
  dispatch(changeActiveTab("questions"));
  // TODO: replace with getQuestion by id API request
  const params = useParams();
  const question = MOCK_QUESTIONS.find((q) => q._id === params.id);
  const [editMode, setEditMode] = useState(false);
  const [questionToEdit, setQuestionToEdit] =
    useState<IQuestions>(defaultQuestion);

  if (!question) {
    return <h1>Question Not Found</h1>;
  }

  console.log(questionToEdit);

  const onSubmit = () => {
    // TODO: API request to to edit question
    // TODO: revisit setQuestionToEdit logic
    console.log("Submitted");
    setQuestionToEdit(question as IQuestions);
    setEditMode(false);
  };

  const onCancel = () => {
    setQuestionToEdit(question as IQuestions);
    setEditMode(false);
  };

  const onDelete = () => {
    //TODO: change to API call to delete question
    console.log("Delete");
  };

  const renderDistractors = ({
    distractors,
  }: {
    distractors: string[];
  }): ReactNode =>
    distractors.map((distractor, index) => (
      <span key={index} className="flex items-center font-bold">
        <Dot />
        <span className="flex items-center capitalize">{distractor}</span>
      </span>
    ));

  const renderEditDistractors = (q: IMcqQuestion) =>
    q.distractors?.map((distractor, idx) => {
      return (
        <span key={idx} className="flex items-center font-bold">
          <Dot />
          <Input
            className="flex items-center capitalize"
            name="distractors"
            id="distractors"
            value={distractor}
            onChange={(e) => {
              const { name, value } = e.target;
              const newDistractors = q.distractors?.with(idx, value);
              setQuestionToEdit((prev) => ({
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
      <div className="flex w-full justify-end">
        {!editMode ? (
          <Button
            className="w-fit"
            onClick={() => {
              setQuestionToEdit(question);
              setEditMode(true);
            }}
          >
            <Pen />
            Edit Question
          </Button>
        ) : (
          <Alert
            title="Are You Sure You Want to Delete This Question?"
            description="Deleting this question will permanently remove it from the question bank."
            submitText="Delete"
            variant="destructive"
            onSubmit={onDelete}
            icon={<Trash />}
            buttonChildren={
              <>
                <Trash />
                Delete Question
              </>
            }
          />
        )}
      </div>
      <div>
        {editMode ? (
          <Card>
            {questionToEdit?.type === "essay" ? (
              <EditQuestionForm
                questionToEdit={questionToEdit as IQuestions}
                setQuestionToEdit={setQuestionToEdit}
                onSubmit={onSubmit}
                onCancel={onCancel}
              >
                <Field>
                  <FieldLabel
                    htmlFor="modelAnswer"
                    className="text-black font-bold mb-2 text-lg"
                  >
                    Model Answer
                  </FieldLabel>
                  <Textarea
                    id="modelAnswer"
                    placeholder="Enter the model answer"
                    name="modelAnswer"
                    value={questionToEdit.modelAnswer}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      setQuestionToEdit((prev) => ({ ...prev, [name]: value }));
                    }}
                    className="text-[16px] text-black font-semibold text-justify min-h-fit "
                  />
                </Field>
              </EditQuestionForm>
            ) : (
              <EditQuestionForm
                questionToEdit={questionToEdit as IQuestions}
                setQuestionToEdit={setQuestionToEdit}
                onSubmit={onSubmit}
                onCancel={onCancel}
              >
                <div className="flex w-[80%] gap-x-5 justify-center">
                  <Field className="text-green-900 font-semibold flex flex-col  ">
                    <FieldLabel className="text-[16px]">Key:</FieldLabel>
                    <span className="flex items-center font-bold ">
                      <Dot />
                      <Input
                        id="questionKey"
                        name="key"
                        value={questionToEdit?.key}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          setQuestionToEdit((prev) => ({
                            ...prev,
                            [name]: value,
                          }));
                        }}
                        className=" flex items-center capitalize"
                      />
                    </span>
                  </Field>

                  <Field className="text-black font-semibold flex flex-col ">
                    <FieldLabel className="text-[16px]">
                      Distractors:
                    </FieldLabel>

                    {questionToEdit?.type === "mcq" &&
                      renderEditDistractors(questionToEdit)}
                  </Field>
                </div>
              </EditQuestionForm>
            )}
          </Card>
        ) : question?.type === "essay" ? (
          <QuestionDetailsCard
            header={question?.header as string}
            difficulty={question?.difficulty as number}
            mark={question?.mark as number}
          >
            <div className="text-black font-bold mb-2">Model Answer:</div>
            <div className="h-fit text-black font-semibold text-justify text-[16px]">
              {question?.modelAnswer}
            </div>
          </QuestionDetailsCard>
        ) : (
          <QuestionDetailsCard
            header={question?.header as string}
            difficulty={question?.difficulty as number}
            mark={question?.mark as number}
          >
            <div className="flex w-[80%] justify-between">
              <div className="text-green-900 font-semibold flex flex-col text-[16px]">
                <span>Key:</span>
                {question?.key && (
                  <span className="flex items-center font-bold ">
                    <Dot />
                    <span className=" flex items-center capitalize">
                      {question?.key}
                    </span>
                  </span>
                )}
              </div>

              <div className="text-black font-semibold flex flex-col text-[16px]">
                <span>Distractors:</span>
                {question?.distractors &&
                  renderDistractors({
                    distractors: question?.distractors as string[],
                  })}
              </div>
            </div>
          </QuestionDetailsCard>
        )}
      </div>
    </div>
  );
};

export default QuestionDetails;
