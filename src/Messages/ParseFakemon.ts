import { AttachmentBuilder, EmbedBuilder, Message } from 'discord.js'
import Fakemon from '../Data/Fakemon.js'
import RandomInt from '../Utils/RandomInt.js'
import FindUserById from '../Services/User/FindById.js'
import CreateErrorMessage from '../Utils/CreateErrorMessage.js'
import StarterFakemons from '../Constants/StarterFakemon.js'
import Pokedex from '../Data/Pokedex.js'
import FormatPokeApiName from '../Utils/FormatPokeApiName.js'
import GenerateFakemonImage from '../Utils/GenerateFakemonImage.js'
import CreateUser from '../Services/User/Create.js'

const ParseFakemon = async (message: Message<boolean>, commands: string[]) => {
	let isUserExist: boolean = true

	try {
		// Doesn't need the user just if catched then the user doesn't exist or server error
		await FindUserById({ id: message.author.id })
	} catch ({ code }) {
		if (typeof code !== 'number')
			return message.reply(await CreateErrorMessage(message.client))

		if (code === 500)
			return message.reply(await CreateErrorMessage(message.client))

		if (code === 404) isUserExist = false
	}

	if (commands[0] === 'start' || commands[0] === 'pick') {
		if (isUserExist)
			return message.reply({
				content: `Fakemon adventure already started`,
			})

		if (commands[0] === 'start') {
			const starterFakemons = await Pokedex.getPokemonByName(
				StarterFakemons
			).catch(error => console.log(error))

			if (!starterFakemons)
				return message.reply(await CreateErrorMessage(message.client))

			const runHelp = `Run \`@${message.client.user.tag} pick <id>\``

			const starterFakemonList = starterFakemons
				.map(
					fakemon =>
						`${fakemon.id}: ${FormatPokeApiName(fakemon.name)}`
				)
				.join('\n')

			return message.reply({
				content: `Pick your starter Fakemon\n\n${starterFakemonList}\n\n${runHelp}`,
			})
		}

		if (commands[0] === 'pick') {
			if (typeof commands[1] === 'number')
				return message.reply('Fakemon id must be a number')

			const starterFakemonid = parseInt(commands[1], 10)

			if (starterFakemonid < 1)
				return message.reply('Fakemon id must be greater than 1')
			if (starterFakemonid > 1010)
				return message.reply('Fakemon id must be less than 1010')

			const fakemon = await Pokedex.getPokemonByName(
				starterFakemonid
			).catch(error => console.log(error))

			if (!fakemon)
				return message.reply(await CreateErrorMessage(message.client))

			const createResult = await CreateUser({
				id: message.author.id,
				fakemons: [{ id: starterFakemonid, experience: 0 }],
			}).catch(error => console.log(error))

			if (!createResult)
				return message.reply(await CreateErrorMessage(message.client))

			const imageUrl = fakemon.sprites.front_default

			const image = await GenerateFakemonImage(imageUrl).catch(error =>
				console.log(error)
			)

			if (!image)
				return message.reply(await CreateErrorMessage(message.client))

			const imageAttachment = new AttachmentBuilder(image).setName(
				'image.png'
			)

			const imageEmbed = new EmbedBuilder()
				.setTitle(
					`@${message.author.tag} has started Fakemon adventure!`
				)
				.setDescription(
					`Chosed ${FormatPokeApiName(
						fakemon.name
					)} as starter pokemon.`
				)
				.setImage('attachment://image.png')

			return message.reply({ embeds: [imageEmbed], files: [imageAttachment] })
		}
	}

	if (!isUserExist)
		return message.reply({
			content: `Start your Fakemon adventure. Run \`@${message.client.user.tag} start\``,
		})

	if (commands[0] === 'catch' && commands[1] && Fakemon.pendingCatchSpecies) {
		const guess = commands.slice(1).join(' ')

		if (
			Fakemon.pendingCatchSpecies.name.toLowerCase() !==
			guess.toLowerCase()
		)
			return message.reply({
				content: 'That is the wrong Fakemon!',
			})

		message.reply({
			content: `Congratulations ${
				message.author
			}! You caught a level ${RandomInt(1, 100)} ${
				Fakemon.pendingCatchSpecies.name
			}! Added to Fakedex. You received 35 Fakecoins!`,
		})

		Fakemon.pendingCatchSpecies = null
	} else if (commands[0] === 'hint' && Fakemon.pendingCatchSpecies) {
		message.reply({
			content: `The fakemon is \`${Fakemon.pendingCatchSpecies.hint}\`.`,
		})
	}
}

export default ParseFakemon
