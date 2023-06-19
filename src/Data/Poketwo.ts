interface IPoketwo {
	pendingCatchSpecies: { id: number; name: string; hint: string } | null
}

const Poketwo: IPoketwo = {
	pendingCatchSpecies: null,
}

export default Poketwo
