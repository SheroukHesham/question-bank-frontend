import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ReactNode } from "react";
import { FieldGroup } from "./ui/field";

interface IProps {
  triggerText: string;
  title: string;
  description?: string;
  children: ReactNode;
  saveButton?: boolean;
}

export function Modal({
  title,
  triggerText,
  children,
  description,
  saveButton = true,
}: IProps) {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="default">{triggerText}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <FieldGroup>{children}</FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            {saveButton && <Button type="submit">Save</Button>}
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
