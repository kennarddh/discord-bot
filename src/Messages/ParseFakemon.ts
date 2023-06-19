import { Message } from 'discord.js'
import Fakemon from '../Data/Fakemon.js'
import RandomInt from '../Utils/RandomInt.js'

const ParseFakemon = (message: Message<boolean>, commands: string[]) => {
	if (commands[0] === 'catch' && commands[1] && Fakemon.pendingCatchSpecies) {
		const guess = commands.slice(1).join(' ')

		if (
			Fakemon.pendingCatchSpecies.name.toLowerCase() !==
			guess.toLowerCase()
		)
			return message.channel.send({
				content: `That is the wrong Fakemon!`,
			})

		message.channel.send({
			content: `Congratulations ${
				message.author
			}! You caught a level ${RandomInt(1, 100)} ${
				Fakemon.pendingCatchSpecies.name
			}! Added to Fakedex. You received 35 Fakecoins!`,
		})

		Fakemon.pendingCatchSpecies = null
	} else if (commands[0] === 'hint' && Fakemon.pendingCatchSpecies) {
		message.channel.send({
			content: `The fakemon is ${Fakemon.pendingCatchSpecies.hint}.`,
		})
	}
}

export default ParseFakemon
