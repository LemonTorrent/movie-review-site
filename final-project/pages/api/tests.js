//import db from '../../lib/mongo'
import clientPromise from '../../lib/mongo'
//import {getDbInstance} from '../../lib/mongo'



const {ObjectId} = require('mongodb')
const mongoDBName = process.env.MONGODB_NAME


export default async function test(req, res) {
    if(req.method === "POST") {
        console.log("Got post request: ", req.body)
        const returnID = await addTestToDB(JSON.stringify(req.body))
        console.log("Got return id: ", returnID)
        res.status(201).json({id: returnID})
    }
}

async function addTestToDB(test) {
    const client = await clientPromise
    console.log("adding test: ", test)
    const db = client.db(mongoDBName)//getDbInstance()
    if(db){
        console.log("db: ", db)
        const collection = await db.collection('tests')
        const result = await collection.insertOne(JSON.parse(test))
        return result.insertedId;
    }else{
        console.log("Error: no database: ", db)
        return 0
    }
    
}
