import Fakemon, { ISpecies } from '../Data/Fakemon.js'
import RandomInt from './RandomInt.js'
import RandomlyReplaceCharacters from './RandomlyReplaceCharacters.js'
import { Canvas, loadImage } from 'canvas'
const SpawnFakemon = async (id?: number): Promise<ISpecies | undefined> => {
	const speciesId = id || RandomInt(1, 1010)

	const pokeApiResultRaw = await fetch(
		`https://pokeapi.co/api/v2/pokemon/${speciesId}`
	)

	if (!pokeApiResultRaw) return

	const pokeApiResult = await pokeApiResultRaw.json()

	const name = (pokeApiResult.name as string)
		.split('-')
		.map(part => `${part.slice(0, 1).toUpperCase()}${part.substring(1)}`)
		.join(' ')

	const imageUrl = pokeApiResult.sprites.front_default

	const image = await loadImage(imageUrl).catch(() => {})

	if (!image) return

	const canvas = new Canvas(500, 500)

	const ctx = canvas.getContext('2d')

	ctx.drawImage(image, 0, 0, 500, 500)

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
