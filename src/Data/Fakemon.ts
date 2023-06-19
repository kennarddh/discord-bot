export interface IFakemon {
	pendingCatchSpecies: ISpecies | null
}

export interface ISpecies {
	id: number
	name: string
	hint: string
	image: Buffer
}

const Fakemon: IFakemon = {
	pendingCatchSpecies: null,
}

export default Fakemon
