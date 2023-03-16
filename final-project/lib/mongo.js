
const {MongoClient} = require('mongodb')

const mongoUrl = "mongodb+srv://MovieAdmin:<dbpassword>@moviedb.i9xkgqv.mongodb.net/?retryWrites=true&w=majority"

let db = null
exports.connectToDb = function(callback) {
    MongoClient.connect(mongoUrl, function(err, client) {
        if(err){
            throw err
        }
        db = client.db("moviedb")
        callback()
    })
}

exports.getDbInstance = function () {
    return db
}