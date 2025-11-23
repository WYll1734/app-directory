"use client";

import ModerationTabs from "@/components/moderation/ModerationTabs";
import AuditLoggingTab from "@/components/moderation/AuditLoggingTab";

export default function AuditLoggingPage({ params }) {
  const { guildId } = params;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* MODERATION TOP TABS */}
      <ModerationTabs guildId={guildId} activeTab="audit-logging" />

      {/* THE MAIN AUDIT LOGGING UI */}
      <AuditLoggingTab guildId={guildId} />
    </div>
  );
}
