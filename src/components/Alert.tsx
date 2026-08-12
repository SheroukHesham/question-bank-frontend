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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

interface IProps {
  buttonChildren: ReactNode;
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
  onSubmit: () => void;
  onCancel?: () => void;
}

export function Alert({
  buttonChildren,
  buttonSize = "default",
  description,
  onCancel,
  onSubmit,
  submitText,
  title,
  variant,
  icon,
}: IProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={variant} size={buttonSize}>
          {buttonChildren}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="default">
        <AlertDialogHeader>
          {icon && (
            <AlertDialogMedia
              className={`${variant === "destructive" ? "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive" : "bg-background/10 text-foreground dark:bg-background/20 dark:text-foreground"}`}
            >
              {icon}
            </AlertDialogMedia>
          )}
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            variant="outline"
            onClick={() => onCancel && onCancel()}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction variant={variant} onClick={() => onSubmit()}>
            {submitText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
