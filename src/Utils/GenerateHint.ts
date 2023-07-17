import RandomBoolean from './RandomBoolean.js'

const GenerateHint = (str: string) =>
	str
		.split('')
		.map(char => (char === ' ' ? ' ' : RandomBoolean(0.5) ? char : '_'))
		.join('')

export default GenerateHint
