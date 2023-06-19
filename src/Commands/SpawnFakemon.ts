import { SlashCommandBuilder } from 'discord.js'

import { ICommand } from './Types'
import Fakemon from '../Data/Fakemon.js'
import SpawnFakemonUtil from '../Utils/SpawnFakemon.js'
import CreateSpawnFakemonEmbed from '../Utils/CreateSpawnFakemonEmbed.js'

const SpawnFakemon: ICommand = {
	data: new SlashCommandBuilder()
		.setName('spawn-fakemon')
		.setDescription('Spawn Fakemon')
		.addIntegerOption(option =>
			option
				.setRequired(false)
				.setName('species-id')
				.setDescription('Species Id')
				.setMaxValue(1010)
				.setMinValue(1)
		) as SlashCommandBuilder,
	async execute(interaction) {
		const speciesId = (interaction.options as any).getInteger(
			'species-id'
		) as number | undefined

		const prevPendingName = Fakemon.pendingCatchSpecies?.name as
			| string
			| undefined

		let image: Buffer

		try {
			const result = await SpawnFakemonUtil(speciesId)

			image = result.image
		} catch {
			return void interaction.reply({
				content: 'Error fetching poke api',
				ephemeral: true,
			})
		}

		interaction.reply({ content: 'Okay', ephemeral: true })

		const embed = CreateSpawnFakemonEmbed(
			interaction.client,
			image,
			prevPendingName
		)

		interaction.channel.send({
			embeds: [embed.embed],
			files: embed.files,
		})
	},
}

export default SpawnFakemon
