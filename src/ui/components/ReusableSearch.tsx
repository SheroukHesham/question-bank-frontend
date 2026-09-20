import { Search } from "lucide-react";
import { Input } from "./ui/input";
import type { Dispatch, SetStateAction } from "react";

interface IProps {
  placeholder?: string;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

const ReusableSearch = ({ placeholder, search, setSearch }: IProps) => {
  return (
    <div className="max-w-3xl flex items-center border-popover-border rounded-lg bg-white shadow-lg in-focus:shadow">
      <Input
        className="bg-transparent border-none shadow-none focus-visible:shadow-none"
        autoFocus={false!}
        placeholder={placeholder ?? "Search"}
        value={search}
        onChange={({ target }) => {
          setSearch(target.value);
        }}
      />
      <div className="pr-3">
        <Search color="gray" />
      </div>
    </div>
  );
};

export default ReusableSearch;
