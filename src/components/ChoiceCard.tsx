import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { IQuestions, IRadioGroupItem } from "@/interfaces";
import type { QuestionFormValues } from "@/validation";
import type { SetStateAction, Dispatch } from "react";
import type { FieldErrors, UseFormSetValue } from "react-hook-form";

interface IProps {
  radioItems: IRadioGroupItem[];
  defaultValue: string;
  setValue?: UseFormSetValue<QuestionFormValues>;
  errors?: FieldErrors<QuestionFormValues>;
  questionToEdit?: IQuestions;
  setQuestionToEdit?: Dispatch<SetStateAction<IQuestions>>;
}

export function RadioGroupChoiceCard({
  defaultValue,
  radioItems,
  questionToEdit,
  setQuestionToEdit,
  setValue,
}: IProps) {
  return (
    <RadioGroup
      defaultValue={defaultValue}
      value={setValue ? undefined : questionToEdit?.type}
      onValueChange={(value: "mcq" | "essay") => {
        if (setValue) setValue("type", value, { shouldValidate: true });
        if (setQuestionToEdit)
          setQuestionToEdit((prev) => ({
            ...prev,
            type: value,
          }));
      }}
      className="grid grid-cols-2 max-w-lg gap-7 "
    >
      {radioItems.map((item) => {
        const Icon = item.icon;
        return (
          <FieldLabel
            htmlFor={item.id}
            className="border-2 border-popover-border  shadow cursor-pointer bg-white"
            key={item.id}
          >
            <Field orientation="horizontal" className="border-gray-300  ">
              <FieldContent className="flex items-center justify-center mt-3 ">
                {Icon && (
                  <div className=" size-15  flex items-center justify-center ">
                    <Icon size={55} />
                  </div>
                )}
                <FieldTitle>{item.title}</FieldTitle>
                <FieldDescription>{item.description}</FieldDescription>
              </FieldContent>
              <RadioGroupItem value={item.value} id={item.id} />
            </Field>
          </FieldLabel>
        );
      })}
    </RadioGroup>
  );
}
