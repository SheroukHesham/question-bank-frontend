import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ReactNode } from "react";

interface IProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClick: () => void;
}

export function ClickCard({
  title,
  description,
  children,
  footer,
  onClick,
}: IProps) {
  return (
    <Card
      size="default"
      className="mx-auto w-full cursor-pointer p-5 gap-5 justify-around min-h-64"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-full flex flex-col justify-around">
        {children}
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
