const { Client, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch');

// ============================================================
//  CONFIG
// ============================================================
const BOT_TOKEN        = 'YOUR_BOT_TOKEN_HERE';        // paste your bot token
const INTRO_CHANNEL_ID = '1488861311679860826';
const NEW_USER_ROLE_ID = '1488861465828921395';

const WEBHOOK_MEMBER_JOIN  = 'https://hook.eu2.make.com/6id9s2kigdjf1gk95mhdjk53nrl7upgi';
const WEBHOOK_INTRO_POSTED = 'https://hook.eu2.make.com/1gfithrsju98jwl3zuyqxx22qwg0bljh';
// ============================================================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`✅ Bot is online as ${client.user.tag}`);
});

// --- New member joins ---
client.on('guildMemberAdd', async (member) => {
  console.log(`👤 New member joined: ${member.user.tag}`);

  try {
    const res = await fetch(WEBHOOK_MEMBER_JOIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id:    member.id,
        username:   member.user.username,
        guild_id:   member.guild.id,
      }),
    });
    console.log(`📤 Join webhook sent — status: ${res.status}`);
  } catch (err) {
    console.error('❌ Failed to send join webhook:', err);
  }
});

// --- Message posted in #introductions ---
client.on('messageCreate', async (msg) => {
  if (msg.author.bot) return;                        // ignore other bots
  if (msg.channelId !== INTRO_CHANNEL_ID) return;   // only intro channel

  console.log(`📝 Intro posted by: ${msg.author.tag}`);

  try {
    const res = await fetch(WEBHOOK_INTRO_POSTED, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id:    msg.author.id,
        username:   msg.author.username,
        guild_id:   msg.guildId,
      }),
    });
    console.log(`📤 Intro webhook sent — status: ${res.status}`);
  } catch (err) {
    console.error('❌ Failed to send intro webhook:', err);
  }
});

client.login(BOT_TOKEN);
