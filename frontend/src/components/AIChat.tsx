import { Fragment, useEffect, useRef, useState } from "react";
import { Bot, MessageSquare, Send, Sparkles } from "lucide-react";
import { askAI, getAIErrorMessage, getChatHistory } from "../api/aiApi";

interface Props { documentId: number; }
type Message = { id: number; sender: "user" | "ai"; text: string; };
const welcomeMessage: Message = { id: 0, sender: "ai", text: "Hello! Ask me anything about your document, and I’ll help you understand it." };

type AnswerBlock =
  | { type: "heading"; text: string; level: number }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; ordered: boolean };

const parseAnswer = (answer: string): AnswerBlock[] => {
  const blocks: AnswerBlock[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let orderedList = false;

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: "paragraph", text: paragraph.join(" ") });
    paragraph = [];
  };
  const flushList = () => {
    if (listItems.length) blocks.push({ type: "list", items: listItems, ordered: orderedList });
    listItems = [];
  };

  for (const rawLine of answer.replace(/\r/g, "").split("\n")) {
    const line = rawLine.trim();
    if (!line || /^([-*_]\s*){3,}$/.test(line)) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2] });
      continue;
    }

    const listItem = line.match(/^(?:[-*+]\s+|\d+[.)]\s+)(.+)$/);
    if (listItem) {
      flushParagraph();
      const isOrdered = /^\d/.test(line);
      if (listItems.length && orderedList !== isOrdered) flushList();
      orderedList = isOrdered;
      listItems.push(listItem[1]);
      continue;
    }

    flushList();
    paragraph.push(line.replace(/^>\s?/, ""));
  }

  flushParagraph();
  flushList();
  return blocks;
};

const renderInline = (text: string) => text.split(/(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*]+\*)/g).map((part, index) => {
  if ((part.startsWith("**") && part.endsWith("**")) || (part.startsWith("__") && part.endsWith("__"))) {
    return <strong key={index} className="font-semibold text-slate-100">{part.slice(2, -2)}</strong>;
  }
  if (part.startsWith("*") && part.endsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
  if (part.startsWith("`") && part.endsWith("`")) return <code key={index} className="rounded bg-slate-950/70 px-1.5 py-0.5 text-sm text-cyan-200">{part.slice(1, -1)}</code>;
  return <Fragment key={index}>{part}</Fragment>;
});

const FormattedAnswer = ({ text }: { text: string }) => (
  <div className="space-y-3">
    {parseAnswer(text).map((block, index) => {
      if (block.type === "heading") {
        const className = block.level <= 2 ? "text-lg font-semibold text-white" : "text-base font-semibold text-blue-100";
        return <h3 key={index} className={className}>{renderInline(block.text)}</h3>;
      }
      if (block.type === "list") {
        const List = block.ordered ? "ol" : "ul";
        return <List key={index} className={`space-y-2 pl-5 ${block.ordered ? "list-decimal" : "list-disc"}`}>
          {block.items.map((item, itemIndex) => <li key={itemIndex} className="pl-1 text-slate-300">{renderInline(item)}</li>)}
        </List>;
      }
      return <p key={index} className="whitespace-pre-wrap text-slate-300">{renderInline(block.text)}</p>;
    })}
  </div>
);

function AIChat({ documentId }: Props) {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    setHistoryLoading(true);
    setHistoryError("");
    getChatHistory(documentId)
      .then((response) => {
        if (!active) return;
        const restored = response.messages.map((message: { id: number; role: "user" | "assistant"; content: string }) => ({
          id: message.id,
          sender: message.role === "user" ? "user" as const : "ai" as const,
          text: message.content,
        }));
        setMessages(restored.length ? restored : [welcomeMessage]);
      })
      .catch((error) => {
        if (!active) return;
        setHistoryError(getAIErrorMessage(error));
      })
      .finally(() => { if (active) setHistoryLoading(false); });
    return () => { active = false; };
  }, [documentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, historyLoading, loading]);

  const handleSend = async () => {
    if (!question.trim() || loading || historyLoading) return;
    const userMessage = { id: Date.now(), sender: "user" as const, text: question.trim() };
    setMessages((previous) => [...previous, userMessage]);
    setQuestion("");
    try {
      setLoading(true);
      const response = await askAI(documentId, userMessage.text);
      setMessages((previous) => [...previous, { id: Date.now() + 1, sender: "ai", text: response.answer }]);
    } catch (error) {
      setMessages((previous) => [...previous, { id: Date.now() + 1, sender: "ai", text: getAIErrorMessage(error) }]);
    } finally { setLoading(false); }
  };

  return <section className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 shadow-xl shadow-slate-950/20">
    <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-5 sm:px-7"><div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-500/10 text-blue-300 ring-1 ring-inset ring-blue-400/20"><MessageSquare size={22} /></div><div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-300">Document assistant</p><h2 className="mt-0.5 text-2xl font-semibold">Ask AI</h2></div></div>
    <div className="h-[420px] space-y-5 overflow-y-auto bg-slate-950/25 p-5 sm:p-7">
      {historyLoading && <p className="text-sm text-slate-400">Loading this document’s conversation…</p>}
      {historyError && <p role="alert" className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">Chat history could not be loaded: {historyError}</p>}
      {messages.map((message) => <div key={message.id} className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
        {message.sender === "ai" && <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-500/15 text-blue-300"><Bot size={17} /></div>}
        <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-[15px] leading-7 ${message.sender === "user" ? "rounded-br-md bg-blue-600 text-white shadow-lg shadow-blue-950/20" : "rounded-tl-md border border-slate-700 bg-slate-800 text-slate-200"}`}>
          {message.sender === "ai" ? <FormattedAnswer text={message.text} /> : <div className="whitespace-pre-wrap">{message.text}</div>}
        </div>
      </div>)}
      {loading && <div className="flex gap-3"><div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-500/15 text-blue-300"><Sparkles size={16} /></div><div className="rounded-2xl rounded-tl-md border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-400">Thinking through your question…</div></div>}
      <div ref={messagesEndRef} />
    </div>
    <div className="border-t border-slate-800 p-4 sm:p-5"><div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/70 p-2 pl-4 focus-within:border-blue-400/60"><input value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") handleSend(); }} disabled={historyLoading} placeholder={historyLoading ? "Loading conversation…" : "Ask about the selected document…"} className="min-w-0 flex-1 bg-transparent py-2 text-slate-100 outline-none placeholder:text-slate-500 disabled:opacity-60" /><button onClick={handleSend} disabled={!question.trim() || loading || historyLoading} aria-label="Send question" className="grid h-10 w-10 place-items-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"><Send size={18} /></button></div></div>
  </section>;
}

export default AIChat;
