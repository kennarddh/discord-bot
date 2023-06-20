import path from 'path'
import { Canvas, loadImage } from 'canvas'

import Fakemon, { ISpecies } from '../Data/Fakemon.js'
import RandomInt from './RandomInt.js'
import RandomlyReplaceCharacters from './RandomlyReplaceCharacters.js'
import GetPublicDir from './GetPublicDir.js'
import Pokedex from '../Data/Pokedex.js'

const SpawnFakemon = async (id?: number): Promise<ISpecies | undefined> => {
	const speciesId = id || RandomInt(1, 1010)

	const fakemon = await Pokedex.getPokemonByName(speciesId).catch(() => {})

	if (!fakemon) return

	const name = fakemon.name
		.split('-')
		.map(part => `${part.slice(0, 1).toUpperCase()}${part.substring(1)}`)
		.join(' ')

	const imageUrl = fakemon.sprites.front_default

	const image = await loadImage(imageUrl).catch(() => {})
	const background = await loadImage(
		path.join(GetPublicDir(), 'pokemon-background.png')
	).catch(() => {})

	if (!image) return
	if (!background) return

	const canvas = new Canvas(800, 450)

	const ctx = canvas.getContext('2d')

	ctx.drawImage(background, 0, 0, 800, 450)

	ctx.drawImage(image, 250, 0, 500, 500)

	const scaledImage = canvas.toBuffer()

	const hint = RandomlyReplaceCharacters(name, 0.5)

	Fakemon.pendingCatchSpecies = {
		id: speciesId,
		name,
		hint,
		image: scaledImage,
	}

	return Fakemon.pendingCatchSpecies
}

export default SpawnFakemon
