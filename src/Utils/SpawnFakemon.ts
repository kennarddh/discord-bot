import Fakemon, { ISpecies } from '../Data/Fakemon.js'
import RandomInt from './RandomInt.js'
import RandomlyReplaceCharacters from './RandomlyReplaceCharacters.js'
import Pokedex from '../Data/Pokedex.js'
import FormatPokeApiName from './FormatPokeApiName.js'
import GenerateFakemonImage from './GenerateFakemonImage.js'

const SpawnFakemon = async (id?: number): Promise<ISpecies | undefined> => {
	const speciesId = id || RandomInt(1, 1010)

	const fakemon = await Pokedex.getPokemonByName(speciesId).catch(() => {})

	if (!fakemon) return

	const name = FormatPokeApiName(fakemon.name)

	const imageUrl = fakemon.sprites.front_default

	const image = await GenerateFakemonImage(imageUrl)

	if (!image) return

	const hint = RandomlyReplaceCharacters(name, 0.5)

	Fakemon.pendingCatchSpecies = {
		id: speciesId,
		name,
		hint,
		image,
	}

	return Fakemon.pendingCatchSpecies
}

export default SpawnFakemon
