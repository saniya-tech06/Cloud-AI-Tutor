import { Bell, BellRing, CheckCircle2, GraduationCap, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [user, setUser] = useState({
    name: "",
    role: "Student",
  });


  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if(storedUser){

      const userData = JSON.parse(storedUser);

      setUser({
        name: userData.name,
        role: "Student",
      });

    }

  }, []);



  const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="relative z-40 border-b border-white/[0.07] bg-slate-950/90 px-4 py-3.5 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 text-white shadow-lg shadow-blue-950/50 ring-1 ring-white/20"><GraduationCap size={22} /></div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold tracking-tight text-white sm:text-lg">Cloud AI Study Assistant</h1>
            <p className="hidden items-center gap-1 text-xs text-slate-400 sm:flex"><Sparkles size={12} className="text-blue-400" /> Your focused learning workspace</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <button
              type="button"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              onClick={() => setNotificationsOpen((open) => !open)}
              className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-300 transition hover:border-blue-400/30 hover:bg-blue-400/10 hover:text-white"
            >
              <Bell size={19} />
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-blue-400 ring-2 ring-slate-950" />
            </button>

            {notificationsOpen && (
              <div role="status" className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-2xl shadow-slate-950/60 ring-1 ring-black/20 sm:w-96">
                <div className="flex items-center gap-3 border-b border-white/[0.08] pb-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500/15 text-blue-300"><BellRing size={18} /></div>
                  <div><p className="font-semibold text-slate-100">Notifications</p><p className="text-xs text-slate-500">Stay up to date with your workspace</p></div>
                </div>
                <div className="flex gap-3 pt-4">
                  <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-emerald-400" />
                  <div><p className="text-sm font-medium text-slate-200">You're all caught up</p><p className="mt-1 text-sm leading-5 text-slate-400">We’ll let you know when there’s an important update to your study spaces, documents, or learning progress.</p></div>
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => navigate("/profile")}
            aria-label="Open profile"
            className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] py-1.5 pl-1.5 pr-2.5 text-left transition hover:border-blue-400/30 hover:bg-blue-400/10 sm:pr-3"
          >
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 text-xs font-bold text-white sm:h-8 sm:w-8">{initial}</div>
            <div className="hidden leading-tight sm:block"><p className="max-w-28 truncate text-sm font-semibold text-slate-100">{user.name || "Student"}</p><p className="text-[11px] text-slate-500">{user.role}</p></div>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
