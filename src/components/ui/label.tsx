import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  isRequired?: boolean;
}

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, children, isRequired, ...props }, ref) => {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        "text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1",
        className
      )}
      {...props}
    >
      {children}
      {isRequired && <span className="text-red-400">*</span>}
    </LabelPrimitive.Root>
  );
});

Label.displayName = "Label";
