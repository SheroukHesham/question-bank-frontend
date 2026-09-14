import type { ISubCategory } from "@/shared/interfaces";
import UpdateSubcategoryEntry from "./UpdateSubcategoryEntry";

interface IProps {
  subcategories: ISubCategory[];
}

const EditSubcategoryForm = ({ subcategories }: IProps) => {
  const renderSubcategories = subcategories.map((subcategory) => {
    return (
      <div className="flex gap-5" key={subcategory._id}>
        <UpdateSubcategoryEntry subcategory={subcategory} />
      </div>
    );
  });
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-4xl font-semibold">Subtopics</h1>
      <div className="flex flex-col gap-5">{renderSubcategories}</div>
    </div>
  );
};

export default EditSubcategoryForm;
