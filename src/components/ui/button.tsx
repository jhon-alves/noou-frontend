import * as React from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 cursor-pointer disabled:cursor-not-allowed whitespace-nowrap disabled:text-gray-400 disabled:dark:text-gray-800 disabled:bg-gray-200 disabled:dark:bg-gray-400/60 disabled:opacity-100",
  {
    variants: {
      variant: {
        default: "bg-[#111827] dark:bg-white text-white dark:text-[#111827] hover:opacity-90",
        filled: "bg-neutral-100 dark:bg-neutral-500 text-neutral-800 dark:text-white hover:opacity-90 [&_svg]:text-neutral-800 [&_svg]:dark:text-white",
        tonal: "bg-tonal text-white border-none hover:bg-[#475569] active:bg-[#1e293b] dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:active:bg-gray-800",
        outline: "bg-transparent hover:bg-[#f0f1f3] dark:hover:bg-[#1c1f29] text-black dark:text-white border border-gray-600 dark:border-[#9ca3af]/20",
        text: "bg-transparent border-none text-[#111827] dark:text-white hover:opacity-70 disabled:opacity-50",
        icon: "text-[#111827] dark:text-white hover:bg-white dark:hover:bg-[#181f2f] p-2",
        primary: "bg-brand-primary-200 text-neutral-50 hover:opacity-90 [&_svg]:text-white",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "dark:text-white/60 text-[#111827]/60 hover:dark:text-white hover:text-[#111827]",
        link: "text-primary underline-offset-4 hover:underline",
        disabled: "bg-disabled text-disabled-foreground",
      },
      size: {
        xs: "px-4 py-2 text-[13px] h-8 [&_svg]:size-4 gap-2.5",
        sm: "px-3 py-1.5 text-xs",
        md: "px-6 py-3 text-[16px] h-12",
        lg: "px-6 py-3 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  isLoading = false,
  children,
  disabled,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    isLoading?: boolean
  }) {
    const Comp = asChild ? Slot : "button";
    const { t } = useTranslation();

    return (
      <Comp
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isLoading || disabled || variant === 'disabled'}
        {...props}
      >
        {isLoading && <Loader2 className="animate-spin" />}
        {isLoading ? (
          <span className="opacity-70 select-none">{t('common.loading')}</span>
        ) : (
          children
        )}
      </Comp>
    )
  }

export { Button, buttonVariants };
