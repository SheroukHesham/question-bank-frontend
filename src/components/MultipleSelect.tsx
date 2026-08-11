"use client";

import * as React from "react";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { useModalContext } from "@/context/ModalContext";
import type { UseFormSetValue } from "react-hook-form";
import type { CategoryFormValues } from "@/validation";

interface IProps {
  list: string[];
  items: string[];
  setItems: React.Dispatch<React.SetStateAction<string[]>>;
  setValue: UseFormSetValue<CategoryFormValues>;
}

export function MultipleSelect({ list, setValue, items, setItems }: IProps) {
  const { dialogContentRef } = useModalContext();
  const anchor = useComboboxAnchor();

  const handleChange = (v: string[]) => {
    setItems(v);
    setValue("subCategories", v);
  };

  return (
    <Combobox
      multiple
      autoHighlight
      items={list}
      value={items}
      onValueChange={handleChange}
    >
      <ComboboxChips ref={anchor} className="w-full ">
        <ComboboxValue>
          {(values) => (
            <React.Fragment>
              {values.map((value: string) => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))}
              <ComboboxChipsInput />
            </React.Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor} container={dialogContentRef}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
