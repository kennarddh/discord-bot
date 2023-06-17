import { Collection } from 'discord.js'

declare namespace NodeJS {
	interface ProcessEnv {
		DISCORD_TOKEN: string
	}
}
