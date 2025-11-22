"use client";

import AuditLoggingTab from "@/components/moderation/AuditLoggingTab";

export default function AuditLoggingPage({ params }) {
  const guildId = params.guildId; // FIXED — MUST match folder [guildId]

  return (
    <div className="p-6">
      <AuditLoggingTab guildId={guildId} />
    </div>
  );
}
