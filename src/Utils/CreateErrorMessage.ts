import { Client } from 'discord.js'

const CreateErrorMessage = async (client: Client) => {
	await client.application.fetch().catch(() => {})

	return {
		content: `Error occurred. Try again later. If the error persists for several times. Tag ${client.application.owner}.`,
	}
}

export default CreateErrorMessage
