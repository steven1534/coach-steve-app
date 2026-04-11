import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface Toast {
  id: number;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

interface ToastContextValue {
  toast: (t: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-lg border px-4 py-3 shadow-lg animate-in fade-in-0 ${
              t.variant === "destructive"
                ? "bg-red-900/90 border-red-700 text-white"
                : "bg-[#1A2436] border-[#253044] text-white"
            }`}
            style={{ animation: "fadeIn 0.2s ease-out" }}
          >
            <div className="font-semibold text-sm">{t.title}</div>
            {t.description && (
              <div className="text-xs mt-1 opacity-80">{t.description}</div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function Toaster() {
  return null;
}
