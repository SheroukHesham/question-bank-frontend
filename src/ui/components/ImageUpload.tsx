import { useRef } from "react";
import { Input } from "./ui/input";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface IProps {
  onFileSelected: (file: File) => void;
  onClear: () => void;
  previewURL?: string | null;
}

export default function ImageUpload({
  onFileSelected,
  onClear,
  previewURL,
}: IProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileSelected(file);
  };

  const handleDelete = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onClear();
  };

  return (
    <div className="flex gap-5 items-center justify-between">
      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="h-22 text-muted max-w-sm"
        onChange={handleChange}
      />
      {previewURL && (
        <div className="flex gap-5 w-auto items-center">
          <img
            src={previewURL}
            alt="Header preview"
            className="rounded-md min-w-sm max-w-lg object-contain h-fit max-h-52 shadow-lg"
          />
          <div className="">
            <Button
              variant="destructive"
              size="icon-lg"
              type="button"
              onClick={handleDelete}
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
