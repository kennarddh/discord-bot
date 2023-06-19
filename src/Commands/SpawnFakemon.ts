import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'

import { ICommand } from './Types'
import SendAsOtherPerson from '../Utils/SendAsOtherPerson.js'
import RandomInt from '../Utils/RandomInt.js'
import Fakemon from '../Data/Fakemon.js'
import RandomlyReplaceCharacters from '../Utils/RandomlyReplaceCharacters.js'

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
		if (Fakemon.pendingCatchSpecies)
			return void interaction.reply({
				content: 'Error pending catch already spawned',
				ephemeral: true,
			})

		const speciesId =
			(interaction.options as any).getInteger('species-id') ||
			(RandomInt(1, 1010) as number)

		const pokeApiResultRaw = await fetch(
			`https://pokeapi.co/api/v2/pokemon/${speciesId}`
		).catch(() => {
			interaction.reply({
				content: 'Error fetching poke api',
				ephemeral: true,
			})
		})

		if (!pokeApiResultRaw) return

		const pokeApiResult = await pokeApiResultRaw.json()

		const name = (pokeApiResult.name as string)
			.split('-')
			.map(
				part => `${part.slice(0, 1).toUpperCase()}${part.substring(1)}`
			)
			.join(' ')

		const imageUrl = `https://server.poketwo.io/image?time=day&species=${speciesId}`

		interaction.reply({ content: 'Okay', ephemeral: true })

		const exampleEmbed = new EmbedBuilder()
			.setColor(0xfe9ac9)
			.setTitle('A wild fakemon has appeared!')
			.setDescription(
				`Guess the fakemon and type \`@${interaction.client.user.username} catch <fakemon>\` to catch it!`
			)
			.setImage(imageUrl)

		interaction.channel.send({
			embeds: [exampleEmbed],
		})

		Fakemon.pendingCatchSpecies = {
			id: speciesId,
			name,
			hint: RandomlyReplaceCharacters(name, 0.5),
		}
	},
}

export default SpawnFakemon
