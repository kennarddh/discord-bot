import { Client, EmbedBuilder } from 'discord.js'

const CreateSpawnFakemonEmbed = (
	client: Client,
	imageUrl: string,
	prevPendingName?: string
) => {
	return new EmbedBuilder()
		.setColor(0xfe9ac9)
		.setTitle(
			`${
				prevPendingName ? `Wild ${prevPendingName} fled. ` : ''
			}A wild fakemon has appeared!`
		)
		.setDescription(
			`Guess the fakemon and type \`@${client.user.username} catch <fakemon>\` to catch it!`
		)
		.setImage(imageUrl)
}

export default CreateSpawnFakemonEmbed