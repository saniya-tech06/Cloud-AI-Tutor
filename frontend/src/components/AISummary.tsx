import { useState } from "react";
import { CheckCircle2, FileText, Sparkles } from "lucide-react";
import { generateSummary, getAIErrorMessage } from "../api/aiApi";

interface Props { documentId: number; }

type SummarySection = { heading: string; items: string[] };

const cleanText = (text: string) => {
  const withoutMarkdown = text
    .replace(/\*\*/g, "")
    .replace(/^\s*(?:[*•-]\s*)?#{1,6}\s*/, "")
    .replace(/^\s*[*•-]\s*/, "")
    .trim();

  return /^[\s\-–—_*=#]+$/.test(withoutMarkdown) ? "" : withoutMarkdown;
};

const splitSummary = (summary: string): SummarySection[] => summary
  .trim()
  .split(/\r?\n\s*\r?\n/)
  .map((block) => block.split(/\r?\n/).map(cleanText).filter(Boolean))
  .filter((lines) => lines.length > 0)
  .map((lines) => ({ heading: lines.length > 1 ? lines[0] : "", items: lines.length > 1 ? lines.slice(1) : lines }));

function AISummary({ documentId }: Props) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await generateSummary(documentId);
      setSummary(response.summary);
    } catch (error) {
      setError(getAIErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const sections = summary ? splitSummary(summary) : [];

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 shadow-xl shadow-slate-950/20">
      <div className="flex flex-col gap-5 border-b border-slate-800 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-400/10 text-amber-300 ring-1 ring-inset ring-amber-300/20"><Sparkles size={23} /></div>
          <div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-300">Study smarter</p><h2 className="mt-0.5 text-2xl font-semibold text-white">AI Summary</h2></div>
        </div>
        <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"><Sparkles size={17} />{loading ? "Generating summary…" : summary ? "Regenerate Summary" : "Generate Summary"}</button>
      </div>

      <div className="p-5 sm:p-7">
        {error && <p role="alert" className="mb-5 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}
        {!summary ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-800/40 px-6 py-12 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/10 text-blue-300"><FileText size={24} /></div>
            <h3 className="mt-4 text-lg font-semibold text-slate-100">Your document summary will appear here</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">Generate a clear overview of the selected document, organized for quick revision.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-700/80 bg-slate-800/60 p-5 sm:p-6">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-700/70 pb-5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-400/10 text-emerald-400"><CheckCircle2 size={20} /></div>
              <div><h3 className="font-semibold text-slate-100">Summary generated</h3><p className="text-sm text-slate-400">Key details from your selected document</p></div>
            </div>
            <div className="space-y-5">
              {sections.map((section, sectionIndex) => (
                <div key={`${section.heading}-${sectionIndex}`} className={section.heading ? "rounded-xl border border-slate-700/60 bg-slate-900/50 p-4 sm:p-5" : "px-1"}>
                  {section.heading && <h4 className="mb-3 text-base font-semibold text-blue-200">{section.heading}</h4>}
                  <div className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <p key={`${item}-${itemIndex}`} className="text-[15px] leading-7 text-slate-300">{item}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default AISummary;
