import { EmbedBuilder, SlashCommandBuilder, TextChannel } from 'discord.js'

import { ICommand } from './Types'

const SpawnPoketwo: ICommand = {
	data: new SlashCommandBuilder()
		.setName('spawn-poketwo')
		.setDescription('Spawn Poketwo Pokemon'),
	async execute(interaction) {
		const imageUrl = `https://server.poketwo.io/image?time=day&t=${
			Math.random() * 1000
		}` // Use param `t` to bypass discord cache

		const poketwoId = '716390085896962058'

		const member = await interaction.guild.members.fetch(poketwoId)

		const name = member.displayName || member.nickname

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

		const exampleEmbed = new EmbedBuilder()
			.setColor(0xfe9ac9)
			.setTitle('A wild pokémon has appeared!')
			.setDescription(
				'Guess the pokémon and type `@Pokétwo#8236 catch <pokémon>` to catch it!'
			)
			.setImage(imageUrl)

		try {
			await webhook.send({
				embeds: [exampleEmbed],
			})

			await webhook.delete()
		} catch {
			interaction.reply({ content: 'Error', ephemeral: true })
		}
	},
}

export default SpawnPoketwo
