import { IValues } from '../Types'
import RandomInt from './RandomInt.js'

const GenerateRandomIndividualValues = (): IValues => ({
	health: RandomInt(0, 31),
	attack: RandomInt(0, 31),
	defense: RandomInt(0, 31),
	specialAttack: RandomInt(0, 31),
	specialDefense: RandomInt(0, 31),
	speed: RandomInt(0, 31),
})

export default GenerateRandomIndividualValues
