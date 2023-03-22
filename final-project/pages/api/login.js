import { generateAuthToken, setAuthCookie } from "../../lib/auth"
import clientPromise from "../../lib/mongo"
const mongoDBName = process.env.MONGODB_NAME

export default async function login(req, res) {
    if (req.method !== "POST") {
        res.status(405).send({ err: "Only POSTs are accepted here" })
    }
    const { username, password } = req.body
    const user = await validateUser(username, password)
    if(user == -1){
        res.status(500).send({err: "Couldn't login... try again later"})
    }else if(user == -2){
        res.status(401).send({ err: "Invalid credentials" })
    }else{
        setAuthCookie(res, generateAuthToken(username), username)
        res.status(200).send({ msg: "OK!" })
    }
    
}

async function validateUser(username, password){
    const client = await clientPromise
    const db = client.db(mongoDBName)

    if(db){
        const collection = db.collection('users')
        const result = await collection.find({
            username: username
        }).toArray()
        if(!result[0]){
            return -2
        }
        return result[0].password === password ? result[0] : -2
    }else{
        console.log(`Error: couldn't connect to the database '${mongoDBName}'`)
        return -1
    }
}
