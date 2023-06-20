import mongoose, { Schema } from 'mongoose'

export interface IFakemon {
	id: number
	experience: number
}

export interface IUser {
	_id: string
	fakemons: IFakemon[]
}

const User = new Schema<IUser>(
	{
		_id: { type: String, required: true },
		fakemons: [
			{
				id: { type: Number, required: true },
				experience: { type: Number, required: true },
			},
		],
	},
	{ timestamps: true, _id: false }
)

export default mongoose.model('users', User)
