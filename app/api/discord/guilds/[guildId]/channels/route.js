import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const guildId = params.guildId; // ← dynamic folder gives this
  const BOT_TOKEN = process.env.BOT_TOKEN;

  if (!BOT_TOKEN) {
    return NextResponse.json({
      ok: false,
      error: "Missing BOT_TOKEN",
    });
  }

  if (!guildId) {
    return NextResponse.json({
      ok: false,
      error: "Missing guildId",
    });
  }

  try {
    const res = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/channels`,
      {
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`,
        },
      }
    );

    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json({
        ok: false,
        error: "Discord API Error",
        status: res.status,
        body: json,
      });
    }

    // Sort similar to Discord UI
    const sorted = json.sort((a, b) => a.position - b.position);

    return NextResponse.json({
      ok: true,
      channels: sorted,
    });
  } catch (e) {
    return NextResponse.json({
      ok: false,
      error: e.message,
    });
  }
}
