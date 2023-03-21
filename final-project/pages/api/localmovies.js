import clientPromise from '../../lib/mongo'
import { extractValidFields, validateAgainstSchema } from '../../lib/validation'
const {ObjectId} = require('mongodb')
const mongoDBName = process.env.MONGODB_NAME

//Expected format for a movie
export const movieSchema = {
    movieID: {required: true},//int
    title: {required: true}//string
}

export default async function (req, res) {
    //handle post requests
    if(req.method === "POST") {
        //checks if the reqest body matches the expected schema
        if(validateAgainstSchema(req.body, movieSchema)){
            //adds the movie to the db
            const movie = await addMovie(req.body)
            //if submitted successfully, send the movie back to requester
            if(movie && movie != -1){
                res.status(201).send(movie)
            }else{
                //if not submitted successfully, spit out an error
                res.status(500).send({err: "Error inserting into database"})
            }

        }else{
            //request body does not match schema
            res.status(400).send({
                err: "Invalid request body for a movie... expecting movieID and title"
            })
        }
    
    //handle get requests
    }else if(req.method === "GET"){
        //get the id from query string parameters
        const id = req.query.id
        if(id){
            //get the movie from the database
            const movie = await getMovieById(id)
            //if checked with no errors
            if(movie && movie != -1){
                if(movie == -2){
                    //no matching movie found, send empty {}
                    res.status(201).send({})
                }else{
                    //send movie back
                    res.status(201).send(movie)
                }
            }else{
                //something went wrong
                res.status(500).send({err: "Error getting from database"})
            }
            //res.status(200).send({id: id})
        }else{
            //no id found in query
            res.status(400).send({
                err: "No id found in query"
            })
        }
        
    }
}

//add the movie to db
async function addMovie(body) {
    const movie = extractValidFields(body, movieSchema)
    movie.reviews = []//add empty reviews array for later
    const client = await clientPromise
    const db = client.db(mongoDBName)//getDbInstance()
    //if the database exists
    if(db){
        const collection = await db.collection('movies')
        //add the movie to db
        const result = await collection.insertOne(movie)
        return result ? movie : -1//return the movie or an error
    }else{
        console.log(`Error: couldn't connect to the database '${mongoDBName}'`)
        return -1
    }
    
}

//get a movie by movieID
async function getMovieById(id){
    const client = await clientPromise
    const db = client.db(mongoDBName)

    if(db){
        const collection = db.collection('movies')
        const result = await collection.find({
            movieID: parseInt(id)//if movieID matches
        }).toArray()
        return result[0] ? result[0] : -2//returns movie or -2 meaning not found
    }else{
        console.log(`Error: couldn't connect to the database '${mongoDBName}'`)
        return -1
    }
}