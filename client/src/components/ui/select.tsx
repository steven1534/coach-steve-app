import { useState, useRef, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  children: ReactNode;
  "data-testid"?: string;
}

interface SelectItemProps {
  value: string;
  children: ReactNode;
}

export function Select({
  value,
  onValueChange,
  placeholder = "Select...",
  className,
  children,
  ...rest
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const items: SelectItemProps[] = [];
  const extractItems = (node: ReactNode) => {
    if (!node) return;
    if (Array.isArray(node)) {
      node.forEach(extractItems);
      return;
    }
    if (typeof node === "object" && "props" in (node as any)) {
      const props = (node as any).props;
      if (props?.value !== undefined) {
        items.push({ value: props.value, children: props.children });
      }
    }
  };
  extractItems(children);

  const selected = items.find((i) => i.value === value);

  return (
    <div ref={ref} className="relative" data-testid={rest["data-testid"]}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border bg-[#141C26] border-[#253044] px-3 py-2 text-sm text-white focus:border-[#C8102E] focus:outline-none transition-colors",
          className
        )}
      >
        <span className={selected ? "text-white" : "text-[#3D5068]"}>
          {selected ? selected.children : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-[#253044] bg-[#1A2436] shadow-lg">
          {items.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                onValueChange(item.value);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center px-3 py-2 text-sm hover:bg-[#253044] transition-colors text-left",
                item.value === value
                  ? "text-white bg-[#253044]/50"
                  : "text-[#CBD8E8]"
              )}
            >
              {item.children}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function SelectItem({ children }: SelectItemProps) {
  return <>{children}</>;
}
