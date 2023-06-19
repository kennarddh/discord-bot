import Fakemon from '../Data/Fakemon.js'
import RandomInt from './RandomInt.js'
import RandomlyReplaceCharacters from './RandomlyReplaceCharacters.js'

const SpawnFakemon = async (id?: number) => {
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

	const imageUrl = `https://server.poketwo.io/image?time=day&species=${speciesId}`

	const hint = RandomlyReplaceCharacters(name, 0.5)

	Fakemon.pendingCatchSpecies = {
		id: speciesId,
		name,
		hint,
	}

	return {
		speciesId,
		name,
		hint,
		imageUrl,
	}
}

export default SpawnFakemon
