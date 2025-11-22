import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const guildId = params.guildId; // ✅ Correct source
  const BOT_TOKEN = process.env.BOT_TOKEN;

  if (!BOT_TOKEN) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing BOT_TOKEN in environment variables",
      },
      { status: 500 }
    );
  }

  if (!guildId) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing guildId",
      },
      { status: 400 }
    );
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
      return NextResponse.json(
        {
          ok: false,
          error: "Discord API Error",
          status: res.status,
          body,
        },
        { status: res.status }
      );
    }

    // Return array directly (simpler for client)
    return NextResponse.json(body);
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
