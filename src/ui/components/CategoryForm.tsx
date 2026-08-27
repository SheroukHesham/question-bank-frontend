import { Modal } from "./Modal";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  categorySchema,
  type CategoryFormValues,
  type SubcategoryFormValues,
} from "@/ui/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import SubcategoryAddForm from "./SubcategoryAddForm";
import { Badge } from "./reui/badge";

const CategoryForm = () => {
  const [items, setItems] = useState<string[]>([]);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: yupResolver(categorySchema),
  });

  const onSubcategorySave = (data: SubcategoryFormValues) => {
    //TODO: await api call to add subcategory
    setItems((prev) => [...prev, data.name]);
    setIsAddingSubcategory(false);
  };

  const onSubcategoryCancel = () => {
    setIsAddingSubcategory(false);
  };

  const onSubmit = (data: CategoryFormValues) => {
    if (items.length !== 0) {
      setValue("subCategories", items);
    }
    const payload = {
      name: data.name,
      subCategories: [...items],
    };
    console.log(payload);
    // TODO: API call with payload
  };

  const renderSubcategories = items.map((item, idx) => {
    return (
      <Badge key={idx} variant={"default"} size={"xl"} radius={"full"}>
        {item}
      </Badge>
    );
  });

  return (
    <Modal
      size="sm"
      title="Create New Topic"
      triggerText="Create New Topic"
      triggerIcon={<Plus />}
      onSubmit={handleSubmit(onSubmit)}
      onCancel={() => {
        setItems([]);
        reset();
        onSubcategoryCancel();
      }}
      onClose={() => {
        setItems([]);
        reset();
        onSubcategoryCancel();
      }}
    >
      <div className="w-full flex gap-5 flex-col overflow-scroll ">
        <div className="flex flex-col gap-5 w-full ">
          <div className="flex flex-col  min-w-sm gap-2">
            <Label className="text-lg font-semibold">Topic Name</Label>
            <Input {...register("name")} placeholder="Enter category name" />

            {errors.name && (
              <p className="text-destructive text-sm font-semibold">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="flex flex-col  min-w-sm gap-2 scrollbar-primary/10">
            <Label className="text-lg font-semibold">Assign Types</Label>
            <div className="flex gap-3 flex-wrap">{renderSubcategories}</div>

            {isAddingSubcategory ? (
              <SubcategoryAddForm
                onSaved={onSubcategorySave}
                onCancel={onSubcategoryCancel}
              />
            ) : (
              <div className="w-full flex">
                <div className="flex w-full justify-end gap-5">
                  <Button
                    variant={"outline"}
                    type="button"
                    onClick={() => setIsAddingSubcategory(true)}
                  >
                    Add New Type
                  </Button>
                </div>
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
