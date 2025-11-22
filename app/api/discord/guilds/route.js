import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ error: "NO_SESSION" });
  }

  try {
    // -------- 1. FETCH USER GUILDS -------- //
    const userRes = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    });

    const userGuilds = await userRes.json();

    if (!Array.isArray(userGuilds)) {
      console.error("USER GUILDS RESPONSE:", userGuilds);
      return NextResponse.json({ error: "USER_GUILD_FETCH_FAILED" });
    }

    // -------- 2. FETCH BOT GUILDS -------- //
    const botRes = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
      cache: "no-store",
    });

    const botGuilds = await botRes.json();

    if (!Array.isArray(botGuilds)) {
      console.error("BOT GUILDS RESPONSE:", botGuilds);
      return NextResponse.json({ error: "BOT_GUILD_FETCH_FAILED" });
    }

    const botGuildIds = new Set(botGuilds.map(g => g.id));

    // -------- 3. NORMALIZE -------- //
    const guilds = userGuilds.map(g => {
      const canManage =
        (BigInt(g.permissions) & BigInt(1 << 5)) !== BigInt(0); // MANAGE_GUILD

      return {
        id: g.id,
        name: g.name,
        icon: g.icon,
        permissions: g.permissions,
        canManageGuild: canManage,
        botInGuild: botGuildIds.has(g.id),
      };
    });

    return NextResponse.json({ guilds });

  } catch (err) {
    console.error("GUILD FETCH ERROR:", err);
    return NextResponse.json({ error: "SERVER_ERROR" });
  }
}
