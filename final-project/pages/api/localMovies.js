import clientPromise from '../../lib/mongo'
const {ObjectId} = require('mongodb')
const mongoDBName = process.env.MONGODB_NAME

export const movieSchema = {
    externalID: {required: true}
}

export default async function (req, res) {
    if(req.method === "POST") {
        console.log("Got post request: ", req.body)
        const returnID = await addMovie(JSON.stringify(req.body))
        //console.log("Got return id: ", returnID)
        if(ret)
        res.status(201).json({id: returnID.toString()})
    }
}

async function addMovie(movie) {
    const client = await clientPromise
    const db = client.db(mongoDBName)//getDbInstance()
    if(db){
        const collection = await db.collection('movies')
        const result = await collection.insertOne(JSON.parse(test))
        return result.insertedId;
    }else{
        console.log(`Error: couldn't connect to the database '${mongoDBName}'`)
        return -1
    }
    
}