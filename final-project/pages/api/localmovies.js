import clientPromise from '../../lib/mongo'



const {ObjectId} = require('mongodb')
const mongoDBName = process.env.MONGODB_NAME


export default async function (req, res) {
    if(req.method === "POST") {
        const returnID = await addMovieToDB(JSON.stringify(req.body))
        res.status(201).json({id: returnID})
    }
}

async function addMovieToDB(movie) {
    const client = await clientPromise
    console.log("adding movie: ", movie)
    const db = client.db(mongoDBName)//getDbInstance()
    if(db){
        console.log("db: ", db)
        const collection = await db.collection('movies')
        const result = await collection.insertOne(JSON.parse(movie))
        return result.insertedId;
    }else{
        console.log("Error: no database: ", db)
        return 0
    }
    
}