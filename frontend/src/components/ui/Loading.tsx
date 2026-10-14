import { LoaderCircle } from "lucide-react";

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-20">

      <LoaderCircle
        size={55}
        className="text-blue-500 animate-spin"
      />

      <h2 className="text-white text-xl font-semibold mt-6">
        Loading...
      </h2>

      <p className="text-slate-400 mt-2">
        Please wait while we prepare your content.
      </p>

    </div>
  );
}

export default Loading;