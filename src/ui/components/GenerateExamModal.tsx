import { Plus, Sparkles, X } from "lucide-react";
import { Modal } from "./Modal";
import { useState, type Dispatch, type SetStateAction } from "react";
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
import type { IGenerateExamInput, IQuestions } from "@/shared/interfaces";
import { useFetch } from "../hooks/custom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { unwrapIpcResult } from "../lib/utils";
import ExamCard from "./ExamCard";

interface IRawCriteria {
  _id: string;
  categoryId: string;
  subcategoryId: string;
  difficulty: TQuestionDifficulty;
  numberOfQuestions: number;
  examType: TQuestionTypes;
}

const defaultCriteria: IRawCriteria = {
  _id: "",
  categoryId: "",
  subcategoryId: "",
  difficulty: "" as TQuestionDifficulty,
  numberOfQuestions: 0,
  examType: "" as TQuestionTypes,
};

interface IProps {
  addedQuestions: IQuestions[];
  setAddedQuestions: Dispatch<SetStateAction<IQuestions[]>>;
  totalQuestions: number;
  examType: TQuestionTypes;
}

const GenerateExamModal = ({
  addedQuestions,
  totalQuestions,
  examType,
  setAddedQuestions,
}: IProps) => {
  const [open, setOpen] = useState(false);
  const [openExcludeModal, setOpenExcludeModal] = useState(false);
  const [criteria, setCriteria] = useState<IRawCriteria[]>([]);
  const [excludeExamIds, setExcludedExamIds] = useState<number[]>([]);

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

  const { data: exams } = useFetch({
    queryKey: ["exam", "getAll"],
    queryFn: () => window.electron.exam.findAllExams(),
  });

  const onValueChange = (
    criteria: IRawCriteria,
    value: string | number,
    name: keyof IRawCriteria,
  ) => {
    setCriteria((prev) =>
      prev.map((item) =>
        item._id === criteria._id
          ? name === "categoryId"
            ? { ...item, [name]: String(value), subcategoryId: "" }
            : { ...item, [name]: value }
          : item,
      ),
    );
  };

  const onRemoveCriteria = (criteriaId: string) => {
    const filteredCriteria = criteria.filter((item) => item._id !== criteriaId);
    setCriteria(filteredCriteria);
  };

  const generateExamQuestions = useMutation({
    mutationFn: (criteria: IGenerateExamInput) =>
      unwrapIpcResult(window.electron.question.generateExamQuestions(criteria)),
    onSuccess: (data) => {
      if (data) setAddedQuestions((prev) => [...prev, ...data]);
      reset();
      setCriteria([]);
      setOpen(false);
      toast.success("Questions Generated Successfully", {
        position: "top-center",
        style: {
          justifyContent: "center",
          color: "green",
          fontSize: "16px",
        },
      });
    },
    onError: (error) => {
      console.log(error);
      const errorIdx = criteria.findIndex((item) => item._id === error.cause);
      toast.error(`Criteria ${errorIdx + 1}: ${error.message}`, {
        position: "top-center",
        style: {
          justifyContent: "center",
          color: "crimson",
          fontSize: "16px",
        },
      });
    },
  });

  const onSubmit = (data: GenerateQuestionFormValues) => {
    const payload = data.criteria.map((item) => {
      return {
        ...item,
        categoryId: Number(item.categoryId),
        subcategoryId: Number(item.subcategoryId),
      };
    });
    generateExamQuestions.mutate({
      criteria: payload,
      excludeExamIds: excludeExamIds,
    });
  };

  const renderSubFilters = (categoryId: string | undefined) => {
    if (categoryId) {
      const filteredSub = subcategories?.filter(
        (item) => item.categoryId.toString() === categoryId,
      );
      return filteredSub?.map((sub) => (
        <SelectItem key={sub._id} value={sub._id.toString()}>
          {sub.name}
        </SelectItem>
      ));
    } else {
      return subcategories?.map((sub) => (
        <SelectItem key={sub._id} value={sub._id.toString()}>
          {sub.name}
        </SelectItem>
      ));
    }
  };

  // todo:make error disappear on entering new value
  const renderCriteria = criteria.map((criteria, idx) => {
    return (
      <div
        key={criteria._id}
        className="flex w-full justify-between items-center py-2 px-2 rounded-md hover:bg-muted/10"
      >
        <div className="size-8 text-xl text-center flex items-center justify-center rounded-md bg-muted/10 font-semibold text-card-foreground pb-0.5">
          {idx + 1}
        </div>
        <div className="flex flex-col gap-2 max-w-56">
          <SingleSelect
            value={criteria?.categoryId.toString()}
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
            value={criteria.subcategoryId.toString()}
            placeholder="Choose Specialization"
            onValueChange={(value) => {
              onValueChange(criteria, value, "subcategoryId");
            }}
          >
            {renderSubFilters(criteria.categoryId.toString())}
          </SingleSelect>
          {errors.criteria?.[idx] && (
            <p className="text-destructive text-sm font-semibold">
              {errors.criteria?.[idx]?.subcategoryId?.message}
            </p>
          )}
        </div>

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
            value={criteria.difficulty as TQuestionDifficulty}
            placeholder="Choose Difficulty"
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
              onRemoveCriteria(criteria._id as string);
            }}
          >
            <X />
          </Button>
        </div>
      </div>
    );
  });

  console.log(excludeExamIds);

  const toggleExcluded = (examId: number) => {
    if (excludeExamIds?.includes(examId)) {
      const filtered = excludeExamIds.filter((item) => item !== examId);
      setExcludedExamIds(filtered);
    } else {
      setExcludedExamIds((prev) => [...prev, examId]);
    }
  };

  const renderExams = exams?.map((exam) => {
    return (
      <div
        key={exam._id}
        className={`rounded-lg ${excludeExamIds.includes(exam._id) ? "border-2 border-primary" : ""}`}
      >
        <ExamCard
          exam={exam}
          onClick={() => {
            toggleExcluded(exam._id);
          }}
        />
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
      <div className="w-full flex items-center justify-between">
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
        <Modal
          title="Exclude Questions From Exams"
          triggerText={"Exclude Questions From Exams"}
          open={openExcludeModal}
          setOpen={setOpenExcludeModal}
          saveButton={false}
          onCancel={() => setExcludedExamIds([])}
        >
          {renderExams}
          <Button
            type="button"
            className="w-fit"
            onClick={() => {
              setOpenExcludeModal(false);
            }}
          >
            Done
          </Button>
        </Modal>
      </div>

      <div className="mt-5">
        <div className="flex flex-col gap-5 w-full">
          <Button
            type="button"
            className="w-fit"
            onClick={() => {
              setCriteria((prev) => [
                ...prev,
                { ...defaultCriteria, _id: uuid(), examType: examType },
              ]);
            }}
          >
            <Plus /> Add Criteria
          </Button>
          <div className="flex flex-col w-full gap-y-3">
            <div className="flex w-full items-center justify-between font-semibold text-lg px-2">
              <span className="size-8 text-center">#</span>
              <span className="w-56">Topic</span>
              <span className="w-56">Specialization</span>
              <span className="max-w-56 sm:w-32 lg:w-56  min-w-8">
                Number of Questions
              </span>
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
                  return {
                    ...item,
                  };
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
