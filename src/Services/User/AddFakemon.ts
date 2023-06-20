import User, { IFakemon } from '../../Models/User.js'

interface ICreateParameters {
	id: string
	fakemon: IFakemon
}

type ICreate = (options: ICreateParameters) => Promise<void>

const AddUserFakemon: ICreate = ({ id, fakemon }) =>
	new Promise<void>((resolve, reject) => {
		User.updateOne({ _id: id }, { $push: { fakemons: fakemon } })
			.then(user => {
				if (user.matchedCount !== 1) return reject({ code: 404 })
				if (!user.acknowledged) return reject({ code: 500 })

				console.info('Add fakemon user success', {
					_id: id,
				})

				resolve()
			})
			.catch(error => {
				console.error('Add fakemon user to database failed', {
					id,
					error,
				})

				reject({ code: 500 })
			})
	})

export default AddUserFakemon
