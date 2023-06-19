import RandomBoolean from './RandomBoolean.js'

const RandomlyReplaceCharacters = (str: string, trueChance: number) => {
	let newStr = ''

	for (const char of str) {
		if (RandomBoolean(trueChance)) {
			newStr += char
		} else {
			newStr += '_'
		}
	}

	return newStr
}

export default RandomlyReplaceCharacters
