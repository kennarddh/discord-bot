import { SlashCommandBuilder } from 'discord.js'

import { ICommand } from './Types'
import CreateErrorMessage from '../Utils/CreateErrorMessage.js'

const Say: ICommand = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Say in current channel')
		.addStringOption(option =>
			option
				.setRequired(true)
				.setName('message')
				.setDescription('Message to be send')
		)
		.addIntegerOption(option =>
			option
				.setRequired(true)
				.setName('count')
				.setDescription('Message count')
				.setMinValue(1)
				.setMaxValue(100)
		)
		.addIntegerOption(option =>
			option
				.setRequired(true)
				.setName('delay')
				.setDescription('Delay between messages in milliseconds')
				.setMinValue(1000)
		) as SlashCommandBuilder,
	async execute(interaction) {
		const message = (interaction.options as any).getString(
			'message'
		) as string
		const count = (interaction.options as any).getInteger('count') as number
		const delay = (interaction.options as any).getInteger('delay') as number

		let sentMessageCount = 0

		const intervalId = setInterval(async () => {
			if (sentMessageCount >= count) return clearInterval(intervalId)

			sentMessageCount += 1

			const sentMessage = await interaction.channel
				.send(message)
				.catch(() => {})

			if (!sentMessage)
				return void interaction.followUp(
					await CreateErrorMessage(interaction.client)
				)
		}, delay)

		interaction.reply('Okay')
	},
}

export default Say
