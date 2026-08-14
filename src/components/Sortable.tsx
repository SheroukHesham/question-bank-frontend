"use client";

import { useState } from "react";
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "@/components/reui/sortable";
import { GripVerticalIcon } from "lucide-react";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import type { UseFormSetValue } from "react-hook-form";
import type { QuestionFormValues } from "@/validation";
import type { IChoice } from "@/interfaces";

interface SortableOption {
  id: string;
  value: string;
}

interface IProps {
  itemList?: IChoice[]; // now carries order + correctness, not just text
  setValue: UseFormSetValue<QuestionFormValues>;
}

const EMPTY_OPTION_COUNT = 5;

const toOptions = (list: IChoice[]): SortableOption[] =>
  list.map((item, idx) => ({
    id: `${idx}-${item.choice}-${crypto.randomUUID()}`,
    value: item.choice,
  }));

const buildInitialState = (list: IChoice[]) => {
  const options = toOptions(list);
  const correctIdx = list.findIndex((item) => item.isCorrect);
  return { options, correctId: correctIdx >= 0 ? options[correctIdx].id : "" };
};

export function SortableOPtions({ itemList, setValue }: IProps) {
  const [{ options: initialItems, correctId: initialCorrectId }] = useState(
    () =>
      buildInitialState(
        itemList ??
          Array.from({ length: EMPTY_OPTION_COUNT }, () => ({
            choice: "",
            isCorrect: false,
          })),
      ),
  );

  const [items, setItems] = useState<SortableOption[]>(initialItems);
  const [correctId, setCorrectId] = useState(initialCorrectId);

  const syncForm = (options: SortableOption[], correct: string) => {
    setValue(
      "choices",
      options.map((opt) => ({
        choice: opt.value,
        isCorrect: opt.id === correct,
      })),
      { shouldValidate: true },
    );
  };

  const handleValueChange = (newItems: SortableOption[]) => {
    setItems(newItems);
    syncForm(newItems, correctId); // order preserved directly — no reconstruction needed
  };

  const handleTextChange = (id: string, newValue: string) => {
    setItems((prev) => {
      const updated = prev.map((opt) =>
        opt.id === id ? { ...opt, value: newValue } : opt,
      );
      syncForm(updated, correctId);
      return updated;
    });
  };

  const handleCorrectChange = (id: string) => {
    setCorrectId(id);
    syncForm(items, id);
  };

  const getItemValue = (item: SortableOption) => item.id;

  return (
    <div className="mx-auto w-full space-y-8">
      <RadioGroup defaultValue={correctId} onValueChange={handleCorrectChange}>
        <Sortable
          value={items}
          onValueChange={handleValueChange}
          getItemValue={getItemValue}
          strategy="vertical"
          className="space-y-2 focus:ring-transparent focus:border-primary"
        >
          {items.map((item) => (
            <SortableItem key={item.id} value={item.id}>
              <div className="bg-transparent rounded-md flex cursor-pointer items-center gap-3 p-3">
                <SortableItemHandle className="text-gray-500 hover:text-foreground">
                  <GripVerticalIcon className="h-4 w-4" />
                </SortableItemHandle>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <Input
                      value={item.value}
                      onChange={(e) =>
                        handleTextChange(item.id, e.target.value)
                      }
                    />
                    <RadioGroupItem
                      className="cursor-pointer"
                      value={item.id}
                      id={item.id}
                    />
                    <Label htmlFor={item.id}>Correct</Label>
                  </div>
                </div>
              </div>
            </SortableItem>
          ))}
        </Sortable>
      </RadioGroup>
    </div>
  );
}
