"use client";

import AchievementsTabs from "@/components/achievements/AchievementsTabs";
import Image from "next/image";

export default function BadgesPage({ params }) {
  const { guildId } = params;

  return (
    <div>
      <AchievementsTabs guildId={guildId} />

      <h1 className="text-2xl font-bold mb-4">Badges</h1>

      <p className="text-slate-400 mb-6">
        Configure milestone badges for Bronze, Silver, Gold, and Diamond tiers.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <BadgeCard title="Bronze" img="/public/Bronze.png" />
        <BadgeCard title="Silver" img="/public/Silver.png" />
        <BadgeCard title="Gold" img="/public/gold.png" />
        <BadgeCard title="Diamond" img="/public/Diamond.png" />

      </div>
    </div>
  );
}

function BadgeCard({ title, img }) {
  return (
    <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 flex flex-col items-center">
      <Image src={img} alt={title} width={120} height={120} className="mb-4" />
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
  );
}
