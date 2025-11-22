# ServerMate OAuth2 Panel (Next.js App Router)

This is a prebuilt Discord control panel you can deploy on Vercel from a GitHub repo.

It includes:

- Discord OAuth2 login (NextAuth + Discord provider)
- `/dashboard` server picker (uses `/api/discord/guilds`)
- Per-guild pages:
  - Overview
  - Ticket Embeds
  - Temp Channel Hubs
- "New Embed Message" page with the layout you described
- "New Hub" page for temp channels with the layout you described
- TailwindCSS styling in a dark, clean layout

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file:

   ```bash
   DISCORD_CLIENT_ID=your_app_client_id
   DISCORD_CLIENT_SECRET=your_app_client_secret
   BOT_TOKEN=your_bot_token   # optional, used when you later wire real guild fetching
   NEXTAUTH_SECRET=some_random_long_string
   NEXTAUTH_URL=http://localhost:3000
   ```

3. Run dev server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser.

Right now `/api/discord/guilds` returns **mock data**, so the UI works even before you connect it to real Discord guild fetching.

Once you are ready, replace the mock guilds in
`app/api/discord/guilds/route.js` with real Discord API calls.
