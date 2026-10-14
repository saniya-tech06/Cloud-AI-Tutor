import { useState } from "react";
import { ClipboardList, HelpCircle, RefreshCw, Sparkles } from "lucide-react";
import { generateImportantQuestions, getAIErrorMessage } from "../api/aiApi";

interface Props { documentId: number; }

function AIQuestions({ documentId }: Props) {
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleGenerate = async () => { try { setLoading(true); setError(""); const response = await generateImportantQuestions(documentId); setQuestions(response.importantQuestions); } catch (error) { setError(getAIErrorMessage(error)); } finally { setLoading(false); } };

  return <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 shadow-xl shadow-slate-950/20">
    <div className="flex flex-col gap-4 border-b border-slate-800 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-rose-400/10 text-rose-300 ring-1 ring-inset ring-rose-300/20"><HelpCircle size={22} /></div><div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-rose-300">Exam preparation</p><h2 className="mt-0.5 text-2xl font-semibold">Important Questions</h2></div></div>{questions.length > 0 && <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-rose-400/50 hover:bg-rose-400/10 disabled:opacity-60"><RefreshCw size={16} /> {loading ? "Refreshing…" : "Generate new set"}</button>}</div>
    <div className="p-5 sm:p-7">{error && <p role="alert" className="mb-5 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}{questions.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-800/40 px-6 py-12 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose-400/10 text-rose-300"><ClipboardList size={24} /></div><h3 className="mt-4 text-lg font-semibold">Practice what matters most</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">Generate focused questions from your document to guide your revision and exam preparation.</p><button onClick={handleGenerate} disabled={loading} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white transition hover:bg-rose-500 disabled:opacity-60"><Sparkles size={17} />{loading ? "Generating questions…" : "Generate Questions"}</button></div> : <div className="space-y-3">{questions.map((question, index) => <article key={`${question}-${index}`} className="flex gap-4 rounded-xl border border-slate-700/70 bg-slate-800/60 p-4 sm:p-5"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-rose-400/10 text-sm font-bold text-rose-300">{String(index + 1).padStart(2, "0")}</span><p className="pt-1 text-[15px] leading-7 text-slate-200">{question}</p></article>)}</div>}</div>
  </section>;
}

export default AIQuestions;
