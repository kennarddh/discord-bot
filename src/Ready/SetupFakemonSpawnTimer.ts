import { Client, ChannelType, TextChannel } from 'discord.js'

import SpawnFakemon from '../Utils/SpawnFakemon.js'
import Fakemon from '../Data/Fakemon.js'
import CreateSpawnFakemonEmbed from '../Utils/CreateSpawnFakemonEmbed.js'
import PickArrayRandom from '../Utils/PickArrayRandom.js'
import AsyncFilter from '../Utils/AsyncFilter.js'

const spawnEvery = 2 * 60 * 1000
const lastMessageBeforeSpawn = 60 * 1000

const SetupFakemonSpawnTimer = (client: Client) => {
	setInterval(async () => {
		const prevPendingName = Fakemon.pendingCatchSpecies?.name as
			| string
			| undefined

		const result = await SpawnFakemon().catch(() => {
			// ignore error
		})

		if (!result) return

		const embed = CreateSpawnFakemonEmbed(
			client,
			result.image,
			prevPendingName
		)

		const guilds = await client.guilds.fetch().catch(() => {
			// Ignore
		})

		if (!guilds) return

		for (const oAuthGuild of guilds.values()) {
			const guild = await oAuthGuild.fetch().catch(() => {
				// Ignore
			})

			if (!guild) continue

			const channels = await guild.channels.fetch().catch(() => {
				// Ignore
			})

			if (!channels) continue

			const textChannels = (await AsyncFilter(
				[...channels.values()],
				async channel => {
					if (channel.type !== ChannelType.GuildText) return false
					if (!(channel.topic ?? '').includes('fakemon')) return false

					const textChannel = channel as TextChannel

					const messages = await textChannel.messages
						.fetch({ limit: 1 })
						.catch(() => {
							// Ignore
						})

					if (!messages) return false

					const lastMessage = messages.first()

					// Message must be created maximum 2 minutes before (active channel)
					if (
						Date.now() - lastMessage.createdAt.getTime() >
						lastMessageBeforeSpawn
					)
						return false

					return true
				}
			)) as TextChannel[]

			const textChannel = PickArrayRandom(textChannels)

			if (!textChannel) continue

			textChannel.send({
				embeds: [embed.embed],
				files: embed.files,
			})
		}
	}, spawnEvery)
}

export default SetupFakemonSpawnTimer
