import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "./utils";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-9 w-full rounded-xl border px-3 text-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "border-gray-300 bg-gray-100",
        "dark:border-gray-700 dark:bg-gray-800/80 dark:placeholder:text-gray-400",
        className
      )}
      {...props}
    />
  );
});
