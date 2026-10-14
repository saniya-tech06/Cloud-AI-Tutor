import { BookOpen } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  buttonText?: string;
  onClick?: () => void;
};

function EmptyState({
  title,
  description,
  buttonText,
  onClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-700 rounded-2xl">

      <BookOpen
        size={65}
        className="text-slate-500"
      />

      <h2 className="text-2xl font-bold text-white mt-6">
        {title}
      </h2>

      <p className="text-slate-400 text-center mt-3 max-w-md">
        {description}
      </p>

      {buttonText && (
        <button
          onClick={onClick}
          className="mt-8 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition"
        >
          {buttonText}
        </button>
      )}

    </div>
  );
}

export default EmptyState;