import { SlashCommandBuilder } from 'discord.js'

import { ICommand } from './Types'
import Pokedex from '../Data/Pokedex.js'
import CreateErrorMessage from '../Utils/CreateErrorMessage.js'
import FormatPokeApiName from '../Utils/FormatPokeApiName.js'

const GuessFakemon: ICommand = {
	data: new SlashCommandBuilder()
		.setName('guess-fakemon')
		.setDescription('Guess Fakemon')
		.addStringOption(option =>
			option.setRequired(true).setName('hints').setDescription('Hints')
		) as SlashCommandBuilder,
	async execute(interaction) {
		const hintsString = (interaction.options as any).getString('hints') as
			| string
			| undefined

		const hints = hintsString.split(',')

		const emptyHint = Array(hints[0].length).fill('_')

		const combinedHint = hints.reduce<string[]>((acc, hint) => {
			;[...hint].forEach((letter, i) => {
				if (acc[i] === '_' && letter !== '_') acc[i] = letter
			})

			return acc
		}, emptyHint)

		const combinedHintString = combinedHint.join('')

		const hintRegex = RegExp(
			`^${combinedHintString.replaceAll('_', '[^\\s]')}$`,
			'i'
		)

		const pokemons = await Pokedex.getPokemonsList({
			limit: 1000000,
			offset: 0,
		}).catch(() => {})

		if (!pokemons)
			return void interaction.reply(
				await CreateErrorMessage(interaction.client)
			)

		const fakemonNames = pokemons.results.map(pokemon =>
			FormatPokeApiName(pokemon.name).toLowerCase()
		)

		const validFakemon = fakemonNames.filter(pokemonName =>
			hintRegex.test(pokemonName)
		)

		const formatedValidFakemonNames = validFakemon.map(
			name => `\`${FormatPokeApiName(name)}\``
		)

		interaction.reply({
			content: `List of valid fakemon names based on the hints\n\n${formatedValidFakemonNames.join(
				'\n'
			)}`,
			ephemeral: true,
		})
	},
}

export default GuessFakemon
