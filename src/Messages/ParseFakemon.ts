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
import AddUserFakemon from '../Services/User/AddFakemon.js'
import {
	ExperienceToLevel,
	LevelToExperience,
} from '../Utils/ExperienceLevel.js'
import AddUserFakecoins from '../Services/User/AddFakecoins.js'
import { IUser } from '../Models/User.js'
import {
	CalculateHealthStat,
	CalculateOtherStat,
} from '../Utils/CalculateStat.js'

const ParseFakemon = async (message: Message<boolean>, commands: string[]) => {
	let isUserExist: boolean = true
	let user: IUser

	try {
		// Doesn't need the user just if catched then the user doesn't exist or server error
		const resolve = await FindUserById({ id: message.author.id })

		user = resolve.user
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
			if (!commands[1]) return message.reply('Fakemon id must exist.')

			const starterFakemonId = parseInt(commands[1], 10)

			if (Number.isNaN(starterFakemonId))
				return message.reply('Fakemon id must be a number.')

			if (starterFakemonId < 1)
				return message.reply('Fakemon id must be greater than 1.')
			if (starterFakemonId > 1010)
				return message.reply('Fakemon id must be less than 1010.')

			if (!StarterFakemons.includes(starterFakemonId))
				return message.reply(
					'Fakemon id must be in starter Fakemon list.'
				)

			const fakemon = await Pokedex.getPokemonByName(
				starterFakemonId
			).catch(error => console.log(error))

			if (!fakemon)
				return message.reply(await CreateErrorMessage(message.client))

			const createResult = await CreateUser({
				id: message.author.id,
				fakemons: new Map(),
			}).catch(error => console.log(error))

			if (!createResult)
				return message.reply(await CreateErrorMessage(message.client))

			const addFakemonResult = await AddUserFakemon({
				userId: createResult.user._id,
				fakemon: {
					speciesId: starterFakemonId,
					experience: LevelToExperience(5),
					originalTrainer: createResult.user._id,
					individualValues: RandomInt(0, 31),
					effortValues: {
						health: 0,
						attack: 0,
						defense: 0,
						specialAttack: 0,
						specialDefense: 0,
						speed: 0,
					},
				},
			})

			if (!addFakemonResult)
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
					)} as starter Fakemon.`
				)
				.setImage('attachment://image.png')

			return message.reply({
				embeds: [imageEmbed],
				files: [imageAttachment],
			})
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

		const level = Fakemon.pendingCatchSpecies.level
		const individualValues = Fakemon.pendingCatchSpecies.individualValues

		const bonusFakecoins = 35

		try {
			await AddUserFakemon({
				userId: message.author.id,
				fakemon: {
					speciesId: Fakemon.pendingCatchSpecies.id,
					experience: LevelToExperience(level),
					originalTrainer: user._id,
					individualValues,
					effortValues: {
						health: 0,
						attack: 0,
						defense: 0,
						specialAttack: 0,
						specialDefense: 0,
						speed: 0,
					},
				},
			})

			await AddUserFakecoins({
				id: message.author.id,
				fakecoins: bonusFakecoins,
			})
		} catch ({ code }) {
			if (typeof code !== 'number')
				return message.reply(await CreateErrorMessage(message.client))

			if (code === 500)
				return message.reply(await CreateErrorMessage(message.client))

			if (code === 404)
				return message.reply(await CreateErrorMessage(message.client))
		}

		message.reply({
			content: `Congratulations ${message.author}! You caught a level ${level} ${Fakemon.pendingCatchSpecies.name} with ${individualValues}/31 individual values! Added to Fakedex. You received ${bonusFakecoins} Fakecoins!`,
		})

		Fakemon.pendingCatchSpecies = null
	} else if (commands[0] === 'hint' && Fakemon.pendingCatchSpecies) {
		message.reply({
			content: `The fakemon is \`${Fakemon.pendingCatchSpecies.hint}\`.`,
		})
	} else if (commands[0] === 'balance') {
		if (!commands[1]) {
			return message.reply({
				content: `<@${message.author.id}>'s fakecoins is ${user.fakecoins}`,
			})
		}

		if (
			!(
				commands[1].startsWith('<@') &&
				!commands[1].startsWith('<@&') &&
				commands[1].endsWith('>')
			)
		)
			return message.reply({
				content: `\`${commands[1]}\` is not a valid user`,
			})

		const userId = commands[1].slice(2, -1)

		try {
			const targetUser = await FindUserById({ id: userId })

			return message.reply({
				content: `<@${userId}>'s fakecoins is ${targetUser.user.fakecoins}`,
			})
		} catch ({ code }) {
			if (typeof code !== 'number')
				return message.reply(await CreateErrorMessage(message.client))

			if (code === 500)
				return message.reply(await CreateErrorMessage(message.client))

			if (code === 404)
				return message.reply(
					`User <@${userId}> hasn't started Fakemon adventure`
				)
		}
	} else if (commands[0] === 'fakemon') {
		const fakemonValues = [...user.fakemons.values()]
		const fakemons = await Pokedex.getPokemonByName(
			fakemonValues.map(fakemon => fakemon.speciesId)
		).catch(error => console.log(error))

		if (!fakemons)
			return message.reply(await CreateErrorMessage(message.client))

		const fakemonsResult = fakemons.map((fakemon, index) => ({
			index,
			name: FormatPokeApiName(fakemon.name),
			level: Math.round(
				ExperienceToLevel(fakemonValues[index].experience)
			),
			individualValues: fakemonValues[index].individualValues,
		}))

		const list = fakemonsResult
			.map(
				fakemon =>
					`\`${fakemon.index}\`. ${fakemon.name}, Level: ${fakemon.level}/100, IV: ${fakemon.individualValues}/31`
			)
			.join('\n')

		message.reply({
			content: `<@${message.author.id}>'s fakemons\n\n${list}`,
		})
	} else if (commands[0] === 'info') {
		if (!commands[1]) return message.reply('Fakemon id must exist.')

		const fakemonIndex = parseInt(commands[1], 10)

		if (Number.isNaN(fakemonIndex))
			return message.reply('Fakemon id must be a number.')

		if (fakemonIndex < 0)
			return message.reply('Fakemon index cannot be smaller than 0.')

		const fakemons = [...user.fakemons.values()]

		if (fakemonIndex > fakemons.length - 1)
			return message.reply(
				`Cannot find Fakemon with index ${fakemonIndex}. Your maximum index is ${
					fakemons.length - 1
				}.`
			)

		const fakemonDB = fakemons[fakemonIndex]

		const fakemon = await Pokedex.getPokemonByName(
			fakemonDB.speciesId
		).catch(error => console.log(error))

		if (!fakemon)
			return message.reply(await CreateErrorMessage(message.client))

		const level = ExperienceToLevel(fakemonDB.experience)
		const requiredXP =
			LevelToExperience(level + 1) - LevelToExperience(level)
		const currentXP = fakemonDB.experience - LevelToExperience(level)

		const name = FormatPokeApiName(fakemon.name)

		const iv = fakemonDB.individualValues
		const ev = fakemonDB.effortValues

		const health = CalculateHealthStat(
			fakemon.stats[0].base_stat,
			iv,
			ev.health,
			level
		)
		const attack = CalculateOtherStat(
			fakemon.stats[1].base_stat,
			iv,
			ev.attack,
			level
		)
		const defense = CalculateOtherStat(
			fakemon.stats[2].base_stat,
			iv,
			ev.defense,
			level
		)
		const specialAttack = CalculateOtherStat(
			fakemon.stats[3].base_stat,
			iv,
			ev.specialAttack,
			level
		)
		const specialDefense = CalculateOtherStat(
			fakemon.stats[4].base_stat,
			iv,
			ev.specialDefense,
			level
		)
		const speed = CalculateOtherStat(
			fakemon.stats[5].base_stat,
			iv,
			ev.speed,
			level
		)

		const imageBuffer = await GenerateFakemonImage(
			fakemon.sprites.front_default
		).catch(error => console.log(error))

		if (!imageBuffer)
			return message.reply(await CreateErrorMessage(message.client))

		const image = new AttachmentBuilder(imageBuffer).setName('image.png')

		const embed = new EmbedBuilder()
			.setTitle(`Level ${level} ${name}`)
			.setImage('attachment://image.png')
			.setColor(0xfe9ac9)
			.setDescription(
				[
					'**Details**',
					`**XP**: ${
						level >= 100 ? 'Maxed' : `${currentXP}/${requiredXP}`
					}`,
					`**Height**: ${fakemon.height}`,
					`**Weight**: ${fakemon.weight}`,
					`**Types**: ${fakemon.types
						.map(type => FormatPokeApiName(type.type.name))
						.join(', ')}`,
					'',
					'**Stats**',
					`**Health**: ${health}`,
					`**Attack**: ${attack}`,
					`**Defense**: ${defense}`,
					`**Special Attack**: ${specialAttack}`,
					`**Special Defense**: ${specialDefense}`,
					`**Speed**: ${speed}`,
					`**Individual Values**: ${iv}/31`,
					`**Health Effort Values**: ${ev.health}/65535`,
					`**Attack Effort Values**: ${ev.attack}/65535`,
					`**Defense Effort Values**: ${ev.defense}/65535`,
					`**Special Attack Effort Values**: ${ev.specialAttack}/65535`,
					`**Special Defense Effort Values**: ${ev.specialDefense}/65535`,
					`**Speed Effort Values**: ${ev.speed}/65535`,
				].join('\n')
			)

		message.reply({ embeds: [embed], files: [image] })
	}
}

export default ParseFakemon
