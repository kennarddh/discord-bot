import { SlashCommandBuilder } from 'discord.js'

import { ICommand } from './Types'

const GiveRole: ICommand = {
	data: new SlashCommandBuilder()
		.setName('give-role')
		.setDescription('Give role to the user who run this command')
		.addRoleOption(option =>
			option.setRequired(true).setName('role').setDescription('Role')
		) as SlashCommandBuilder,
	async execute(interaction) {
		const role = (interaction.options as any).getRole('role') as number

		;(interaction.member.roles as any).add(role)

		interaction.reply({ ephemeral: true, content: 'done' })
	},
}

export default GiveRole
