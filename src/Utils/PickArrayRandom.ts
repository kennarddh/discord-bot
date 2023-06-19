const PickArrayRandom = <T>(arr: T[]): T | undefined =>
	arr[Math.floor(Math.random() * arr.length)]

export default PickArrayRandom
