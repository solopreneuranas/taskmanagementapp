var mongoose = require('mongoose')
var taskSchema = mongoose.Schema({
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
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "users",
        required: true
    }
})

module.exports = mongoose.model("task", taskSchema)