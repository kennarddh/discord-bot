const RandomInt = (min: number, max: number) =>
	Math.round(Math.random() * (max - min)) + min

export default RandomInt
