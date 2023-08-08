import type { AnyThreadChannel, ForumChannel } from "discord.js";
import { Client, Events, GatewayIntentBits, ChannelType } from "discord.js";

const botToken = process.env.BOT_TOKEN;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token

const fetchAllMessages = async (channel: ForumChannel) => {
  const messages: AnyThreadChannel<true>[] = [];
  const fetchedMessages = await channel.threads.fetchActive();
  const activeThreads = [...fetchedMessages.threads.values()];
  const archivedThreads = await channel.threads.fetchArchived({ fetchAll: true });
  messages.push(...activeThreads);
  return messages;
};
const run = async () => {
  await client.login(botToken);
  const guilds = client.guilds.cache;
  for (const guild of guilds.values()) {
    const channels = await guild.channels.fetch();
    for (const channel of channels.values()) {
      if (channel?.type === ChannelType.GuildForum) {
        console.log(channel.name);
        await fetchAllMessages(channel as ForumChannel);
        // await channel.delete();
      }
    }
  }
};
run();
