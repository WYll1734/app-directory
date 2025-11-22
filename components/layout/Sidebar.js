"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Servers" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-950/90">
      <div className="px-5 py-4 border-b border-slate-800">
        <span className="text-sm font-semibold text-indigo-400">ServerMate</span>
        <div className="text-xs text-slate-500">Discord Panel</div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => {
          const active =
            pathname === link.href || pathname.startsWith(link.href + "/");

          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition " +
                (active
                  ? "bg-indigo-500/20 text-indigo-200 border border-indigo-500/40"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100")
              }
            >
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-slate-800 text-xs text-slate-500">
        OAuth2 Dashboard
      </div>
    </aside>
  );
}
