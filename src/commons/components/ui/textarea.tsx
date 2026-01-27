import { cn } from "@/commons/libs/cn";
import * as React from "react";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Premium "Glass" Aesthetic (Matching Input but lighter for Textarea)
          "flex min-h-[80px] w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-base text-white shadow-sm transition-all duration-300",
          "placeholder:text-white/30",
          "hover:border-white/20 hover:bg-white/10",
          "focus-visible:outline-none focus-visible:border-transparent focus-visible:bg-transparent focus-visible:ring-0", // Zen Mode focus
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
