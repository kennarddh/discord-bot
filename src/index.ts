import 'dotenv/config'

import { Client, Collection, Events, GatewayIntentBits } from 'discord.js'
import Ping from './Commands/Ping.js'

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildScheduledEvents,
		GatewayIntentBits.AutoModerationConfiguration,
		GatewayIntentBits.AutoModerationExecution,
	],
})

client.once(Events.ClientReady, botClient => {
	console.log(`Ready! Logged in as ${botClient.user.tag}`)
})

client.on('messageCreate', async message => {
	if (!message.content.startsWith('!')) return

	if (message.author.bot) return

	const command = message.content.substring(1)

	console.log(command, message.mentions)

	if (command.startsWith('ping')) message.channel.send('Pong')
})

client.login(process.env.DISCORD_TOKEN)
