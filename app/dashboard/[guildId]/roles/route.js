import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { guildId } = params;

  try {
    // Call Discord API
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/roles`,
      {
        headers: {
          Authorization: `Bot ${process.env.BOT_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch roles from Discord API" },
        { status: response.status }
      );
    }

    const roles = await response.json();

    return NextResponse.json(roles);
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
