import { isAuthenticated } from '../../lib/auth'
import clientPromise from '../../lib/mongo'
import { extractValidFields, validateAgainstSchema } from '../../lib/validation'
const {ObjectId} = require('mongodb')
const mongoDBName = process.env.MONGODB_NAME

//expected review format
export const reviewSchema = {
    movieID: {required: true},//int
    reviewer: {required: false},//dont include, pulled from cookie
    stars: {required: true},//int
    content: {required: false}//string
}

export default async function reviews(req, res) {
    if(req.method === "POST") {
        if(isAuthenticated(req, res)){
            if(validateAgainstSchema(req.body, reviewSchema)){//make sure request body matches schema
                req.body.reviewer = req.cookies.username
                console.log(req.body.reviewer)
                const review = await addReview(req.body)//add the review
                if(review && review != -1){
                    res.status(201).send(review)
                }else{
                    res.status(500).send({err: "Error inserting into database"})
                }
    
            }else{
                res.status(400).send({
                    err: "Invalid request body for a movie... expecting movieID and title"
                })
            }
        }else{
            res.status(401).send({
                err: "Unauthorized"
            })
        }
        
        
    }else if(req.method === "GET"){
        //console.log("isAuthenticated: ", isAuthenticated(req, res))
        const id = req.query.id
        if(id){
            const reviews = await getReviewsByMovieId(id)
            
            if(reviews && reviews != -1){
                if(reviews == -2){
                    res.status(201).send({})
                }else{
                    res.status(201).send(reviews)
                }
            }else{
                res.status(500).send({err: "Error getting from database"})
            }
            //res.status(200).send({id: id})
        }else{
            res.status(400).send({
                err: "No id found in query"
            })
        }
        
    }else if(req.method === "PATCH"){
        if(isAuthenticated(req, res)){
            if(validateAgainstSchema(req.body, reviewSchema)){//make sure request body matches schema
                req.body.reviewer = req.cookies.username
                const count = await editReview(req.body)//add the review
                if(count && count != -1){
                    if(count == -2){
                        res.status(201).send({msg: "Nothing to update"})
                    }else{
                        res.status(201).send({msg: "Successfully updated review"})
                    }
                    
                }else{
                    res.status(500).send({err: "Error updating into database"})
                }
    
            }else{
                res.status(400).send({
                    err: "Invalid request body for a movie... expecting movieID and title"
                })
            }
        }else{
            res.status(401).send({
                err: "Unauthorized"
            })
        }
        
    }else if(req.method === "DELETE"){
        if(isAuthenticated(req,res)){
            req.body.reviewer = req.cookies.username
            if(req.body.movieID && req.body.reviewer){
                const result = await deleteReview(req.body.movieID, req.body.reviewer)
                
                if(result && result != -1){
                    if(result == -2){
                        res.status(201).send({msg: "Nothing to delete"})
                    }else{
                        res.status(201).send({msg: "Deleted"})
                    }
                }else{
                    res.status(500).send({err: "Error getting from database"})
                }
                //res.status(200).send({id: id})
            }else{
                res.status(400).send({
                    err: "Request body needs movieID and reviewer"
                })
            }
        }else{
            res.status(401).send({
                err: "Unauthorized"
            })
        }
        
        
    }
}

async function editReview(body) {
    const movieID = body.movieID
    const reviewer = body.reviewer
    const newStars = body.stars
    const newContent = body.content ? body.content : null
    const client = await clientPromise
    const db = client.db(mongoDBName)//getDbInstance()
    //if the database exists
    if(db){
        const movieCollection = await db.collection('movies')
        const movieResult = await movieCollection.find({
            movieID: parseInt(movieID)//get movie by movieID
        }).toArray()
        
        if(movieResult[0]){//if the movie is found
            const movieValues = {//set up new movie values
                movieID: movieResult[0].movieID,
                title: movieResult[0].title,
                reviews: movieResult[0].reviews.map(review => {
                    if(review.reviewer === reviewer){
                        const newReview = {
                            movieID: movieID,
                            reviewer: reviewer,
                            submitted: review.submitted,
                            lastModified: Date.now(),
                            stars: newStars
                        }
                        if(newContent){
                            newReview.content = newContent
                        }else if(review.content){
                            newReview.content = review.content
                        }
                        console.log(newReview)
                        return newReview
                        
                    }
                    return review
                })
            }

            const result = await movieCollection.replaceOne(//replace old movie entry with new one
                {movieID: movieID},
                movieValues
            )
            
            return result.matchedCount > 0 ? result.matchedCount : -2
        }else{
            return -1
        }

    }else{
        console.log(`Error: couldn't connect to the database '${mongoDBName}'`)
        return -1
    }
    
}

