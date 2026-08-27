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
} from "@/ui/components/ui/combobox";
import { UseModalContext } from "@/ui/context/ModalContext";
import type { UseFormSetValue } from "react-hook-form";
import type { CategoryFormValues } from "@/ui/validation";

interface IProps {
  list?: string[];
  items: string[];
  setItems: React.Dispatch<React.SetStateAction<string[]>>;
  setValue: UseFormSetValue<CategoryFormValues>;
  hideOnEmpty?: boolean;
}

export function MultipleSelect({
  list,
  // setValue,
  items,
  setItems,
  hideOnEmpty = false,
}: IProps) {
  const { dialogContentRef } = UseModalContext();
  const anchor = useComboboxAnchor();

  const handleChange = (v: string[]) => {
    setItems(v);
    // setValue("subCategories", v);
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
      {list && (
        <ComboboxContent anchor={anchor} container={dialogContentRef}>
          {!hideOnEmpty && <ComboboxEmpty>No items found.</ComboboxEmpty>}
          {
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          }
        </ComboboxContent>
      )}
    </Combobox>
  );
}
