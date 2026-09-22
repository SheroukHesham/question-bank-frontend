import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { ReactNode } from "react";

interface IProps {
  onPrevious: () => void;
  onNext: () => void;
  children: ReactNode;
}

const PagePagination = ({ onNext, onPrevious, children }: IProps) => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => onPrevious()} />
        </PaginationItem>
        {children}
        <PaginationItem>
          <PaginationNext
            onClick={() => {
              onNext();
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PagePagination;
