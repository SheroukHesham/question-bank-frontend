import type { TQuestionDifficulty } from "@/shared/types";
import { Field, FieldLabel } from "@/ui/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/ui/components/ui/select";
import type { TQuestionTypeFilter } from "@/ui/types";

import type { ReactNode } from "react";

interface IProps {
  label?: string;
  placeholder?: string;
  children: ReactNode;
  value?: string | TQuestionDifficulty;
  onValueChange: (
    value: string | TQuestionTypeFilter | TQuestionDifficulty,
  ) => void;
  defaultValue?: string;
}

export function SingleSelect({
  label,
  placeholder,
  children,
  value,
  onValueChange,
  defaultValue,
}: IProps) {
  return (
    <Field className="w-full max-w-3xs gap-2 ">
      {label && (
        <FieldLabel>
          {label}
          <span className="text-destructive font-bold">*</span>
        </FieldLabel>
      )}
      <Select
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        value={value}
      >
        <div className="w-70 ">
          <SelectTrigger className="cursor-pointer bg-white">
            <SelectValue
              placeholder={
                placeholder ? placeholder : `Choose ${label?.toLowerCase()}`
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>{children}</SelectGroup>
          </SelectContent>
        </div>
      </Select>
    </Field>
  );
}
