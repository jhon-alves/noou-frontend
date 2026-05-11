import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, value, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "text-[#2d2d38] dark:text-white",
        "flex min-h-20 w-full rounded-xl border border-[#9ca3af]/20 bg-background px-3 py-2 text-base md:text-sm",
        "placeholder-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 outline-none scrollbar",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
