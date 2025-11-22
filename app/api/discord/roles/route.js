import { NextResponse } from "next/server";

export async function GET(req) {
  const guildId = req.nextUrl.searchParams.get("guildId");
  const BOT_TOKEN = process.env.BOT_TOKEN;

  if (!BOT_TOKEN) {
    return NextResponse.json({
      ok: false,
      error: "Missing BOT_TOKEN in environment variables",
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
      `https://discord.com/api/v10/guilds/${guildId}/roles`,
      {
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`,
        },
      }
    );

    const body = await res.json();

    if (!res.ok) {
      return NextResponse.json({
        ok: false,
        error: "Discord API Error",
        status: res.status,
        body,
      });
    }

    return NextResponse.json({
      ok: true,
      roles: body,
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      error: err.message,
    });
  }
}
