import { Button } from "@/ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/components/ui/dialog";
import {
  useRef,
  type Dispatch,
  type ReactElement,
  type ReactNode,
  type SetStateAction,
} from "react";
import { FieldGroup } from "./ui/field";
import { ModalProvider } from "@/ui/context/ModalContext";

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
  setOpen?: Dispatch<SetStateAction<boolean>>;
  onOpenChange?: (open: boolean) => void;
  buttonVariant?:
    | "secondary"
    | "link"
    | "default"
    | "outline"
    | "ghost"
    | "destructive"
    | null
    | undefined;
  showCloseButton?: boolean;
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
  setOpen,
  onClose,
  onOpenChange,
  buttonVariant,
  showCloseButton,
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
          variant={
            buttonVariant
              ? buttonVariant
              : triggerText
                ? "secondary"
                : "outline"
          }
          size={triggerText ? "default" : "icon"}
          onClick={() => {
            if (setOpen) setOpen(true);
          }}
        >
          {triggerIcon}
          {triggerText !== null && triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent
        setOpen={setOpen}
        showCloseButton={showCloseButton}
        ref={dialogContentRef}
        className={`overflow-auto ${size === "sm" ? "max-w-5xl" : ""}`}
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
            <DialogFooter className=" mt-15 pb-2">
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    if (onCancel) onCancel();
                    if (setOpen) setOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </DialogClose>
              {saveButton && (
                <Button
                  type="button"
                  onClick={() => {
                    if (onSubmit) onSubmit();
                  }}
                >
                  Save
                </Button>
              )}
            </DialogFooter>
          </form>
        </ModalProvider>
      </DialogContent>
    </Dialog>
  );
}
