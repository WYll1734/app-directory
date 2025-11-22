import AutomodPage from "./automod/page";

export default function ModerationIndexPage({ params }) {
  // extract correct param name
  const guildId = params.guildId;

  // Forward correct param shape to the subpage
  return <AutomodPage params={{ guildId }} />;
}
