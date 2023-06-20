import { UUID } from 'crypto'

import User, { IFakemon } from '../../Models/User.js'

interface IUpdateUserFakemonParameters {
	userId: string
	fakemonId: UUID
	fakemon: Partial<IFakemon>
}

type IUpdateUserFakemon = (
	options: IUpdateUserFakemonParameters
) => Promise<void>

const UpdateUserFakemon: IUpdateUserFakemon = ({
	userId,
	fakemonId,
	fakemon,
}) =>
	new Promise<void>((resolve, reject) => {
		User.updateOne(
			{ _id: userId },
			{ $addFields: { [`fakemons.${fakemonId}`]: fakemon } }
		)
			.then(user => {
				if (user.matchedCount !== 1) return reject({ code: 404 })
				if (!user.acknowledged) return reject({ code: 500 })

				console.info('Update fakemon user success', {
					_id: userId,
				})

				resolve()
			})
			.catch(error => {
				console.error('Update fakemon user to database failed', {
					userId,
					error,
				})

				reject({ code: 500 })
			})
	})

export default UpdateUserFakemon
