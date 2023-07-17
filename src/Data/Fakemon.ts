import { IValues } from '../Types'

export interface IFakemon {
	pendingCatchSpecies: ISpecies | null
}

export interface ISpecies {
	id: number
	name: string
	hint: string
	individualValues: IValues
	level: number
	image: Buffer
}

const Fakemon: IFakemon = {
	pendingCatchSpecies: null,
}

export default Fakemon
