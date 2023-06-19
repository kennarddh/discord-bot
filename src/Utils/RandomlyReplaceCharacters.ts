import RandomBoolean from './RandomBoolean.js'

const RandomlyReplaceCharacters = (str: string, trueChance: number) =>
	str
		.split('')
		.map(char => (RandomBoolean(trueChance) ? char : '_'))
		.join('')

export default RandomlyReplaceCharacters
