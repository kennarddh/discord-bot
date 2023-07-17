import { Client, EmbedBuilder, AttachmentBuilder } from 'discord.js'
import Fakemon from '../Data/Fakemon.js'

const CreateSpawnFakemonEmbed = (
	client: Client,
	imageBuffer: Buffer,
	prevPendingName?: string
) => {
	const image = new AttachmentBuilder(imageBuffer).setName('image.png')

	const embed = new EmbedBuilder()
		.setColor(0xfe9ac9)
		.setTitle(
			`${
				prevPendingName ? `Wild ${prevPendingName} fled. ` : ''
			}A wild Fakemon has appeared!`
		)
		.setDescription(
			`Level ${Fakemon.pendingCatchSpecies.level} Fakemon.\n\nGuess the Fakemon and type \`@${client.user.tag} catch <fakemon>\` to catch it!`
		)
		.setImage('attachment://image.png')

	return {
		embed,
		files: [image],
	}
}

export default CreateSpawnFakemonEmbed
