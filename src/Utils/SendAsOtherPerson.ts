import {
	Channel,
	Guild,
	WebhookMessageCreateOptions,
	TextChannel,
} from 'discord.js'

const SendAsOtherPerson = async (
	guild: Guild,
	channel: Channel,
	userId: string,
	message: WebhookMessageCreateOptions,
	onError: (error: Error) => void
) => {
	const member = await guild.members.fetch(userId)

	const name = member.displayName || member.nickname

	const webhook = await (channel as TextChannel)
		.createWebhook({
			name: name,
			avatar: member.displayAvatarURL(),
		})
		.catch(onError)

	if (!webhook) return

	try {
		await webhook.send(message)

		await webhook.delete()
	} catch (error) {
		onError(error)
	}
}

export default SendAsOtherPerson
