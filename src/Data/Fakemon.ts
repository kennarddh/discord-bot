interface IFakemon {
	pendingCatchSpecies: { id: number; name: string; hint: string } | null
}

const Fakemon: IFakemon = {
	pendingCatchSpecies: null,
}

export default Fakemon
