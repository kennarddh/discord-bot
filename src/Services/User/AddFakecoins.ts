import User from '../../Models/User.js'

interface ICreateParameters {
	id: string
	fakecoins: number
}

type ICreate = (options: ICreateParameters) => Promise<void>

const AddUserFakecoins: ICreate = ({ id, fakecoins }) =>
	new Promise<void>((resolve, reject) => {
		User.updateOne({ _id: id }, { $inc: { fakecoins } })
			.then(user => {
				if (user.matchedCount !== 1) return reject({ code: 404 })
				if (!user.acknowledged) return reject({ code: 500 })

				console.info('Add fakecoins user success', {
					_id: id,
				})

				resolve()
			})
			.catch(error => {
				console.error('Add fakecoins user to database failed', {
					id,
					error,
				})

				reject({ code: 500 })
			})
	})

export default AddUserFakecoins
