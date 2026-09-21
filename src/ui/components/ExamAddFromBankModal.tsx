import { X } from "lucide-react";
import { Button } from "./ui/button";
import type { IQuestions } from "@/shared/interfaces";
import {
  useEffect,
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
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ExamAddFromBankModal = ({
  setAddedQuestions,
  examType,
  open,
  setOpen,
}: IProps) => {
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
    // if (containerRef.current !== null)
    parentRef?.current?.scrollTo({ top: 0 });
    setOpen(false);
    setSelectedQuestions([]);
  };

  const onAddFromBankSubmit = () => {
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

          const isSelected = selectedQuestions.some(
            (item) => item._id === question._id,
          );

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
                className={`mb-5 rounded-md h-fit ${isSelected ? "border-2 border-primary" : ""}`}
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

  const [shouldRender, setShouldRender] = useState(open);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
    }
  }, [open]);

  if (!shouldRender) return null;

  return (
    <div
      data-open={open}
      data-closed={!open}
      onAnimationEnd={() => {
        if (!open) setShouldRender(false);
      }}
      className="fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 max-h-80vh overflow-auto"
    >
      <div
        className={`absolute rounded-lg bg-popover p-5 m-auto w-[95%] z-10 h-[95%] inset-0 ${open ? "flex" : "hidden"}`}
      >
        <div className="relative w-full h-full bg-popover z-10 flex flex-col gap-5">
          <div className="w-full flex justify-between">
            <h1 className="text-3xl font-semibold tracking-tight">
              Add From Question Bank
            </h1>
            <X
              size={20}
              className="text-muted/80 hover:text-muted cursor-pointer"
              onClick={() => {
                onClose();
              }}
            />
          </div>
          <div className=" sticky top-0 w-full flex justify-end  ">
            <div className="bg-popover ">
              <Button
                type="button"
                onClick={onAddFromBankSubmit}
                disabled={selectedQuestions?.length === 0}
                className="sm:w-lg disabled:pointer-events-none"
              >
                Add
                {selectedQuestions?.length > 0 &&
                  ` (${selectedQuestions.length})`}
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
            className="w-full flex flex-col mt-5 h-[calc(100vh-250px)] overflow-y-auto scrollbar-none gap-5"
          >
            {renderQuestions()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamAddFromBankModal;
