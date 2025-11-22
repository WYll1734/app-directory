"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomeClient() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.replace("/dashboard");
  }, [session, router]);

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-slate-400">Loading…</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-md rounded-2xl bg-slate-900/80 p-8 shadow-2xl border border-slate-800">
        <h1 className="text-2xl font-semibold text-slate-50 mb-2">
          ServerMate Control Panel
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          Log in with Discord
        </p>
        <Link
          href="/api/auth/signin"
          className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-400 transition shadow-lg shadow-indigo-900/40"
        >
          Log in with Discord
        </Link>
      </div>
    </main>
  );
}
