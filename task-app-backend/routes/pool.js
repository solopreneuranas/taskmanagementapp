const mongoose = require('mongoose')
var pool = () => {
    mongoose.Promise = global.Promise
    mongoose.connect('mongodb+srv://solopreneuranas:Mongobyanas20@cluster0.pvwduiz.mongodb.net/taskmanagementapp?retryWrites=true&w=majority')

    mongoose.connection
        .once("open", () => console.log("MongoDB is running!"))
        .on("error", (err) => console.log(err))
}

module.exports = pool
