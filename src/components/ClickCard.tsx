import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface IProps {
  title: string;
  description: string;
  onClick: () => void;
}

export function ClickCard({ title, description, onClick }: IProps) {
  return (
    <div
      className="grid w-full max-w-md items-start gap-4 cursor-pointer"
      onClick={onClick}
    >
      <Alert className="px-5 py-16 flex flex-col gap-y-3 items-center justify-center border-dashed bg-card text-black font-semibold border-secondary ease-in-out duration-300 hover:scale-105">
        <AlertTitle className="text-2xl">{title}</AlertTitle>
        <AlertDescription className="text-lg text-gray-600">
          {description}
        </AlertDescription>
      </Alert>
    </div>
  );
}
