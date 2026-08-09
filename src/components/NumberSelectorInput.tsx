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
import type { UseFormSetValue } from "react-hook-form";

interface IProps {
  label: string;
  name: keyof IQuestions;
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
  setValue?: UseFormSetValue<QuestionFormValues>;
  questionToEdit?: IQuestions;
  setQuestionToEdit?: Dispatch<SetStateAction<IQuestions>>;
}

export function NumberSelectorInput({
  label,
  maxValue = 100,
  minValue = 1,
  questionToEdit,
  setQuestionToEdit,
  setValue,
  name,
  defaultValue,
}: IProps) {
  return (
    <div className="w-full max-w-3xs ">
      <NumberField
        size={"lg"}
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
        <div className="  flex flex-col gap-2 ">
          <NumberFieldScrubArea label={label} className={"font-s"} />
          <NumberFieldGroup>
            {setValue ? (
              <NumberFieldInput className="text-start font-semibold py-5" />
            ) : (
              <NumberFieldInput
                name={name}
                value={questionToEdit?.mark}
                className="text-start font-semibold "
              />
            )}

            <div className=" rounded-lg m-px flex shrink-0 flex-col overflow-hidden ">
              <NumberFieldIncrement className="border-input hover:bg-muted/10 focus-visible:bg-muted/10 flex h-3.5 w-full flex-1 shrink-0 items-center rounded-none!  px-1.5 leading-none">
                <ChevronUpIcon className="size-3.5" />
              </NumberFieldIncrement>
              <NumberFieldDecrement className="hover:bg-muted/10 focus-visible:bg-muted/10 flex h-3.5 w-full flex-1 shrink-0 items-center rounded-none! px-1.5 leading-none">
                <ChevronDownIcon className="size-3.5" />
              </NumberFieldDecrement>
            </div>
          </NumberFieldGroup>
        </div>
      </NumberField>
    </div>
  );
}
