var express = require('express');
var router = express.Router();
var upload = require('./multer')
var Tasks = require('./DatabaseModel/taskModel')

router.post('/create-task', function (req, res) {
    try {
        var task = new Tasks(req.body)
        task.save().then((saveData) => {
            if (task == saveData) {
                res.json({ status: true, message: 'Task added successfully!' });
            }
            else {
                res.json({ status: false, message: 'Database Error!' });
            }
        })
    }
    catch (e) {
        res.json({ status: false, message: 'Server Error!' })
    }
})

router.get('/display_all_task', async function (req, res) {
    await Tasks.find({}).then((result) => {
        res.json({ status: true, data: result })
    }).catch((e) => {
        res.json({ status: false })
    })
})

router.post('/display_all_task_by_user', async function (req, res) {
    await Tasks.find({ 'userid': req.body.userid }).then((result) => {
        res.json({ status: true, data: result })
    }).catch((e) => {
        res.json({ status: false })
    })
})

router.post('/update-task', async function (req, res, next) {
    var { _id, ...data } = req.body
    await Tasks.updateOne({ _id: req.body._id }, data).then((result) => {
        res.json({ status: true, message: 'Task updated!' })
    }).catch((e) => {
        res.json({ status: false, message: 'Database Error' })
    })
})

router.post('/delete-task', async function (req, res) {
    await Tasks.deleteOne({ _id: req.body._id }).then((result) => {
        res.json({ status: true })
    }).catch((e) => {
        res.json({ status: false, message: 'Database Error' })
        console.log(e)
    })
})

module.exports = router;