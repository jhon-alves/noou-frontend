import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, value, type, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        <input
          type={type}
          value={value}
          className={cn(
            value ? "text-[#2d2d38] dark:text-white" : "text-[#9ca3af]",
            "flex h-12 w-full border border-[#9ca3af]/20 bg-background px-3 py-2 text-base md:text-sm rounded-full",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "file:text-foreground placeholder-[#9ca3af] outline-none",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
