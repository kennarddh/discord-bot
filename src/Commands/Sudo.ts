import { SlashCommandBuilder } from 'discord.js'

import { ICommand } from './Types'
import SendAsOtherPerson from '../Utils/SendAsOtherPerson.js'

const Sudo: ICommand = {
	data: new SlashCommandBuilder()
		.setName('sudo')
		.setDescription('Chat as other user!')
		.addUserOption(option =>
			option
				.setName('other-user')
				.setDescription('Other User To Chat As')
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName('message')
				.setDescription('Other User Chat Message')
				.setRequired(true)
		) as SlashCommandBuilder,
	async execute(interaction) {
		const otherUser = interaction.options.getUser('other-user')
		const message = (interaction.options as any).getString(
			'message'
		) as string

		interaction.reply({ content: 'Okay', ephemeral: true })

		SendAsOtherPerson(
			interaction.guild,
			interaction.channel,
			otherUser.id,
			{
				content: message,
			},
			() => {
				interaction.reply({ content: 'Error', ephemeral: true })
			}
		)
	},
}

export default Sudo
