import { Pencil } from "lucide-react";

type RenameModalProps = {
  isOpen: boolean;
  title: string;
  value: string;
  setValue: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
};

function RenameModal({
  isOpen,
  title,
  value,
  setValue,
  onCancel,
  onSave,
}: RenameModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">

      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-[450px]">

        <div className="flex justify-center">

          <div className="bg-blue-600 p-4 rounded-full">

            <Pencil
              size={30}
              className="text-white"
            />

          </div>

        </div>

        <h2 className="text-2xl font-bold text-center text-white mt-5">
          {title}
        </h2>

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter new name"
          className="w-full mt-6 bg-slate-800 border border-slate-700 rounded-xl p-4 outline-none text-white placeholder-slate-500 focus:border-blue-500"
        />

        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={onCancel}
            className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 transition"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
          >
            Save
          </button>

        </div>

      </div>

    </div>
  );
}

export default RenameModal;