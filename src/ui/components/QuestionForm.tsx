import { Modal } from "./Modal";
import { PenBoxIcon, Plus } from "lucide-react";
import { RadioGroupChoiceCard } from "./ChoiceCard";
import { Field, FieldLabel } from "./ui/field";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { questionSchema, type QuestionFormValues } from "@/ui/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  defaultEssayFormValues,
  defaultMcqFormValues,
  RadioQuestionGroup,
} from "@/ui/data";
import type {
  ICreateEssayQuestion,
  ICreateMcqQuestion,
  IEssayQuestion,
  IMcqQuestion,
  IQuestions,
} from "@/shared/interfaces";
import { SingleSelect } from "./SingleSelect";
import { SelectItem } from "./ui/select";
import { isEssayQuestion, isMcqQuestion, splitFunction } from "@/ui/functions";
import ImageUpload from "./ImageUpload";
import { ChoicesInput } from "./ChoicesInput";
import type { TQuestionDifficulty, TQuestionTypes } from "@/shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFetch } from "../hooks/custom";
import { Textarea } from "./ui/textarea";

//TODO: add difficulty and API calls

interface IProps {
  type?: "create" | "edit";
  questionToEdit?: IQuestions;
  setQuestionToEdit?: Dispatch<SetStateAction<IEssayQuestion | IMcqQuestion>>;
}

