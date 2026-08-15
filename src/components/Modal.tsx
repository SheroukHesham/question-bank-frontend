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
  triggerText: string | null;
  triggerIcon?: ReactElement;
  title: string;
  description?: string;
  children: ReactNode;
  saveButton?: boolean;
  onSubmit?: (e?: React.BaseSyntheticEvent) => Promise<void> | void;
  onCancel?: () => void;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
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
  open,
  onClose,
  onOpenChange,
}: IProps) {
  const dialogContentRef = useRef<HTMLDivElement>(null);
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (onOpenChange) onOpenChange(open);
        if (!open && onClose) {
          onClose();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={triggerText ? "secondary" : "outline"}
          size={triggerText ? "default" : "icon"}
        >
          {triggerIcon}
          {triggerText !== null && triggerText}
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
              if (onSubmit) onSubmit();
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
