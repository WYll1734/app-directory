"use client";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Topbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  // Close dropdown if clicked outside
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const getTitle = () => {
    if (pathname.startsWith("/dashboard/") && pathname.includes("/embeds")) {
      if (pathname.endsWith("/new")) return "New Embed Message";
      return "Ticket Embeds";
    }
    if (pathname.startsWith("/dashboard/") && pathname.includes("/temp-channels")) {
      if (pathname.endsWith("/new")) return "New Temp Hub";
      return "Temp Channel Hubs";
    }
    if (pathname.startsWith("/dashboard/") && pathname.split("/").length === 3) {
      return "Server Overview";
    }
    if (pathname.startsWith("/dashboard")) return "Your Servers";
    return "ServerMate Panel";
  };

  const user = session?.user;

  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-3 relative">
      <h1 className="text-sm font-medium text-slate-100">{getTitle()}</h1>

      {/* Right Side User Info */}
      <div className="relative z-50" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 hover:opacity-90 transition"
        >
          {/* Avatar */}
          <img
            src={user?.image}
            alt="User avatar"
            className="h-8 w-8 rounded-full border border-slate-700 hover:border-indigo-400 transition"
          />

          {/* Username */}
          <span className="text-xs text-slate-300 hover:text-slate-100 transition">
            {user?.name || "User"}
          </span>

          {/* Dropdown Arrow */}
          <svg
            className={`w-3 h-3 text-slate-400 transition ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {open && (
          <div className="absolute right-0 mt-2 w-40 rounded-md bg-slate-900 border border-slate-700 shadow-xl text-sm">
            <button
              onClick={() => signOut()}
              className="block w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-red-400 transition"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
