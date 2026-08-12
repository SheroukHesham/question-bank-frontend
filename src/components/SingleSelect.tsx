import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TQuestionTypeFilter } from "@/types";

import type { ReactNode } from "react";

interface IProps {
  label?: string;
  placeholder?: string;
  children: ReactNode;
  onValueChange: (value: string | TQuestionTypeFilter) => void;
  defaultValue?: string;
}

export function SingleSelect({
  label,
  placeholder,
  children,
  onValueChange,
  defaultValue,
}: IProps) {
  return (
    <Field className="w-full max-w-3xs gap-2 ">
      {label && <FieldLabel>{label}</FieldLabel>}
      <Select defaultValue={defaultValue} onValueChange={onValueChange}>
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
