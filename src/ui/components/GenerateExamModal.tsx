import { Plus, Sparkles, X } from "lucide-react";
import { Modal } from "./Modal";
import { type ICriteria } from "@/shared/interfaces";
import { useState } from "react";
import type { TQuestionDifficulty, TQuestionTypes } from "@/shared/types";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  generateQuestionsSchema,
  type GenerateQuestionFormValues,
} from "@/ui/validation";
import { NumberSelectorInput } from "./NumberSelectorInput";
import { v4 as uuid } from "uuid";
import { SingleSelect } from "./SingleSelect";
import { SelectItem } from "./ui/select";
import type { IQuestions } from "@/shared/interfaces";
import { useFetch } from "../hooks/custom";

const defaultCriteria: ICriteria = {
  _id: "",
  categoryId: "",
  subId: "",
  difficulty: "" as TQuestionDifficulty,
  numberOfQuestions: 0,
};

interface IProps {
  addedQuestions: IQuestions[];
  totalQuestions: number;
  examType: TQuestionTypes;
}

const GenerateExamModal = ({ addedQuestions, totalQuestions }: IProps) => {
  const [open, setOpen] = useState(false);
  const [criteria, setCriteria] = useState<ICriteria[]>([]);

  const {
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<GenerateQuestionFormValues>({
    resolver: yupResolver(generateQuestionsSchema),
  });

  const { data: categories } = useFetch({
    queryKey: ["categories", "findAllDetails"],
    queryFn: () => window.electron.category.findAllCategoriesDetails(),
  });
  const { data: subcategories } = useFetch({
    queryKey: ["subcategories", "findAllDetails"],
    queryFn: () => window.electron.subcategory.findAllSubcategories(),
  });

  const onValueChange = (
    criteria: ICriteria,
    value: string | number,
    name: keyof ICriteria,
  ) => {
    setCriteria((prev) =>
      prev.map((item) =>
        item._id === criteria._id ? { ...item, [name]: value } : item,
      ),
    );
  };

  const onRemoveCriteria = (criteriaId: string) => {
    const filteredCriteria = criteria.filter((item) => item._id !== criteriaId);
    setCriteria(filteredCriteria);
  };

  const onSubmit = (data: GenerateQuestionFormValues) => {
    console.log("Data", data.criteria);
    //todo: send to api to generate questions

    //todo:add generated questions to addedQuestions (add setter to props)
  };

  const renderSubFilters = (categoryId: string | undefined) => {
    if (categoryId) {
      const filteredSub = subcategories?.filter(
        (item) => item.categoryId,
        toString() === categoryId,
      );
      return filteredSub?.map((sub) => (
        <SelectItem key={sub._id} value={sub._id.toString()}>
          {sub.name}
        </SelectItem>
      ));
    }
    return subcategories?.map((sub) => (
      <SelectItem key={sub._id} value={sub._id.toString()}>
        {sub.name}
      </SelectItem>
    ));
  };

  // todo:add error msg to inputs
  const renderCriteria = criteria.map((criteria, idx) => {
    return (
      <div
        key={criteria._id}
        className="flex w-full justify-between py-2 px-2 rounded-md hover:bg-muted/10"
      >
        <div className="flex flex-col gap-2 max-w-56">
          <NumberSelectorInput
            name="numberOfQuestions"
            value={criteria.numberOfQuestions}
            onValueChange={(value) => {
              onValueChange(criteria, value as number, "numberOfQuestions");
            }}
          />
          {errors.criteria?.[idx] && (
            <p className="text-destructive text-sm font-semibold">
              {errors.criteria?.[idx]?.numberOfQuestions?.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 max-w-56">
          <SingleSelect
            value={criteria?.categoryId}
            placeholder="Choose Topic"
            onValueChange={(value) => {
              onValueChange(criteria, value, "categoryId");
            }}
          >
            {categories?.map((category) => {
              return (
                <SelectItem
                  key={category.categoryId}
                  className="capitalize"
                  value={category.categoryId.toString()}
                >
                  {category.categoryName}
                </SelectItem>
              );
            })}
          </SingleSelect>
          {errors.criteria?.[idx] && (
            <p className="text-destructive text-sm font-semibold">
              {errors.criteria?.[idx]?.categoryId?.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 max-w-56">
          <SingleSelect
            value={criteria.subId}
            placeholder="Choose Specialization"
            onValueChange={(value) => {
              onValueChange(criteria, value, "subId");
            }}
          >
            {renderSubFilters(criteria.categoryId)}
          </SingleSelect>
          {errors.criteria?.[idx] && (
            <p className="text-destructive text-sm font-semibold">
              {errors.criteria?.[idx]?.subId?.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 max-w-56">
          <SingleSelect
            value={criteria.difficulty as TQuestionDifficulty}
            placeholder="Choose Topic"
            onValueChange={(value) => {
              onValueChange(criteria, value, "difficulty");
            }}
          >
            <SelectItem className="capitalize" value="easy">
              Easy
            </SelectItem>
            <SelectItem className="capitalize" value="moderate">
              Moderate
            </SelectItem>
            <SelectItem className="capitalize" value="difficult">
              Difficult
            </SelectItem>
          </SingleSelect>
          {errors.criteria?.[idx] && (
            <p className="text-destructive text-sm font-semibold">
              {errors.criteria?.[idx]?.difficulty?.message}
            </p>
          )}
        </div>
        <div className="flex items-center">
          <Button
            variant={"ghost"}
            size={"icon"}
            type="button"
            onClick={() => {
              onRemoveCriteria(criteria._id);
            }}
          >
            <X />
          </Button>
        </div>
      </div>
    );
  });

  return (
    <Modal
      title="Generate Exam Questions"
      triggerText={"Smart Generate Questions"}
      triggerIcon={<Sparkles />}
      saveButton={false}
      open={open}
      setOpen={setOpen}
      showCloseButton={false}
      onCancel={() => {
        reset();
        setCriteria([]);
      }}
    >
      <div>
        <span className="text-muted/70 font-semibold mr-2 items-center ">
          Questions Added:
        </span>
        <span
          className={`font-bold ${addedQuestions.length > totalQuestions ? "text-destructive" : ""}`}
        >
          {addedQuestions.length}
        </span>
        <span className="font-semibold">/{totalQuestions}</span>
      </div>

      <div className="mt-5">
        <div className="flex flex-col gap-5 w-full">
          <Button
            type="button"
            className="w-fit"
            onClick={() => {
              setCriteria((prev) => [
                ...prev,
                { ...defaultCriteria, _id: uuid() },
              ]);
            }}
          >
            <Plus /> Add Criteria
          </Button>
          <div className="flex flex-col w-full gap-y-3">
            <div className="flex w-full items-center justify-between font-semibold text-lg px-2">
              <span className="max-w-56 sm:w-32 lg:w-56  min-w-8">
                Number of Questions
              </span>
              <span className="w-56">Topic</span>
              <span className="w-56">Specialization</span>
              <span className="w-56">Difficulty</span>
              <span className="fill-transparent">
                <X className="text-transparent " />
              </span>
            </div>
            {criteria.length ? (
              <div className="flex flex-col gap-5">{renderCriteria}</div>
            ) : (
              <div className="w-full flex justify-center">
                <span>No criteria added yet</span>
              </div>
            )}
          </div>

          {errors?.criteria?.message && (
            <p className="text-destructive text-sm font-semibold">
              {errors.criteria.message}
            </p>
          )}

          <div className="w-full flex justify-center">
            <Button
              type="button"
              className="w-fit "
              variant={"secondary"}
              onClick={() => {
                const strippedCriteria = criteria.map((item) => {
                  const { _id, ...rest } = item;
                  return rest;
                });
                setValue("criteria", strippedCriteria);
                handleSubmit(onSubmit)();
              }}
            >
              <Sparkles /> Generate Questions
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default GenerateExamModal;
