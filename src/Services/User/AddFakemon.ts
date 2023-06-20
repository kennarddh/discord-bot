import { UUID, randomUUID } from 'crypto'

import User, { IFakemon } from '../../Models/User.js'

interface ICreateParameters {
	userId: string
	fakemon: IFakemon
}

type ICreate = (options: ICreateParameters) => Promise<UUID>

const AddUserFakemon: ICreate = ({ userId, fakemon }) =>
	new Promise<UUID>((resolve, reject) => {
		const id = randomUUID()

		User.updateOne(
			{ _id: userId },
			{ $set: { [`fakemons.${id}`]: fakemon } }
		)
			.then(user => {
				if (user.matchedCount !== 1) return reject({ code: 404 })
				if (!user.acknowledged) return reject({ code: 500 })

				console.info('Add fakemon user success', {
					userId,
					id,
				})

				resolve(id)
			})
			.catch(error => {
				console.error('Add fakemon user to database failed', {
					userId,
					id,
				})

				reject({ code: 500 })
			})
	})

export default AddUserFakemon
