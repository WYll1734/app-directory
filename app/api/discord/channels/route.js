import { NextResponse } from "next/server";

export async function GET(req) {
  const guildId = req.nextUrl.searchParams.get("guildId");

  if (!guildId) {
    return NextResponse.json({ error: "Missing guildId" }, { status: 400 });
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;

  if (!BOT_TOKEN) {
    return NextResponse.json({ error: "Missing BOT_TOKEN" }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/channels`,
      {
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch channels", status: response.status },
        { status: response.status }
      );
    }

    const channels = await response.json();

    // Optional: sort channels like Discord
    const sorted = channels.sort((a, b) => a.position - b.position);

    return NextResponse.json({ ok: true, channels: sorted });
  } catch (err) {
    return NextResponse.json(
      { error: "Request failed", details: err.message },
      { status: 500 }
    );
  }
}
