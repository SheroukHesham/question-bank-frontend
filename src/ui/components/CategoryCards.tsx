import { ClickCard } from "./ClickCard";
import { useNavigate } from "react-router-dom";
import { Separator } from "./ui/separator";
import { Badge } from "./reui/badge";
import type { ICategoryDetails } from "@/shared/interfaces";

interface IProps {
  categoriesDetails: ICategoryDetails[] | undefined;
}

const CategoryCards = ({ categoriesDetails }: IProps) => {
  const navigate = useNavigate();
  console.log(categoriesDetails);

  return (
    <>
      {categoriesDetails?.map((category, idx) => {
        return (
          <ClickCard
            key={idx}
            title={category.categoryName}
            onClick={() => {
              navigate(`/category/${category.categoryId}`);
            }}
          >
            <div className="w-full flex flex-col justify-around h-full">
              <div className="w-full flex justify-between items-center">
                <span className="font-semibold text-[15px]">
                  Total Questions
                </span>
                <div className="size-8 rounded-full bg-primary text-primary-foreground flex justify-center items-center">
                  {category.totalQuestions}
                </div>
              </div>
              <Separator />
              <div className="flex flex-col gap-3 ">
                <span className="font-semibold text-[15px]">Types</span>

                {category.subcategories[0] !== null ? (
                  <div className="flex w-full  flex-wrap gap-2">
                    {category.subcategories.map((subcategory) => {
                      return (
                        <Badge
                          key={subcategory}
                          size={"xl"}
                          variant={"primary-light"}
                          radius={"full"}
                        >
                          {subcategory}
                        </Badge>
                      );
                    })}
                  </div>
                ) : (
                  <span className="italic">No Types Yet!</span>
                )}
              </div>
            </div>
          </ClickCard>
        );
      })}
    </>
  );
};

export default CategoryCards;
