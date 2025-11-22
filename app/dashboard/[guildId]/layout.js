"use client";

import ServerSidebar from "@/components/server/ServerSidebar";

export default function DashboardLayout({ children, params }) {
  // MUST match the folder name [guildId]
  const guildId = params.guildId;

  return (
    <div className="flex">
      <ServerSidebar guildId={guildId} />

      <div className="flex-1 p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
