import { NavLink } from "react-router-dom";
import { BookOpen, CircleUserRound, LayoutDashboard, LogOut, Plus, TrendingUp } from "lucide-react";

const items = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/study-spaces", label: "Study spaces", icon: BookOpen },
  { to: "/new-study-space", label: "New space", icon: Plus },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/profile", label: "Profile", icon: CircleUserRound },
];

function Menubar() {
  return (
    <nav aria-label="Main navigation" className="sticky top-0 z-30 border-b border-white/[0.07] bg-slate-950/80 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto [scrollbar-width:none] sm:justify-between">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `group inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${isActive ? "bg-blue-500/15 text-blue-300 ring-1 ring-inset ring-blue-400/20" : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-100"}`}>
            <Icon size={17} strokeWidth={2} className="transition-transform group-hover:scale-110" />
            {label}
          </NavLink>
        ))}
        <div className="mx-1 h-6 w-px shrink-0 bg-white/10" />
        <NavLink to="/" className="inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-white/[0.06] hover:text-slate-200">
          <LogOut size={17} /> Sign out
        </NavLink>
      </div>
    </nav>
  );
}

export default Menubar;
