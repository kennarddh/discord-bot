import User, { IFakemons, IUser } from '../../Models/User.js'

interface ICreateParameters {
	id: string
	fakemons: IFakemons
}

interface IResolve {
	user: IUser
}

type ICreate = (options: ICreateParameters) => Promise<IResolve>

const CreateUser: ICreate = ({ id, fakemons }) =>
	new Promise<IResolve>((resolve, reject) => {
		const user = new User({ _id: id, fakemons })

		user.save()
			.then(() => {
				console.info('Create user success', {
					_id: user._id,
				})

				resolve({ user: user.toObject() })
			})
			.catch(error => {
				console.error('Create user to database failed', {
					id: user.id,
					error,
				})

				reject({ code: 500 })
			})
	})

export default CreateUser
