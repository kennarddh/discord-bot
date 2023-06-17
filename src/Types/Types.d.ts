import { Collection } from 'discord.js'
import { ICommand } from '../Commands/Types'

declare namespace NodeJS {
	interface ProcessEnv {
		DISCORD_TOKEN: string
		CLIENT_ID: string
	}
}
