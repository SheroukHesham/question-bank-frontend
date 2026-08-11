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
import { useRef, type ReactElement, type ReactNode } from "react";
import { FieldGroup } from "./ui/field";
import { ModalProvider } from "@/context/ModalContext";

interface IProps {
  size?: "default" | "sm";
  triggerText: string;
  triggerIcon?: ReactElement;
  title: string;
  description?: string;
  children: ReactNode;
  saveButton?: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onCancel?: () => void;
}

export function Modal({
  size = "default",
  triggerIcon,
  title,
  triggerText,
  children,
  description,
  onSubmit,
  saveButton = true,
  onCancel,
}: IProps) {
  const dialogContentRef = useRef<HTMLDivElement>(null);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          {triggerIcon}
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent
        ref={dialogContentRef}
        className={`overflow-scroll ${size === "sm" ? "max-w-5xl" : ""}`}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <ModalProvider dialogContentRef={dialogContentRef}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <DialogHeader className="mb-5">
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </DialogHeader>
            <FieldGroup>{children}</FieldGroup>
            <DialogFooter className=" mt-15">
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    if (onCancel) onCancel();
                  }}
                >
                  Cancel
                </Button>
              </DialogClose>
              {saveButton && <Button type="submit">Save</Button>}
            </DialogFooter>
          </form>
        </ModalProvider>
      </DialogContent>
    </Dialog>
  );
}
