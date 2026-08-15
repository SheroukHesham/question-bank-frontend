import { Plus } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./ui/button";
import type { IQuestions } from "@/interfaces";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import QuestionCard from "./QuestionCard";
import { MOCK_CATEGORIES, MOCK_QUESTIONS, MOCK_SUB_CATEGORIES } from "@/mock";
import { DialogClose } from "./ui/dialog";
import type { TQuestionDifficulty } from "@/types";
import { SingleSelect } from "./SingleSelect";
import { SelectItem } from "./ui/select";

interface IProps {
  addedQuestions: IQuestions[];
  setAddedQuestions: Dispatch<SetStateAction<IQuestions[]>>;
}

const ExamAddFromBankModal = ({
  addedQuestions,
  setAddedQuestions,
}: IProps) => {
  const [selectedQuestions, setSelectedQuestions] = useState<IQuestions[]>([]);
  const [difficultyFilter, setDifficultyFilter] =
    useState<TQuestionDifficulty | null>(null);
  const [specializationFilter, setSpecializationFilter] = useState<
    string | null
  >(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  //todo: questions from store
  const mcqQuestions = MOCK_QUESTIONS.filter(
    (question) => question.type === "mcq",
  );

  const filteredQuestions = useMemo(() => {
    return (mcqQuestions ?? []).filter((item) => {
      const matchesDifficulty =
        difficultyFilter === null || item.difficulty === difficultyFilter;
      const matchesSpecialization =
        !specializationFilter || item.subcategoryId === specializationFilter;
      const matchesCategory =
        !categoryFilter || item.categoryId === categoryFilter;
      return matchesDifficulty && matchesSpecialization && matchesCategory;
    });
  }, [mcqQuestions, difficultyFilter, specializationFilter, categoryFilter]);

  const toggleSelected = (question: IQuestions) => {
    if (selectedQuestions.includes(question)) {
      const filtered = selectedQuestions.filter((item) => item !== question);
      setSelectedQuestions(filtered);
    } else {
      setSelectedQuestions((prev) => [...prev, question]);
    }
  };

  const onClose = () => {
    setSelectedQuestions([]);
  };

  const onAddFromBankSubmit = () => {
    selectedQuestions.map((question) => {
      if (addedQuestions.includes(question)) return;
      else {
        setAddedQuestions((prev) => [...prev, question]);
      }
    });
  };

  const renderSubFilters = () => {
    if (categoryFilter) {
      const filteredSub = MOCK_SUB_CATEGORIES.filter(
        (item) => item.categoryId === categoryFilter,
      );

      return filteredSub.map((sub) => {
        return <SelectItem value={sub._id}>{sub.name}</SelectItem>;
      });
    } else {
      return MOCK_SUB_CATEGORIES.map((sub) => {
        return <SelectItem value={sub._id}>{sub.name}</SelectItem>;
      });
    }
  };

  const renderQuestions = filteredQuestions.map((question, idx) => {
    const isSelected = selectedQuestions.includes(question);
    return (
      <div
        key={idx}
        className={`rounded-md ${isSelected ? "border-2 border-primary" : ""}`}
      >
        <QuestionCard
          idx={idx}
          question={question}
          editable={false}
          size="sm"
          onClick={() => toggleSelected(question)}
        />
      </div>
    );
  });

  return (
    <div>
      <Modal
        title="Add Question"
        triggerText={"Add From Question Bank"}
        triggerIcon={<Plus />}
        saveButton={false}
        onClose={onClose}
      >
        <DialogClose asChild>
          <div className=" sticky top-0 w-full flex justify-end  ">
            <div className="bg-popover ">
              <Button
                type="button"
                onClick={onAddFromBankSubmit}
                disabled={selectedQuestions?.length === 0}
                className="w-lg"
              >
                Add
                {selectedQuestions?.length > 0
                  ? ` (${selectedQuestions.length})`
                  : ""}
              </Button>
            </div>
          </div>
        </DialogClose>

        <div className="w-full flex ">
          <SingleSelect
            placeholder="Question Difficulty"
            onValueChange={(value) =>
              setDifficultyFilter(
                value === "all" ? null : (value as TQuestionDifficulty),
              )
            }
          >
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="difficult">Difficult</SelectItem>
          </SingleSelect>

          <SingleSelect
            placeholder="Topic"
            onValueChange={(value) =>
              setCategoryFilter(value === "all" ? null : value)
            }
          >
            <SelectItem value="all">All</SelectItem>
            {MOCK_CATEGORIES.map((category) => {
              return (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              );
            })}
          </SingleSelect>
          <SingleSelect
            placeholder="Specialization"
            onValueChange={(value) =>
              setSpecializationFilter(value === "all" ? null : value)
            }
          >
            <SelectItem value="all">All</SelectItem>
            {renderSubFilters()}
          </SingleSelect>
        </div>

        <div className="grid grid-cols-2 gap-4">{renderQuestions}</div>
      </Modal>
    </div>
  );
};

export default ExamAddFromBankModal;
