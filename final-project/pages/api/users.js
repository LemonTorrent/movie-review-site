import clientPromise from '../../lib/mongo'
import { extractValidFields, validateAgainstSchema } from '../../lib/validation'
const {ObjectId} = require('mongodb')
const mongoDBName = process.env.MONGODB_NAME

//Expected format for a user
export const userSchema = {
    username: {required: true},
    password: {required: true}
}

export default async function (req, res) {
    //handle post requests
    
}

