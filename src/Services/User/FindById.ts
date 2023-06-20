import User, { IUser } from '../../Models/User.js'

interface IFindByIdParameters {
	id: string
}

interface IResolve {
	user: IUser
}

type IFindById = (options: IFindByIdParameters) => Promise<IResolve>

const FindUserById: IFindById = ({ id }) =>
	new Promise((resolve, reject) => {
		User.findById(id)
			.exec()
			.then(user => {
				if (!user) return reject({ code: 404 })

				resolve({ user })
			})
			.catch(error => {
				console.error('Find by id failed user service', {
					error,
				})

				reject({ code: 500 })
			})
	})

export default FindUserById
