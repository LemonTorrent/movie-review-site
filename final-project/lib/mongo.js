
import { MongoClient } from "mongodb"

const mongoUsername = process.env.MONGODB_USERNAME
const mongoPassword = process.env.MONGODB_PASSWORD
//const mongoDBName = process.env.MONGODB_NAME
const mongoUrl = `mongodb+srv://${mongoUsername}:${mongoPassword}@moviedb.i9xkgqv.mongodb.net/?retryWrites=true&w=majority`

var db = null
// MongoClient.connect(mongoUrl, function(err, client) {
//     if(err){
//         console.log("Err")
//         throw err
//     }
//     console.log("client: ", client)
//     db = client.db("MovieDB")
//     console.log("Made connection to db")
// })
const client = new MongoClient(mongoUrl)
const clientPromise = client.connect()
export default clientPromise

// export function getDbInstance() {
//     return db
// }