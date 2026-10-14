import { TriangleAlert } from "lucide-react";

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
};

function ConfirmModal({
  isOpen,
  title,
  message,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">

      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-[420px]">

        <div className="flex justify-center">

          <TriangleAlert
            className="text-red-500"
            size={60}
          />

        </div>

        <h2 className="text-2xl font-bold text-center mt-5 text-white">
          {title}
        </h2>

        <p className="text-slate-400 text-center mt-3">
          {message}
        </p>

        <div className="flex justify-center gap-4 mt-8">

          <button
            onClick={onCancel}
            className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}

export default ConfirmModal;