import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 px-4 py-2";
    const variants = {
      default: "bg-[#C8102E] text-white hover:bg-[#E8152F]",
      outline:
        "border border-[#253044] bg-transparent text-[#CBD8E8] hover:bg-[#141C26]",
      ghost: "bg-transparent text-[#7A8FA8] hover:text-white hover:bg-[#1A2436]",
    };
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
export { Button };
