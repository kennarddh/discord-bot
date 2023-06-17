import { Guild, SlashCommandBuilder, TextChannel } from 'discord.js'

import { ICommand } from './Types'

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

		const member = await interaction.guild.members.fetch(otherUser.id)

		const name = member.displayName || member.nickname || otherUser.username

		interaction.reply({ content: 'Okay', ephemeral: true })

		const webhook = await (interaction.channel as TextChannel)
			.createWebhook({
				name: name,
				avatar: member.displayAvatarURL(),
			})
			.catch(() => {
				interaction.reply({ content: 'Error', ephemeral: true })
			})

		if (!webhook) return

		try {
			await webhook.send({
				content: message,
			})

			await webhook.delete()
		} catch {
			interaction.reply({ content: 'Error', ephemeral: true })
		}
	},
}

export default Sudo
