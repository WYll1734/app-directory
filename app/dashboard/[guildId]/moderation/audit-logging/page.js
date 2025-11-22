"use client";

import AuditLoggingTab from "@/components/moderation/AuditLoggingTab";

export default function AuditLoggingPage({ params }) {
  // MUST match folder name: [guildid]
  const guildId = params.guildid;

  return (
    <div className="p-6">
      <AuditLoggingTab guildId={guildId} />
    </div>
  );
}
