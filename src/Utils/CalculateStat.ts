export const CalculateHealthStat = (
	base: number,
	iv: number,
	ev: number,
	level: number
) =>
	Math.floor(0.01 * (2 * base + iv + Math.floor(0.25 * ev)) * level) +
	level +
	10

export const CalculateOtherStat = (
	base: number,
	iv: number,
	ev: number,
	level: number,
	nature: number = 1
) =>
	(Math.floor(0.01 * (2 * base + iv + Math.floor(0.25 * ev)) * level) + 5) *
	nature
