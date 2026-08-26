import { useRef, useState } from "react";
import { Input } from "./ui/input";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface IProps {
  onFileSelected: (file: File) => void;
  onClear: () => void;
  image?: string;
}

export default function ImageUpload({
  onFileSelected,
  onClear,
  image,
}: IProps) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [cleared, setCleared] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Derived, not synced: a locally picked file always wins; otherwise fall back
  // to the existing image, unless the user explicitly cleared it.
  const preview = localPreview ?? (cleared ? null : (image ?? null));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setCleared(false);
    onFileSelected(file);
  };

  const handleDelete = () => {
    setLocalPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setCleared(true);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onClear();
  };

  return (
    <div className="flex gap-5 items-center">
      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="h-22 text-muted w-xl"
        onChange={handleChange}
      />
      {preview ? (
        <div className="flex flex-col gap-y-2">
          <img
            src={preview}
            alt="Header preview"
            className="h-52 w-auto rounded-md object-cover"
          />
          <div className="flex justify-end">
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
      ) : (
        <div className="size-52 flex items-center justify-center text-muted/50 border rounded-md bg-white">
          No image selected
        </div>
      )}
    </div>
  );
}
