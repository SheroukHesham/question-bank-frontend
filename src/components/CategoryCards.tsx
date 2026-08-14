import { MOCK_CATEGORIES } from "@/mock";
import { ClickCard } from "./ClickCard";
import { useNavigate } from "react-router-dom";
import { Separator } from "./ui/separator";
import { Badge } from "./reui/badge";
import { findSubCategory } from "@/functions";

const CategoryCards = () => {
  const navigate = useNavigate();
  return (
    <>
      {MOCK_CATEGORIES.map((category) => {
        return (
          <ClickCard
            key={category._id}
            title={category.name}
            onClick={() => {
              navigate(`/category/${category._id}`);
            }}
          >
            <div className="w-full flex flex-col justify-around h-full">
              <div className="w-full flex justify-between items-center">
                <span className="font-semibold text-[15px]">
                  Total Questions
                </span>
                <div className="size-8 rounded-full bg-primary text-primary-foreground flex justify-center items-center">
                  05
                </div>
              </div>
              <Separator />
              <div className="flex flex-col gap-3">
                <span className="font-semibold text-[15px]">Types</span>

                <div className="flex w-full gap-2">
                  {category.subCategories.map((subcategory) => {
                    return (
                      <Badge
                        key={subcategory}
                        size={"xl"}
                        variant={"primary-light"}
                        radius={"full"}
                      >
                        {findSubCategory(subcategory)}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>
          </ClickCard>
        );
      })}
    </>
  );
};

export default CategoryCards;
