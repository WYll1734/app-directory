"use client";

import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";

export default function NewTempHubPage({ params }) {
  const { guildId } = params;

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: POST to API to create temp hub config
    alert("Temp hub would be created here (wire to API).");
  };

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-slate-50 mb-1">
          New Temp Hub
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Matches the layout you requested: inputs for hub name, category, user
          limit, and options.
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
        >
          {/* Left column: core settings */}
          <div className="space-y-3 text-xs">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
              <label className="block space-y-1">
                <span className="text-slate-400 text-[11px]">Hub name</span>
                <Input placeholder="Ranked Temp Hub" required />
              </label>
              <label className="block space-y-1">
                <span className="text-slate-400 text-[11px]">Category</span>
                <Input placeholder="Temp Channels" />
              </label>
              <label className="block space-y-1">
                <span className="text-slate-400 text-[11px]">Base voice channel</span>
                <Input placeholder="Select voice template" />
              </label>
              <label className="block space-y-1">
                <span className="text-slate-400 text-[11px]">Description / notes</span>
                <Textarea placeholder="Optional notes about this hub..." />
              </label>
            </div>
          </div>

          {/* Right column: advanced options */}
          <div className="space-y-3 text-xs">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
              <label className="block space-y-1">
                <span className="text-slate-400 text-[11px]">User limit</span>
                <Input type="number" placeholder="5" min="0" />
              </label>
              <label className="block space-y-1">
                <span className="text-slate-400 text-[11px]">Auto-delete</span>
                <select className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-[11px]">
                  <option>After empty for 5 min</option>
                  <option>After empty for 10 min</option>
                  <option>After empty for 30 min</option>
                  <option>Never</option>
                </select>
              </label>
              <label className="flex items-center gap-2 text-[11px] text-slate-300 mt-2">
                <input type="checkbox" className="rounded border-slate-700 bg-slate-900" />
                Allow channel owners to rename
              </label>
              <label className="flex items-center gap-2 text-[11px] text-slate-300">
                <input type="checkbox" className="rounded border-slate-700 bg-slate-900" />
                Lock channels when owner disconnects
              </label>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Create hub</Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
