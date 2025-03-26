import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default: "",
        primary:
          "border-2 border-gray-300 focus:border-amber-300 dark:border-amber-900 dark:hover:border-amber-800 border md:text-lg placeholder:text-lg font-semibold",
      },
      inputSize: {
        default: "",
        lg: "h-12 px-4 md:text-lg placeholder:text-lg h-auto font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
);

function Input({
  className,
  type,
  variant,
  inputSize: size,
  ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, inputSize: size, className }))}
      {...props}
    />
  );
}

export { Input };
