import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const guildId = params.guildId; // ✅ Correct: get from dynamic route

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

    // Sort properly (Discord order)
    const sorted = channels.sort((a, b) => (a.position || 0) - (b.position || 0));

    // ⛔ IMPORTANT: Return array directly (not wrapped)
    return NextResponse.json(sorted);
  } catch (err) {
    return NextResponse.json(
      { error: "Request failed", details: err.message },
      { status: 500 }
    );
  }
}
