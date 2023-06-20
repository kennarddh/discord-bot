import User, { IFakemon, IUser } from '../../Models/User.js'

interface ICreateParameters {
	id: string
	fakemons: IFakemon[]
}

interface IResolve {
	user: IUser
}

type ICreate = (options: ICreateParameters) => Promise<IResolve>

const CreateUser: ICreate = ({ id, fakemons }) =>
	new Promise<IResolve>((resolve, reject) => {
		const user = new User({ id, fakemons })

		user.save()
			.then(() => {
				console.info('Create user success', {
					id: user._id,
				})

				const userResolve: IUser = {
					id: user.id,
					fakemons: user.fakemons,
				}

				resolve({ user: userResolve })
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
