import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border bg-[#141C26] border-[#253044] px-3 py-2 text-sm text-white placeholder:text-[#3D5068] focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/20 focus:outline-none transition-colors",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
export { Input };
