
import { MongoClient } from "mongodb"

const mongoUsername = process.env.MONGODB_USERNAME
const mongoPassword = process.env.MONGODB_PASSWORD
const mongoServer = process.env.MONGODB_SERVER ?? "moviedb.i9xkgqv.mongodb.net"

let protocol = mongoServer.includes(".") ? "mongodb+srv" : "mongodb"
//const mongoDBName = process.env.MONGODB_NAME
const mongoUrl = `${protocol}://${mongoUsername}:${mongoPassword}@${mongoServer}/?retryWrites=true&w=majority`

//console.log("mongoUrl: ", mongoUrl)

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
