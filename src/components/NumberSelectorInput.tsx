import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from "@/components/reui/number-field";
import type { IQuestions } from "@/interfaces";
import type { QuestionFormValues } from "@/validation";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { FieldErrors, UseFormSetValue } from "react-hook-form";

interface IProps {
  setValue?: UseFormSetValue<QuestionFormValues>;
  errors?: FieldErrors<QuestionFormValues>;
  label: string;
  name: keyof IQuestions;
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
  questionToEdit?: IQuestions;
  setQuestionToEdit?: Dispatch<SetStateAction<IQuestions>>;
}

export function NumberSelectorInput({
  label,
  maxValue = 100,
  minValue = 1,
  questionToEdit,
  setQuestionToEdit,
  name,
  setValue,
  defaultValue,
}: IProps) {
  return (
    <div className="w-full max-w-48">
      <NumberField
        defaultValue={defaultValue}
        value={setValue ? undefined : questionToEdit?.mark}
        onValueChange={(value) => {
          if (setValue)
            setValue("mark", Number(value), { shouldValidate: true });
          if (setQuestionToEdit)
            setQuestionToEdit((prev) => ({
              ...prev,
              mark: Number(value),
            }));
        }}
        min={minValue}
        max={maxValue}
      >
        <div className="flex gap-2 text-black">
          <NumberFieldScrubArea label={label} className={"font-s"} />
          <NumberFieldGroup>
            {setValue ? (
              <NumberFieldInput className="text-start font-semibold " />
            ) : (
              <NumberFieldInput
                name={name}
                value={questionToEdit?.mark}
                className="text-start font-semibold "
              />
            )}

            <div className="border-input bg-muted/30 rounded-lg m-px flex shrink-0 flex-col overflow-hidden border">
              <NumberFieldIncrement className="border-input hover:bg-accent focus-visible:bg-accent flex h-3.5 w-full flex-1 shrink-0 items-center rounded-none! border-b px-1.5 leading-none">
                <ChevronUpIcon className="size-3.5" />
              </NumberFieldIncrement>
              <NumberFieldDecrement className="hover:bg-accent focus-visible:bg-accent flex h-3.5 w-full flex-1 shrink-0 items-center rounded-none! px-1.5 leading-none">
                <ChevronDownIcon className="size-3.5" />
              </NumberFieldDecrement>
            </div>
          </NumberFieldGroup>
        </div>
      </NumberField>
    </div>
  );
}
