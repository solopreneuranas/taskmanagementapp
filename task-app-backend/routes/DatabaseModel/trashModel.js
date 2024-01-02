var mongoose = require('mongoose')
var trashSchema = mongoose.Schema({
    taskid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tasks",
        required: true
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    taskname: {
        type: String,
        required: false
    },
    deadline: {
        type: Date,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "categories",
        required: false
    },
    tags: {
        type: String,
        required: false
    },
})

module.exports = mongoose.model("trash", trashSchema)