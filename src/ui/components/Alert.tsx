import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/ui/components/ui/alert-dialog";
import { Button } from "@/ui/components/ui/button";
import type { ReactNode } from "react";

interface IProps {
  buttonChildren?: ReactNode;
  variant: "destructive" | "default";
  buttonSize?:
    | "default"
    | "icon"
    | "sm"
    | "xs"
    | "lg"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg";
  icon?: ReactNode;
  title: string;
  description: string;
  submitText: string;
  cancelText?: string;
  onSubmit: () => void;
  onCancel?: () => void;
  disabled?: boolean;
  open?: boolean;
  extraButton?: ReactNode;
}

export function Alert({
  buttonChildren,
  buttonSize = "default",
  description,
  onCancel,
  onSubmit: onSubmit,
  submitText,
  cancelText,
  title,
  variant,
  icon,
  disabled,
  open,
  extraButton,
}: IProps) {
  return (
    <AlertDialog open={open}>
      {buttonChildren && (
        <AlertDialogTrigger asChild>
          <Button
            variant={variant}
            size={buttonSize}
            disabled={disabled}
            type="button"
          >
            {buttonChildren}
          </Button>
        </AlertDialogTrigger>
      )}
      <AlertDialogContent size="default">
        <AlertDialogHeader>
          {icon && (
            <AlertDialogMedia
              className={`${variant === "destructive" ? "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive" : "bg-background/10 text-foreground dark:bg-background/20 dark:text-foreground"}`}
            >
              {icon}
            </AlertDialogMedia>
          )}
          <AlertDialogTitle className="text-center">{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            variant="outline"
            onClick={() => onCancel && onCancel()}
          >
            {cancelText ?? "Cancel"}
          </AlertDialogCancel>
          {extraButton}
          <AlertDialogAction variant={variant} onClick={() => onSubmit()}>
            {submitText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
