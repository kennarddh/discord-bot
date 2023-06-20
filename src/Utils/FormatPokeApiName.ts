const FormatPokeApiName = (name: string) =>
	name
		.split('-')
		.map(part => `${part.slice(0, 1).toUpperCase()}${part.substring(1)}`)
		.join(' ')

export default FormatPokeApiName
