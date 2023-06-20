import mongoose from 'mongoose'

mongoose.connect(process.env.DB_HOST).catch(error => {
	console.error('Mongo DB connect error', { error })
})

const db = mongoose.connection

db.on('error', error => {
	console.error('Mongo DB connection error', { error })
})

export default db