async function addReview(body) {
    const review = extractValidFields(body, reviewSchema)//get valid fields
    const client = await clientPromise
    const db = client.db(mongoDBName)//getDbInstance()
    //if the database exists
    if(db){
        const movieID = review.movieID
        const movieCollection = await db.collection('movies')
        const movieResult = await movieCollection.find({
            movieID: parseInt(movieID)//get movie by movieID
        }).toArray()
        console.log("movie: ", movieResult[0])
        
        if(movieResult[0]){//if the movie is found
            review.submitted = Date.now()
            review.lastModified = review.submitted
            const movieValues = {//set up new movie values
                movieID: movieResult[0].movieID,
                title: movieResult[0].title,
                reviews: [review, ...movieResult[0].reviews]
            }

            const result = await movieCollection.replaceOne(//replace old movie entry with new one
                {movieID: movieID},
                movieValues
            )
            
            const userCollection = await db.collection('users')
            const userResult = await userCollection.find({
                username: review.reviewer
            }).toArray()
            if(userResult[0]){
                const userValues = {
                    username: userResult[0].username,
                    password: userResult[0].password,
                    level: userResult[0].level,
                    reviews: [{movieID: movieID}, ...userResult[0].reviews]
                }

                const userAddResult = await userCollection.replaceOne(
                    {username: userResult[0].username},
                    userValues
                )
            }else{
                return -1
            }

            return review//return the added review
        }else{
            return -1
        }

    }else{
        console.log(`Error: couldn't connect to the database '${mongoDBName}'`)
        return -1
    }
    
}

async function getReviewsByMovieId(id){
    const client = await clientPromise
    const db = client.db(mongoDBName)

    if(db){
        const collection = db.collection('movies')
        const result = await collection.find({
            movieID: parseInt(id)
        }).toArray()
        return result[0].reviews ? result[0].reviews : -2
    }else{
        console.log(`Error: couldn't connect to the database '${mongoDBName}'`)
        return -1
    }
}

async function deleteReview(movieID, reviewer){
    const client = await clientPromise
    const db = client.db(mongoDBName)//getDbInstance()
    //if the database exists
    if(db){
        const movieCollection = await db.collection('movies')
        const movieResult = await movieCollection.find({
            movieID: parseInt(movieID)//get movie by movieID
        }).toArray()
        
        if(movieResult[0]){//if the movie is found
            const movieValues = {//set up new movie values
                movieID: movieResult[0].movieID,
                title: movieResult[0].title,
                reviews: movieResult[0].reviews.filter(review => {
                    return review.reviewer !== reviewer
                })
            }

            const result = await movieCollection.replaceOne(//replace old movie entry with new one
                {movieID: movieID},
                movieValues
            )

            const userCollection = await db.collection('users')
            const userResult = await userCollection.find({
                username: reviewer
            }).toArray()
            if(userResult[0]){
                const userValues = {
                    username: userResult[0].username,
                    password: userResult[0].password,
                    level: userResult[0].level,
                    reviews: userResult[0].reviews.filter(review => {
                        return review.movieID !== movieID
                    })//[movieID, ...userResult[0].reviews]
                }

                const userAddResult = await userCollection.replaceOne(
                    {username: userResult[0].username},
                    userValues
                )
            }else{
                return -1
            }
            
            return result.matchedCount > 0 ? result.matchedCount : -2
        }else{
            return -1
        }

    }else{
        console.log(`Error: couldn't connect to the database '${mongoDBName}'`)
        return -1
    }
}
