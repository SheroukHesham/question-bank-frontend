"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "@/ui/lib/utils";
import type { FieldErrors, UseFormSetValue } from "react-hook-form";
import type { QuestionFormValues } from "@/ui/validation";
import type { IChoice } from "@/ui/interfaces";

interface IProps {
  itemList?: IChoice[];
  setValue: UseFormSetValue<QuestionFormValues>;
  errors?: FieldErrors<QuestionFormValues>;
}

const EMPTY_OPTION_COUNT = 5;
const toOrderedValues = (list?: IChoice[]): string[] => {
  const source =
    list && list.length > 0
      ? list
      : Array.from({ length: EMPTY_OPTION_COUNT }, () => ({
          choice: "",
          isCorrect: false,
        }));

  const correctIdx = source.findIndex((item) => item.isCorrect);
  if (correctIdx <= 0) {
    return source.map((item) => item.choice);
  }
  const reordered = [...source];
  const [correct] = reordered.splice(correctIdx, 1);
  reordered.unshift(correct);
  return reordered.map((item) => item.choice);
};

export function ChoicesInput({ itemList, setValue, errors }: IProps) {
  const [values, setValues] = useState<string[]>(() =>
    toOrderedValues(itemList),
  );

  const syncForm = (next: string[]) => {
    setValue(
      "choices",
      next.map((choice, idx) => ({ choice, isCorrect: idx === 0 })),
      { shouldValidate: true },
    );
  };

  const handleTextChange = (idx: number, newValue: string) => {
    setValues((prev) => {
      const updated = prev.map((v, i) => (i === idx ? newValue : v));
      syncForm(updated);
      return updated;
    });
  };

  return (
    <div className="mx-auto w-full space-y-3">
      {values.map((value, idx) => {
        const isKey = idx === 0;
        return (
          <div className="flex flex-col gap-1" key={idx}>
            <div
              key={idx}
              className={cn(
                "rounded-md flex items-center gap-3 p-3 border transition-colors",
                isKey
                  ? "border-primary/40 bg-primary/5"
                  : "border-border bg-transparent",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center size-8 rounded-full shrink-0",
                  isKey
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-white",
                )}
              >
                {isKey ? (
                  <KeyRound className="size-4" />
                ) : (
                  <span className="text-sm font-semibold">{idx}</span>
                )}
              </div>

              <div className="min-w-0 flex-1 flex items-center gap-3">
                <Input
                  value={value}
                  placeholder={
                    isKey
                      ? "Enter the correct answer"
                      : `Enter distractor ${idx}`
                  }
                  aria-label={isKey ? "Correct answer" : `Distractor ${idx}`}
                  onChange={(e) => handleTextChange(idx, e.target.value)}
                />
                <Label
                  className={cn(
                    "shrink-0 font-semibold text-sm capitalize",
                    isKey ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {isKey ? "Key" : "Distractor"}
                </Label>
              </div>
            </div>
            {errors?.choices?.[idx] && (
              <p className="text-destructive text-sm font-semibold">
                {errors?.choices?.[idx]?.choice?.message}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
