import mongoose, { Schema } from 'mongoose'

import { UUID } from 'crypto'
import { IValues } from '../Types'

export interface IFakemon {
	speciesId: number
	experience: number
	originalTrainer: string
	individualValues: IValues
	effortValues: IValues
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
					individualValues: {
						health: {
							type: Number,
							required: true,
							min: 0,
							max: 65535,
						},
						attack: {
							type: Number,
							required: true,
							min: 0,
							max: 65535,
						},
						defense: {
							type: Number,
							required: true,
							min: 0,
							max: 65535,
						},
						specialAttack: {
							type: Number,
							required: true,
							min: 0,
							max: 65535,
						},
						specialDefense: {
							type: Number,
							required: true,
							min: 0,
							max: 65535,
						},
						speed: {
							type: Number,
							required: true,
							min: 0,
							max: 65535,
						},
					},
					effortValues: {
						health: {
							type: Number,
							required: true,
							min: 0,
							max: 65535,
						},
						attack: {
							type: Number,
							required: true,
							min: 0,
							max: 65535,
						},
						defense: {
							type: Number,
							required: true,
							min: 0,
							max: 65535,
						},
						specialAttack: {
							type: Number,
							required: true,
							min: 0,
							max: 65535,
						},
						specialDefense: {
							type: Number,
							required: true,
							min: 0,
							max: 65535,
						},
						speed: {
							type: Number,
							required: true,
							min: 0,
							max: 65535,
						},
					},
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
