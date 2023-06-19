const AsyncFilter = async <T>(
	arr: T[],
	predicate: (input: T) => Promise<boolean>
) => {
	const results = await Promise.allSettled(arr.map(predicate))

	const successResults = results.filter(
		result => result.status === 'fulfilled'
	) as PromiseFulfilledResult<boolean>[]

	return arr.filter((_, index) => successResults[index].value)
}

export default AsyncFilter
