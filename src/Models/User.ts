import mongoose, { Schema } from 'mongoose'

export interface IUser {
	id: string
}

const User = new Schema<IUser>(
	{
		id: { type: String, required: true },
	},
	{ timestamps: true, _id: false }
)

export default mongoose.model('users', User)
