import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "./utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-xl border px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "border-gray-300 bg-gray-100",
        "dark:border-gray-700 dark:bg-gray-800/80 dark:placeholder:text-gray-400",
        className
      )}
      {...props}
    />
  );
});
