const {ObjectId} = require('mongodb')

const {getDbInstance} = require('../../lib/mongo')


exports.insertTest = async function insertTest(test){
    const db = getDbInstance()
    const collection = db.collection('tests')

    const result = await collection.insertOne(test)
    return result.insertedId
}