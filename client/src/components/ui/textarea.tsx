import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex w-full rounded-md border bg-[#141C26] border-[#253044] px-3 py-2 text-sm text-white placeholder:text-[#3D5068] focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/20 focus:outline-none transition-colors resize-none min-h-[80px]",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
export { Textarea };
