import 'dotenv/config'

import { REST, Routes } from 'discord.js'

import Commands from './Commands/index.js'

const commands = Commands.map(command => command.data.toJSON())

const rest = new REST().setToken(process.env.DISCORD_TOKEN)

try {
	console.log(
		`Started refreshing ${commands.length} application (/) commands.`
	)

	// The put method is used to fully refresh all commands in the guild with the current set
	const data = await rest.put(
		Routes.applicationCommands(
			process.env.CLIENT_ID
			// '1119544327996182633'
		),
		{ body: commands }
	)

	console.log(
		`Successfully reloaded ${
			(data as any).length
		} application (/) commands.`
	)
} catch (error) {
	// And of course, make sure you catch and log any errors!
	console.error(error)
}
