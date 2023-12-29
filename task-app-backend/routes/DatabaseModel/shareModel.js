var mongoose = require('mongoose')
var shareSchema = mongoose.Schema({
    taskid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tasks",
        required: true
    },
    sharedto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    sharedby: {
        type: String,
        required: true
    },
    taskname: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    tags: {
        type: String,
        required: false
    },
    deadline: {
        type: Date,
        required: true
    },
})

module.exports = mongoose.model("share", shareSchema)