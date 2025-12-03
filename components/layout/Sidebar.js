"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  // Detect if user is inside ANY server dashboard page
  const insideServer = pathname.startsWith("/dashboard/");

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-950/90">
      <div className="px-5 py-4 border-b border-slate-800">
        <span className="text-sm font-semibold text-indigo-400">ServerMate</span>
        <div className="text-xs text-slate-500">Discord Panel</div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {/* Servers Root Button */}
        <Link
          href="/dashboard"
          className={
            "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition " +
            (pathname === "/dashboard"
              ? "bg-indigo-500/20 text-indigo-200 border border-indigo-500/40"
              : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100")
          }
        >
          Servers
        </Link>

        {/* ------------------------------------------
            Highlight ANY dashboard subpage:
            /dashboard/[guildId]/**
          ------------------------------------------- */}
        {insideServer && (
          <div className="mt-3 space-y-1">
            <div className="text-xs text-slate-500 px-3">Server Config</div>

            <Link
              href={pathname.split("/").slice(0, 3).join("/") + "/embed-messages"}
              className={
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition " +
                (pathname.includes("embed-messages")
                  ? "bg-indigo-500/20 text-indigo-200 border border-indigo-500/40"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100")
              }
            >
              Embed Messages
            </Link>

            {/* Add more server menu items later if needed */}
          </div>
        )}
      </nav>

      <div className="px-4 py-4 border-t border-slate-800 text-xs text-slate-500">
        OAuth2 Dashboard
      </div>
    </aside>
  );
}
