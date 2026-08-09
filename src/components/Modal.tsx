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
import type { ReactElement, ReactNode } from "react";
import { FieldGroup } from "./ui/field";

interface IProps {
  triggerText: string;
  triggerIcon?: ReactElement;
  title: string;
  description?: string;
  children: ReactNode;
  saveButton?: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export function Modal({
  triggerIcon,
  title,
  triggerText,
  children,
  description,
  onSubmit,
  saveButton = true,
}: IProps) {
  return (
    <Dialog>
      <form onSubmit={onSubmit}>
        <DialogTrigger asChild>
          <Button variant="secondary">
            {triggerIcon}
            {triggerText}
          </Button>
        </DialogTrigger>
        <DialogContent
          className="max-h-80vh overflow-scroll"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
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
