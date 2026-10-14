import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, Bot, ClipboardList, FileText, Plus, Sparkles, Star, TrendingUp, Trophy, Upload } from "lucide-react";
import Navbar from "../components/navbar";
import MenuBar from "../components/MenuBar";
import { getStudySpaces } from "../api/studySpaceApi";
import { getProgress } from "../api/progressApi";

type StudySpace = { id: number; title: string; description: string; created_at: string; document_count?: number | string };
type Progress = { totalStudySpaces: number; totalDocuments: number; favoriteSpaces: number; averageQuizScore: string; totalQuizAttempts: number };

function Dashboard() {
  const [studySpaces, setStudySpaces] = useState<StudySpace[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [spacesResponse, progressResponse] = await Promise.all([getStudySpaces(), getProgress()]);
        setStudySpaces(spacesResponse.studySpaces ?? []);
        setProgress(progressResponse.progress ?? null);
      } catch (error) {
        console.error("Dashboard loading failed", error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const spacesWithDocuments = useMemo(() => studySpaces.filter((space) => Number(space.document_count ?? 0) > 0).length, [studySpaces]);
  const learningProgress = studySpaces.length ? Math.round((spacesWithDocuments / studySpaces.length) * 100) : 0;
  const latestSpace = studySpaces[0];
  const userName = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") ?? "{}").name?.split(" ")[0] || "there";
    } catch {
      return "there";
    }
  }, []);
  const statistics = [
    { title: "Study Spaces", value: progress?.totalStudySpaces ?? 0, icon: BookOpen, color: "text-blue-400" },
    { title: "Documents", value: progress?.totalDocuments ?? 0, icon: FileText, color: "text-emerald-400" },
    { title: "Bookmarks", value: progress?.favoriteSpaces ?? 0, icon: Star, color: "text-amber-400" },
    { title: "Average Quiz Score", value: progress?.averageQuizScore ?? "0%", detail: `${progress?.totalQuizAttempts ?? 0} submitted quiz${progress?.totalQuizAttempts === 1 ? "" : "zes"}`, icon: Trophy, color: "text-orange-400" },
    { title: "Learning Progress", value: `${learningProgress}%`, icon: TrendingUp, color: "text-violet-400" },
  ];
  const quickActions = [
    { title: "Create Study Space", description: "Organize a new subject", icon: Plus, link: "/new-study-space" },
    { title: "Upload Document", description: "Add PDFs and notes", icon: Upload, link: latestSpace ? `/study-space/${latestSpace.id}` : "/new-study-space" },
    { title: "Ask AI", description: "Get instant explanations", icon: Bot, link: latestSpace ? `/study-space/${latestSpace.id}` : "/new-study-space" },
    { title: "Generate Quiz", description: "Test your knowledge", icon: ClipboardList, link: latestSpace ? `/study-space/${latestSpace.id}` : "/new-study-space" },
  ];

  return <div className="min-h-screen bg-slate-950 text-white">
    <Navbar />
    <MenuBar />
    <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <section className="overview-hero relative isolate overflow-hidden rounded-3xl px-6 py-7 shadow-2xl shadow-blue-950/35 sm:px-8 sm:py-8 lg:px-10">
        <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full border border-white/10 bg-white/[0.06]" />
        <div className="absolute bottom-0 right-24 h-32 w-32 rounded-t-full border-x border-t border-white/10 bg-white/[0.04]" />
        <div className="relative flex min-h-48 flex-col justify-center pr-0 lg:pr-60">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-blue-50 ring-1 ring-inset ring-white/20"><Sparkles size={14} /> Your learning hub</div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Welcome back, {userName} <span aria-hidden="true">👋</span></h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-blue-50/90 sm:text-lg">Your next study win is one focused session away. Keep the momentum going.</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium text-white">
            <span className="inline-flex items-center gap-2 rounded-lg bg-slate-950/20 px-3 py-2 ring-1 ring-inset ring-white/15"><BookOpen size={16} className="text-sky-200" /> {loading ? "Loading spaces" : `${progress?.totalStudySpaces ?? 0} study spaces`}</span>
            <span className="inline-flex items-center gap-2 rounded-lg bg-slate-950/20 px-3 py-2 ring-1 ring-inset ring-white/15"><FileText size={16} className="text-sky-200" /> {loading ? "Loading materials" : `${progress?.totalDocuments ?? 0} materials`}</span>
          </div>
        </div>
        <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 lg:block">
          <div className="grid h-36 w-36 place-items-center rounded-[2rem] border border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-sm"><div className="grid h-20 w-20 place-items-center rounded-3xl bg-white/15 ring-1 ring-white/20"><BookOpen size={38} strokeWidth={1.6} /></div></div>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {statistics.map((stat) => { const Icon = stat.icon; return <div key={stat.title} className="rounded-2xl border border-slate-800 bg-slate-900/95 p-5 shadow-lg shadow-slate-950/20 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/70"><Icon size={27} className={stat.color} /><p className="mt-4 text-sm text-slate-400">{stat.title}</p><p className="mt-1 text-3xl font-bold tracking-tight">{loading ? "—" : stat.value}</p>{stat.detail && <p className="mt-2 text-xs text-slate-500">{loading ? "" : stat.detail}</p>}</div>; })}
      </section>

      <section className="mt-10">
        <div className="mb-5"><p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-400">Shortcuts</p><h2 className="mt-1 text-2xl font-semibold">Quick actions</h2></div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => { const Icon = action.icon; return <Link key={action.title} to={action.link} className="group rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-lg shadow-slate-950/20 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/70"><Icon size={30} className="text-blue-400 transition-transform group-hover:scale-110" /><h3 className="mt-5 text-lg font-semibold">{action.title}</h3><p className="mt-2 text-sm text-slate-400">{action.description}</p></Link>; })}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-lg shadow-slate-950/20 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-400">Continue learning</p><h2 className="mt-1 text-2xl font-semibold">{latestSpace ? latestSpace.title : "Start your first study space"}</h2><p className="mt-2 text-slate-400">{latestSpace ? `${Number(latestSpace.document_count ?? 0)} document${Number(latestSpace.document_count ?? 0) === 1 ? "" : "s"} available for your next session.` : "Create a space, upload a document, and use AI to study smarter."}</p></div><Link to={latestSpace ? `/study-space/${latestSpace.id}` : "/new-study-space"} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500 sm:w-auto">{latestSpace ? "Continue" : "Create space"}<ArrowRight size={18} /></Link></div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.45fr_1fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-lg shadow-slate-950/20 sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-400">Your account</p><h2 className="mt-1 text-2xl font-semibold">Recent study spaces</h2></div><Link to="/study-spaces" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-400 transition hover:text-blue-300">View all <ArrowRight size={16} /></Link></div>
          {loading ? <p className="py-6 text-slate-400">Loading your study spaces…</p> : studySpaces.length === 0 ? <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center"><BookOpen size={34} className="mx-auto text-slate-500" /><h3 className="mt-3 font-semibold">No study spaces yet</h3><p className="mt-1 text-sm text-slate-400">Create your first space to see it here.</p></div> : <div className="space-y-3">{studySpaces.slice(0, 4).map((space) => <Link key={space.id} to={`/study-space/${space.id}`} className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-800/60 p-4 transition hover:border-blue-500/70 hover:bg-slate-800"><div className="min-w-0"><p className="truncate font-semibold text-slate-100">{space.title}</p><p className="mt-1 truncate text-sm text-slate-400">{space.description || "No description added"}</p></div><div className="shrink-0 text-right"><p className="text-sm font-medium text-blue-300">{Number(space.document_count ?? 0)} docs</p><p className="mt-1 text-xs text-slate-500">{new Date(space.created_at).toLocaleDateString()}</p></div></Link>)}</div>}
        </div>
        <div className="rounded-2xl border border-blue-300/15 bg-gradient-to-br from-indigo-600/90 to-blue-700/90 p-6 shadow-xl shadow-blue-950/30 sm:p-8"><p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-100/80">Learning progress</p><h2 className="mt-2 text-3xl font-bold">{learningProgress}% ready</h2><p className="mt-3 text-sm leading-6 text-blue-100">{spacesWithDocuments} of {studySpaces.length} study spaces have at least one document. Add material to a space to make it ready for AI study tools.</p><div className="mt-6 h-2.5 overflow-hidden rounded-full bg-slate-950/30"><div className="h-full rounded-full bg-white transition-all" style={{ width: `${learningProgress}%` }} /></div><Link to="/study-spaces" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50">Manage study spaces <ArrowRight size={18} /></Link></div>
      </section>
    </main>
  </div>;
}

export default Dashboard;
