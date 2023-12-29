var mongoose = require('mongoose')
var categorySchema = mongoose.Schema({
    categoryname: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
})

module.exports = mongoose.model("category", categorySchema)