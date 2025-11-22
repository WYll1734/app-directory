"use client";

import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

export default function NewEmbedPage({ params }) {
  const { guildId } = params;

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: POST to API to create embed for this guild
    alert("Embed would be created here (wire to API).");
  };

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-slate-50 mb-1">
          New Embed Message
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Layout based on your screenshot: embed preview on the left, settings on the right.
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
        >
          {/* Left: Preview-style fields */}
          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="text-[11px] text-slate-500 mb-2">Embed Preview</div>
              <Input placeholder="Embed title" className="mb-2" />
              <Textarea placeholder="Embed description..." />
              <Input placeholder="Footer text" className="mt-2" />
            </div>
          </div>

          {/* Right: Settings */}
          <div className="space-y-3 text-xs">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="text-[11px] font-semibold text-slate-300 mb-2">
                Settings
              </div>
              <div className="space-y-2">
                <label className="block space-y-1">
                  <span className="text-slate-400 text-[11px]">
                    Target channel
                  </span>
                  <Input placeholder="#select-channel" />
                </label>
                <label className="block space-y-1">
                  <span className="text-slate-400 text-[11px]">
                    Button label
                  </span>
                  <Input placeholder="Open Ticket" />
                </label>
                <label className="block space-y-1">
                  <span className="text-slate-400 text-[11px]">
                    Button style
                  </span>
                  <select className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-[11px]">
                    <option>Primary</option>
                    <option>Secondary</option>
                    <option>Success</option>
                    <option>Danger</option>
                  </select>
                </label>
                <label className="block space-y-1">
                  <span className="text-slate-400 text-[11px]">
                    Embed color (hex)
                  </span>
                  <Input placeholder="#5865F2" />
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Create embed</Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
