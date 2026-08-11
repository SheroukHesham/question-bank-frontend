import { Modal } from "./Modal";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  categorySchema,
  type CategoryFormValues,
  type SubcategoryFormValues,
} from "@/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { MultipleSelect } from "./MultipleSelect";
import { MOCK_SUB_CATEGORIES } from "@/mock";
import { findSubCategoryByName } from "@/functions";
import { Button } from "./ui/button";
import { useState } from "react";
import SubcategoryAddForm from "./SubcategoryAddForm";

//TODO: add difficulty and API calls

const CategoryForm = () => {
  const [items, setItems] = useState<string[]>([]);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const {
    setValue,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: yupResolver(categorySchema),
  });

  const subcategoryList = MOCK_SUB_CATEGORIES.map((subcategory) => {
    return subcategory.name;
  });

  const onSubcategorySave = (data: SubcategoryFormValues) => {
    //TODO: await api call to add subcategory
    setItems((prev) => [...prev, data.name]);
    setValue("subCategories", items);
    setIsAddingSubcategory(false);
  };

  const onSubcategoryCancel = () => {
    setIsAddingSubcategory(false);
  };

  const onSubmit = (data: CategoryFormValues) => {
    const subcategories = data.subCategories.map((item) =>
      findSubCategoryByName(item as string),
    );
    const payload: CategoryFormValues = {
      name: data.name,
      subCategories: subcategories,
    };
    console.log(payload);
    // TODO: API call with payload
  };

  return (
    <Modal
      size="sm"
      title="Create New Category"
      triggerText="Create New Category"
      triggerIcon={<Plus />}
      onSubmit={handleSubmit(onSubmit)}
      onCancel={() => {
        setItems([]);
        reset();
        onSubcategoryCancel();
      }}
    >
      <div className="w-full flex gap-5 flex-col overflow-scroll ">
        <div className="flex flex-col gap-5 w-full ">
          <div className="flex flex-col  min-w-sm gap-2">
            <Label className="text-lg font-semibold">Category Name</Label>
            <Input {...register("name")} placeholder="Enter category name" />

            {errors.name && (
              <p className="text-destructive text-sm font-semibold">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="flex flex-col  min-w-sm gap-2 scrollbar-primary/10">
            <Label className="text-lg font-semibold">
              Assign Subcategories
            </Label>
            {isAddingSubcategory ? (
              <SubcategoryAddForm
                onSaved={onSubcategorySave}
                onCancel={onSubcategoryCancel}
              />
            ) : (
              <div className="flex gap-5">
                <MultipleSelect
                  setValue={setValue}
                  list={subcategoryList}
                  items={items}
                  setItems={setItems}
                />
                <Button
                  variant={"outline"}
                  type="button"
                  onClick={() => setIsAddingSubcategory(true)}
                >
                  Add New Subcategory
                </Button>
              </div>
            )}
            {errors.subCategories && (
              <p className="text-destructive text-sm font-semibold">
                {errors.subCategories.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CategoryForm;
