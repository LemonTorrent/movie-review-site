import clientPromise from '../../lib/mongo'
import { extractValidFields, validateAgainstSchema } from '../../lib/validation'
const {ObjectId} = require('mongodb')
const mongoDBName = process.env.MONGODB_NAME


export default async function (req, res) {
    if(req.method === "GET"){
        //get the id from query string parameters
        const id = req.query.id
        if(id){
            //get the movie from the database
            const movie = await getMovieById(id)
            //if checked with no errors
            if(movie && movie != -1){
                if(movie == -2){
                    //no matching movie found, send empty {}
                    res.status(201).send({stars: -1})
                }else{
                    //send movie back
                    const reviews = movie.reviews
                    var total = 0;
                    for(let i = 0; i < reviews.length; i++){
                        total += reviews[i].stars
                    }
                    total /= reviews.length
                    res.status(201).send({stars: total})
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