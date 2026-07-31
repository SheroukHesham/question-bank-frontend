import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "./ui/card";

interface IProps {
  header: string;
  difficulty: number;
  children: ReactNode;
  mark: number;
}

const QuestionDetailsCard = ({
  children,
  difficulty,
  header,
  mark,
}: IProps) => {
  return (
    <Card>
      <CardHeader className="text-lg text-black font-semibold">
        <div className="flex flex-col">
          <span className="font-bold">Question: </span>
          <span>{header}</span>
        </div>
      </CardHeader>
      <CardDescription className="px-5 text-[16px]">
        <span className="text-destructive font-semibold">Difficulty: </span>
        <span className="text-destructive font-bold">{difficulty}</span>
      </CardDescription>
      <CardContent className="text-black">{children}</CardContent>
      <CardFooter className="border-t-0 flex justify-end">
        <div className="flex gap-1 text-black">
          <span className="font-semibold">Marks:</span>
          <span className="font-bold">{`[${mark}]`}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default QuestionDetailsCard;
