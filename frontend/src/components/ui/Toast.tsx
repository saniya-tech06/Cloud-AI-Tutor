import { CheckCircle, XCircle, Info } from "lucide-react";

type ToastProps = {
  type: "success" | "error" | "info";
  message: string;
};

function Toast({ type, message }: ToastProps) {
  const icon =
    type === "success" ? (
      <CheckCircle className="text-green-400" size={22} />
    ) : type === "error" ? (
      <XCircle className="text-red-400" size={22} />
    ) : (
      <Info className="text-blue-400" size={22} />
    );

  const border =
    type === "success"
      ? "border-green-500"
      : type === "error"
      ? "border-red-500"
      : "border-blue-500";

  return (
    <div
      className={`fixed top-6 right-6 z-50 bg-slate-900 border ${border} rounded-xl px-5 py-4 shadow-xl flex items-center gap-3`}
    >
      {icon}

      <p className="text-white font-medium">
        {message}
      </p>
    </div>
  );
}

export default Toast;