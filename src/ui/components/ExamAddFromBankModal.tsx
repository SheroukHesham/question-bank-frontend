import { Plus, Search } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./ui/button";
import type { IQuestions } from "@/shared/interfaces";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import QuestionCard from "./QuestionCard";
import type { TQuestionDifficulty, TQuestionTypes } from "@/shared/types";
import { SingleSelect } from "./SingleSelect";
import { SelectItem } from "./ui/select";
import { useFetch } from "../hooks/custom";
import { Input } from "./ui/input";

interface IProps {
  examType: TQuestionTypes;
  addedQuestions: IQuestions[];
  setAddedQuestions: Dispatch<SetStateAction<IQuestions[]>>;
}

//todo: all fetch statements in redux and components select values

const ExamAddFromBankModal = ({
  addedQuestions,
  setAddedQuestions,
  examType,
}: IProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState<IQuestions[]>([]);
  const [difficultyFilter, setDifficultyFilter] =
    useState<TQuestionDifficulty | null>(null);
  const [specializationFilter, setSpecializationFilter] = useState<
    string | null
  >(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const { data: questions } = useFetch({
    queryKey: ["questions", "filtered"],
    queryFn: () => window.electron.question.filterQuestions(examType),
  });
  const { data: categories } = useFetch({
    queryKey: ["categories", "findAllDetails"],
    queryFn: () => window.electron.category.findAllCategoriesDetails(),
  });
  const { data: subcategories } = useFetch({
    queryKey: ["subcategories", "findAllDetails"],
    queryFn: () => window.electron.subcategory.findAllSubcategories(),
  });

  const filteredQuestions = useMemo(() => {
    return (questions ?? []).filter((item) => {
      const matchesDifficulty =
        difficultyFilter === null || item.difficulty === difficultyFilter;
      const matchesSpecialization =
        !specializationFilter ||
        item.subcategoryId.toString() === specializationFilter;
      const matchesCategory =
        !categoryFilter || item.categoryId.toString() === categoryFilter;
      return matchesDifficulty && matchesSpecialization && matchesCategory;
    });
  }, [questions, difficultyFilter, specializationFilter, categoryFilter]);

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
    setOpen(false);
    onClose();
    selectedQuestions.map((question) => {
      if (addedQuestions.includes(question)) return;
      else {
        setAddedQuestions((prev) => [...prev, question]);
      }
    });
  };

  const renderSubFilters = () => {
    if (categoryFilter) {
      const filteredSub = subcategories?.filter(
        (item) => item.categoryId.toString() === categoryFilter,
      );

      return filteredSub?.map((sub) => {
        return (
          <SelectItem key={sub._id} value={sub._id.toString()}>
            {sub.name}
          </SelectItem>
        );
      });
    } else {
      return subcategories?.map((sub) => {
        return (
          <SelectItem key={sub._id} value={sub._id.toString()}>
            {sub.name}
          </SelectItem>
        );
      });
    }
  };

  const renderQuestions = filteredQuestions
    ?.filter((question) => {
      return search === ""
        ? question
        : question.header.toLowerCase().includes(search.toLowerCase());
    })
    .map((question, idx) => {
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
    <Modal
      title="Add From Question Bank"
      triggerText={"Add From Question Bank"}
      triggerIcon={<Plus />}
      saveButton={false}
      onClose={onClose}
      buttonVariant={"default"}
      open={open}
      setOpen={setOpen}
    >
      <div className=" sticky top-0 w-full flex justify-end  ">
        <div className="bg-popover ">
          <Button
            type="button"
            onClick={onAddFromBankSubmit}
            disabled={selectedQuestions?.length === 0}
            className="sm:w-lg disabled:pointer-events-none"
          >
            Add
            {selectedQuestions?.length > 0 && ` (${selectedQuestions.length})`}
          </Button>
        </div>
      </div>

      <div className="max-w-3xl flex items-center border-popover-border rounded-lg bg-white shadow-lg in-focus:shadow">
        <Input
          className="bg-transparent border-none shadow-none focus-visible:shadow-none"
          autoFocus={false!}
          placeholder="Search Question Bank"
          value={search}
          onChange={({ target }) => {
            setSearch(target.value);
          }}
        />
        <div className="pr-3">
          <Search color="gray" />
        </div>
      </div>

      <div className="w-full flex md:flex-row flex-col gap-y-2">
        <SingleSelect
          placeholder="Topic"
          onValueChange={(value) =>
            setCategoryFilter(value === "all" ? null : value)
          }
        >
          <SelectItem value="all">All</SelectItem>
          {categories?.map((category) => {
            return (
              <SelectItem
                key={category.categoryId}
                value={category.categoryId.toString()}
              >
                {category.categoryName}
              </SelectItem>
            );
          })}
        </SingleSelect>

        <SingleSelect
          placeholder="Subtopic"
          onValueChange={(value) =>
            setSpecializationFilter(value === "all" ? null : value)
          }
        >
          <SelectItem value="all">All</SelectItem>
          {renderSubFilters()}
        </SingleSelect>

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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderQuestions}
      </div>
    </Modal>
  );
};

export default ExamAddFromBankModal;
