import mongoose, { Schema, Types } from 'mongoose'

import { UUID } from 'crypto'

export interface IFakemon {
	speciesId: number
	experience: number
	originalTrainer: string
}

export type IFakemons = Map<UUID, IFakemon>

export interface IUser {
	_id: string
	fakemons: IFakemons
	fakecoins: number
}

const User = new Schema<IUser>(
	{
		_id: { type: String, required: true },
		fakemons: {
			type: Map,
			of: new Schema(
				{
					speciesId: { type: Number, required: true },
					experience: { type: Number, required: true },
					originalTrainer: {
						type: String,
						ref: 'users',
						required: true,
					},
				},
				{ _id: false, timestamps: true }
			),
		},
		fakecoins: { type: Number, required: true, default: 0, min: 0 },
	},
	{ timestamps: true, _id: false }
)

export default mongoose.model('users', User)
