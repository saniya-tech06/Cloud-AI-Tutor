import { useState } from "react";
import { BookOpen, Check, Lightbulb, Sparkles } from "lucide-react";
import { generateKeyPoints, getAIErrorMessage } from "../api/aiApi";

interface Props { documentId: number; }

function AIKeyPoints({ documentId }: Props) {
  const [points, setPoints] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleGenerate = async () => { try { setLoading(true); setError(""); const response = await generateKeyPoints(documentId); setPoints(response.keyPoints); } catch (error) { setError(getAIErrorMessage(error)); } finally { setLoading(false); } };

  return <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 shadow-xl shadow-slate-950/20">
    <div className="flex flex-col gap-4 border-b border-slate-800 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300 ring-1 ring-inset ring-cyan-300/20"><Lightbulb size={22} /></div><div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-300">Revision notes</p><h2 className="mt-0.5 text-2xl font-semibold">Key Points</h2></div></div>{points.length > 0 && <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/50 hover:bg-cyan-400/10 disabled:opacity-60"><Sparkles size={16} /> {loading ? "Refreshing…" : "Refresh points"}</button>}</div>
    <div className="p-5 sm:p-7">{error && <p role="alert" className="mb-5 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}{points.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-800/40 px-6 py-12 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300"><BookOpen size={24} /></div><h3 className="mt-4 text-lg font-semibold">Make revision easier</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">Generate the most important ideas from this document in a quick, scannable format.</p><button onClick={handleGenerate} disabled={loading} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-semibold text-white transition hover:bg-cyan-500 disabled:opacity-60"><Sparkles size={17} />{loading ? "Generating points…" : "Generate Key Points"}</button></div> : <div className="grid gap-3 md:grid-cols-2">{points.map((point, index) => <article key={`${point}-${index}`} className="flex gap-3 rounded-xl border border-slate-700/70 bg-slate-800/60 p-4"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cyan-400/10 text-cyan-300"><Check size={15} /></span><p className="text-[15px] leading-6 text-slate-300">{point}</p></article>)}</div>}</div>
  </section>;
}

export default AIKeyPoints;
