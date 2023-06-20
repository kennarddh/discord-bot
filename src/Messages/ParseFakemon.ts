import { Message } from 'discord.js'
import Fakemon from '../Data/Fakemon.js'
import RandomInt from '../Utils/RandomInt.js'
import FindUserById from '../Services/User/FindById.js'
import CreateErrorMessage from '../Utils/CreateErrorMessage.js'

const ParseFakemon = async (message: Message<boolean>, commands: string[]) => {
	try {
		// Doesn't need the user just if catched then the user doesn't exist or server error
		await FindUserById({ id: message.author.id })
	} catch ({ code }) {
		if (typeof code !== 'number') return

		if (code === 500)
			return message.reply(await CreateErrorMessage(message.client))

		if (code === 404)
			return message.reply({
				content: `Start you Fakemon adventure. Run \`<@${message.client.user.id}> start\``,
			})
	}

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
