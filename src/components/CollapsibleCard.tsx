import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon } from "lucide-react";
import type { ReactNode } from "react";

interface IProps {
  title: string;
  children: ReactNode;
}

export function CollapsibleCard({ title, children }: IProps) {
  return (
    <Card className="mx-auto w-full">
      <CardContent>
        <Collapsible className="rounded-md data-[state=open]:bg-muted  ">
          <CollapsibleTrigger asChild className="cursor-pointer border">
            <Button variant="ghost" className="group w-full  ">
              <div className="flex flex-col w-full gap-y-2">
                <div className="flex items-center justify-between w-full text-xl capitalize">
                  {title}
                  <ChevronDownIcon className="ml-auto scale-125 group-data-[state=open]:rotate-180" />
                </div>
                {/* <span className="flex w-full text-md text-gray-700">
                  description
                </span> */}
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm mt-8">
            {children}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
