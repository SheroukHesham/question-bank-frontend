import { type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/ui/lib/utils";
import { badgeVariants } from "./badgeVariants";

interface BadgeProps
  extends React.ComponentProps<"span">, VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

function Badge({
  className,
  variant,
  size,
  radius,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size, radius, className }))}
      {...props}
    />
  );
}

export { Badge, type BadgeProps };
