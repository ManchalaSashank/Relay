import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

type AlertType = "error" | "success" | "info";

export default function AlertBox({
  type = "info",
  message,
}: {
  type?: AlertType;
  message: string;
}) {
  // --- Color and icon mapping based on alert type ---
  const colorMap = {
    error: "border-red-500 bg-red-900/20 text-red-400",
    success: "border-green-500 bg-green-900/20 text-green-400",
    info: "border-blue-500 bg-blue-900/20 text-blue-300",
  };

  const Icon = {
    error: AlertTriangle,
    success: CheckCircle2,
    info: Info,
  }[type];

  return (
    <div
      className={cn(
        "flex items-start gap-2 border p-3 text-sm rounded-md",
        colorMap[type]
      )}
    >
      <Icon className="w-5 h-5 mt-0.5 shrink-0" />
      <p className="leading-relaxed">{message}</p>
    </div>
  );
}
