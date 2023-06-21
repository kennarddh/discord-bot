export interface IFakemon {
	pendingCatchSpecies: ISpecies | null
}

export interface ISpecies {
	id: number
	name: string
	hint: string
	individualValues: number
	level: number
	image: Buffer
}

const Fakemon: IFakemon = {
	pendingCatchSpecies: null,
}

export default Fakemon
