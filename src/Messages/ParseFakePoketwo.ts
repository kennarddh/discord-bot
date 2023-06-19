import { Message } from 'discord.js'
import SendAsOtherPerson from '../Utils/SendAsOtherPerson.js'
import Poketwo from '../Data/Poketwo.js'
import RandomInt from '../Utils/RandomInt.js'
import RandomlyReplaceCharacters from '../Utils/RandomlyReplaceCharacters.js'

const ParseFakePoketwo = (message: Message<boolean>, commands: string[]) => {
	if (commands[0] === 'catch' && commands[1] && Poketwo.pendingCatchSpecies) {
		const guess = commands.slice(1).join(' ')

		if (
			Poketwo.pendingCatchSpecies.name.toLowerCase() !==
			guess.toLowerCase()
		)
			return SendAsOtherPerson(
				message.guild,
				message.channel,
				process.env.POKETWO_ID,
				{
					content: `That is the wrong pokémon!`,
				},
				() => {}
			)

		SendAsOtherPerson(
			message.guild,
			message.channel,
			process.env.POKETWO_ID,
			{
				content: `Congratulations ${
					message.author
				}! You caught a level ${RandomInt(1, 100)} ${
					Poketwo.pendingCatchSpecies.name
				}! Added to Pokédex. You received 35 Pokécoins!`,
			},
			() => {}
		)

		Poketwo.pendingCatchSpecies = null
	} else if (commands[0] === 'hint' && Poketwo.pendingCatchSpecies) {
		SendAsOtherPerson(
			message.guild,
			message.channel,
			process.env.POKETWO_ID,
			{
				content: `The pokémon is ${Poketwo.pendingCatchSpecies.hint}.`,
			},
			() => {}
		)
	}
}

export default ParseFakePoketwo
