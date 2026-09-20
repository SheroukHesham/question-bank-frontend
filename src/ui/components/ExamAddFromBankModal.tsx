import { Plus } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./ui/button";
import type { IQuestions } from "@/shared/interfaces";
import {
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import QuestionCard from "./QuestionCard";
import type { TQuestionDifficulty, TQuestionTypes } from "@/shared/types";
import { SingleSelect } from "./SingleSelect";
import { SelectItem } from "./ui/select";
import { useFetch } from "../hooks/custom";
import ReusableSearch from "./ReusableSearch";
import { useVirtualizer } from "@tanstack/react-virtual";

interface IProps {
  examType: TQuestionTypes;
  addedQuestions: IQuestions[];
  setAddedQuestions: Dispatch<SetStateAction<IQuestions[]>>;
}

const ExamAddFromBankModal = ({ setAddedQuestions, examType }: IProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState<IQuestions[]>([]);
  const [difficultyFilter, setDifficultyFilter] =
    useState<TQuestionDifficulty | null>(null);
  const [specializationFilter, setSpecializationFilter] = useState<
    string | null
  >(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

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
    if (search === "") {
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
    } else {
      return (questions ?? []).filter((question) =>
        question.header.toLowerCase().includes(search.toLowerCase()),
      );
    }
  }, [
    questions,
    difficultyFilter,
    specializationFilter,
    categoryFilter,
    search,
  ]);

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
    setAddedQuestions((prev) => {
      const existingIds = new Set(prev.map((question) => question._id));

      const newQuestions = selectedQuestions.filter(
        (question) => !existingIds.has(question._id),
      );
      return [...prev, ...newQuestions];
    });

    onClose();
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

  //todo:fix questions appear on rerender and grid layout
  const rowVirtualizer = useVirtualizer({
    count: filteredQuestions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5,
    getItemKey: (index) => filteredQuestions[index]._id,
    measureElement:
      typeof window !== "undefined"
        ? (element) => element.getBoundingClientRect().height
        : undefined,
  });

  const renderQuestions = () => {
    return (
      <div
        className="relative w-full flex flex-col gap-5"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const question = filteredQuestions[virtualItem.index];
          return (
            <div
              key={question._id}
              ref={rowVirtualizer.measureElement}
              data-index={virtualItem.index}
              className="absolute top-0 left-0 w-full "
              style={{
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <div
                key={question._id}
                className={`rounded-md h-fit mb-5 ${selectedQuestions.includes(question) ? "border-2 border-primary" : ""}`}
              >
                <QuestionCard
                  idx={virtualItem.index}
                  question={question}
                  editable={false}
                  size="sm"
                  onClick={() => toggleSelected(question)}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

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

      <ReusableSearch
        placeholder="Search Question Bank"
        search={search}
        setSearch={setSearch}
      />

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

      <div
        ref={parentRef}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[calc(100vh-250px)] overflow-y-auto scrollbar-none"
      >
        {renderQuestions()}
      </div>
    </Modal>
  );
};

export default ExamAddFromBankModal;