const QuestionForm = ({
  type = "create",
  questionToEdit,
  setQuestionToEdit,
}: IProps) => {
  const [mcq, setMcq] = useState(true);
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const {
    setValue,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    resolver: yupResolver(questionSchema),
    defaultValues:
      type === "create"
        ? mcq
          ? defaultMcqFormValues
          : defaultEssayFormValues
        : questionToEdit,
  });

  const { data: groupedCategories } = useFetch({
    queryKey: ["categories", "getGroupedSubCat"],
    queryFn: () => window.electron.category.getGroupedCategorySubcategory(),
  });

  const onSelectTopicValueChange = (v: string) => {
    if (!v) return;
    const [category, subcategory] = splitFunction(v, "-");
    if (setValue) {
      setValue("categoryId", Number(category), { shouldValidate: true });
      setValue("subcategoryId", Number(subcategory), { shouldValidate: true });
    }
  };

  const onSelectDifficultyChange = (value: TQuestionDifficulty) => {
    if (setValue) {
      setValue("difficulty", value);
    }
  };

  const onSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ["categories", "findAllDetails"],
    });
    queryClient.invalidateQueries({
      queryKey: ["questions", "total"],
    });
    queryClient.invalidateQueries({
      queryKey: ["questions", "byCategory"],
    });
    setOpen(false);
    reset();
  };

  const addMcq = useMutation({
    mutationKey: ["question", "createMcq"],
    mutationFn: (payload: ICreateMcqQuestion) =>
      window.electron.question.createMcq(payload),
    onSuccess: () => {
      onSuccess();
    },
  });
  const addEssay = useMutation({
    mutationKey: ["question", "createEssay"],
    mutationFn: (payload: ICreateEssayQuestion) =>
      window.electron.question.createEssay(payload),
    onSuccess: () => {
      onSuccess();
    },
  });
  const updateMcq = useMutation({
    mutationKey: ["question", "updateMcq"],
    mutationFn: (payload: IMcqQuestion) =>
      window.electron.question.updateMcq(payload),
    onSuccess: () => {
      onSuccess();
    },
  });
  const updateEssay = useMutation({
    mutationKey: ["question", "updateEssay"],
    mutationFn: (payload: IEssayQuestion) =>
      window.electron.question.updateEssay(payload),
    onSuccess: () => {
      onSuccess();
    },
  });

  const onSubmit = (data: QuestionFormValues) => {
    const payload: IQuestions =
      data.type === "essay"
        ? ({ ...data, modelAnswer: data.modelAnswer! } as IEssayQuestion)
        : ({ ...data, choices: data.choices! } as IMcqQuestion);

    // TODO: API call with payload to create question or edit question
    if (type === "create") {
      if (data.type === "mcq") {
        addMcq.mutate(payload as ICreateMcqQuestion);
      } else {
        addEssay.mutate(payload as ICreateEssayQuestion);
      }
    } else if (data.type === "mcq") {
      updateMcq.mutate(payload as IMcqQuestion);
    } else {
      updateEssay.mutate(payload as IEssayQuestion);
    }

    if (setQuestionToEdit) setQuestionToEdit(payload);
  };

  const renderAnswerFrom = (type: TQuestionTypes) => {
    if (type === "mcq") {
      return (
        <Field data-invalid={false}>
          <FieldLabel>
            Choices<span className="text-destructive font-bold">*</span>
          </FieldLabel>
          <ChoicesInput
            setValue={setValue}
            itemList={
              questionToEdit && isMcqQuestion(questionToEdit)
                ? questionToEdit.choices
                : undefined
            }
            errors={errors}
          />
          {errors.choices && (
            <p className="text-destructive text-sm font-semibold">
              {errors.choices.message}
            </p>
          )}
        </Field>
      );
    } else {
      return (
        <Field data-invalid={false}>
          <FieldLabel htmlFor="model-answer">
            Model Answer
            <span className="text-destructive font-bold">*</span>
          </FieldLabel>
          <div className="h-50">
            <Textarea
              {...register("modelAnswer")}
              defaultValue={
                questionToEdit && isEssayQuestion(questionToEdit)
                  ? questionToEdit.modelAnswer
                  : undefined
              }
              placeholder="Enter Model Answer."
              className="min-h-35 h-35 max-h-50 bg-white p-5 shadow-sm text-lg font-semibold focus:shadow-md"
            />
          </div>
          {errors.modelAnswer && (
            <p className="text-destructive text-sm font-semibold">
              {errors.modelAnswer.message}
            </p>
          )}
        </Field>
      );
    }
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title={type === "create" ? "Create New Question" : "Edit Question"}
      triggerText={type === "create" ? "Create New Question" : null}
      triggerIcon={type === "create" ? <Plus /> : <PenBoxIcon />}
      onSubmit={handleSubmit(onSubmit)}
      onCancel={() => {
        reset();
      }}
      onClose={() => {
        reset();
      }}
    >
      <div className="w-full flex gap-5 flex-col overflow-auto ">
        <div className="flex w-full relative justify-between">
          <div className="flex flex-col w-lg min-w-sm gap-2">
            <span className="text-lg font-semibold">
              Question Type{"  "}
              <span className="text-destructive font-bold"> *</span>
            </span>
            <div className="flex gap-5">
              <RadioGroupChoiceCard
                setMcq={setMcq}
                setValue={setValue}
                defaultValue={
                  type === "create" ? "mcq" : (questionToEdit?.type as string)
                }
                radioItems={RadioQuestionGroup}
              />
            </div>
            {errors.type && (
              <p className="text-destructive text-sm font-semibold">
                {errors.type.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 w-3xs ">
            <SingleSelect
              label="Difficulty"
              onValueChange={(value) =>
                onSelectDifficultyChange(value as TQuestionDifficulty)
              }
              defaultValue={
                type === "edit" ? `${questionToEdit?.difficulty}` : undefined
              }
            >
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="difficult">Difficult</SelectItem>
            </SingleSelect>
            {errors.difficulty && (
              <p className="text-destructive text-sm font-semibold">
                {errors.difficulty.message}
              </p>
            )}
            <SingleSelect
              label="Topic, Type"
              onValueChange={onSelectTopicValueChange}
              defaultValue={
                type === "edit"
                  ? `${questionToEdit?.categoryId}-${questionToEdit?.subcategoryId}`
                  : undefined
              }
            >
              {groupedCategories?.map(
                ({
                  categoryId,
                  categoryName,
                  subcategoryId,
                  subcategoryName,
                }) => {
                  return (
                    <SelectItem
                      key={`${categoryId}-${subcategoryId}`}
                      value={`${categoryId}-${subcategoryId}`}
                      className="capitalize"
                    >
                      {categoryName}, {subcategoryName}
                    </SelectItem>
                  );
                },
              )}
            </SingleSelect>

            {errors.categoryId && (
              <p className="text-destructive text-sm font-semibold">
                {errors.categoryId.message}
              </p>
            )}
          </div>
        </div>

        <div className=" flex flex-col gap-5">
          <Field data-invalid={false}>
            <FieldLabel htmlFor="question-header">
              Question<span className="text-destructive font-bold">*</span>
            </FieldLabel>
            <div className="h-50">
              <Textarea
                {...register("header")}
                defaultValue={
                  questionToEdit && isEssayQuestion(questionToEdit)
                    ? questionToEdit.header
                    : undefined
                }
                placeholder="Enter Question Header."
                className="min-h-35 h-35 max-h-50 bg-white p-5 shadow-sm text-lg font-semibold focus:shadow-md"
              />
            </div>
            {errors.header && (
              <p className="text-destructive text-sm font-semibold">
                {errors.header.message}
              </p>
            )}
          </Field>
          <FieldLabel>Header Image (Optional)</FieldLabel>
          {type === "create" ? (
            <ImageUpload
              onFileSelected={(file) => {
                setValue("headerImageUrl", file.name);
              }}
              onClear={() => {
                setValue("headerImageUrl", "", { shouldValidate: true });
              }}
            />
          ) : (
            <ImageUpload
              image={questionToEdit?.headerImageUrl}
              onFileSelected={(file) => {
                setValue("headerImageUrl", file.name);
              }}
              onClear={() => {
                setValue("headerImageUrl", "", { shouldValidate: true });
              }}
            />
          )}

          {type === "create"
            ? mcq
              ? renderAnswerFrom("mcq")
              : renderAnswerFrom("essay")
            : renderAnswerFrom(questionToEdit?.type as TQuestionTypes)}
        </div>
      </div>
    </Modal>
  );
};

export default QuestionForm;
