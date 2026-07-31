import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type ReactNode } from "react";

interface IProps {
  title?: string;
  children: ReactNode;
  isError: boolean;
  errorMsg: string;
  value?: string;
  onChange: (v: string) => void;
}

export function Selector({
  children,
  title,
  errorMsg,
  isError,
  value,
  onChange,
}: IProps) {
  return (
    <Field data-invalid={isError} className="w-full max-w-48">
      <div className="flex  gap-x-3">
        {title && (
          <FieldLabel className="capitalize text-lg font-bold">
            {title}
          </FieldLabel>
        )}
        <Select value={value} onValueChange={(v) => onChange(v)}>
          <SelectTrigger aria-invalid={isError}>
            <SelectValue placeholder={`Select one of the following`} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>{children}</SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {isError && <FieldError>{errorMsg}</FieldError>}
    </Field>
  );
}
