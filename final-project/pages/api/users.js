import clientPromise from '../../lib/mongo'
import { extractValidFields, validateAgainstSchema } from '../../lib/validation'
const {ObjectId} = require('mongodb')
const mongoDBName = process.env.MONGODB_NAME

//Expected format for a user
export const userSchema = {
    username: {required: true},
    password: {required: true}
}

export default async function user(req, res) {
    //handle post requests
    if(req.method === "POST"){
        if(validateAgainstSchema(req.body, userSchema)){
            const user = await getUser(req.body.username)
            if(user && user != -1){
                if(user != -2){
                    res.status(400).send({err: "Username taken"})
                }else{

                    const added = await addUser(req.body)
                    if(user != -1){
                        res.status(200).send(added)
                    }else{
                        res.status(500).send({err: "Error adding user... try again later"})
                    }

                    
                }
            }else{
                //something went wrong
                res.status(500).send({err: "Error getting from database"})
            }
        }else{
            //request body does not match schema
            res.status(400).send({
                err: "Invalid request body for a user... expecting username and password"
            })
        }
    }else if(req.method === "GET"){
        const username = req.query.username
        if(username){
            //get the movie from the database
            const user = await getUser(username)
            //if checked with no errors
            if(user && user != -1){
                if(user == -2){
                    //no matching movie found, send empty {}
                    res.status(201).send({})
                }else{
                    //send movie back
                    user.password = "hidden"
                    res.status(201).send(user)
                }
            }else{
                //something went wrong
                res.status(500).send({err: "Error getting from database"})
            }
            //res.status(200).send({id: id})
        }else{
            //no id found in query
            res.status(400).send({
                err: "No username found in query"
            })
        }
    }
}

//get a movie by movieID
async function getUser(username){
    const client = await clientPromise
    const db = client.db(mongoDBName)

    if(db){
        const collection = db.collection('users')
        const result = await collection.find({
            username: username//if username matches
        }).toArray()
        return result[0] ? result[0] : -2//returns movie or -2 meaning not found
    }else{
        console.log(`Error: couldn't connect to the database '${mongoDBName}'`)
        return -1
    }
}

async function addUser(body) {
    const user = extractValidFields(body, userSchema)
    user.reviews = []//add empty reviews array for later
    user.level = 1
    const client = await clientPromise
    const db = client.db(mongoDBName)//getDbInstance()
    //if the database exists
    if(db){
        const collection = await db.collection('users')
        //add the movie to db
        const result = await collection.insertOne(user)
        return result ? user : -1//return the user or an error
    }else{
        console.log(`Error: couldn't connect to the database '${mongoDBName}'`)
        return -1
    }
    
}

