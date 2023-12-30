var express = require('express')
var router = express.Router()
var Share = require('./DatabaseModel/shareModel')

router.post('/share-task', function (req, res) {
    try {
        var share = new Share(req.body)
        share.save().then((saveData) => {
            if (share == saveData) {
                res.json({ status: true, message: 'Task shared successfully!' });
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

router.post('/display_assigned_task_by_user', async function (req, res) {
    await Share.find({ 'sharedto': req.body.sharedto }).then((result) => {
        res.json({ status: true, data: result })
    }).catch((e) => {
        res.json({ status: false })
    })
})

router.post('/display_shared_task_by_user', async function (req, res) {
    await Share.find({ 'sharedby': req.body.sharedby }).then((result) => {
        res.json({ status: true, data: result })
    }).catch((e) => {
        res.json({ status: false })
    })
})

router.post('/update_task_status', async function (req, res, next) {
    var { _id, ...data } = req.body
    await Share.updateOne({ _id: req.body._id }, data).then((result) => {
        res.json({ status: true, message: 'Task status updated!' })
    }).catch((e) => {
        res.json({ status: false, message: 'Database Error' })
    })
})

router.post('/update_shared_task', async function (req, res, next) {
    var { _id, ...data } = req.body
    await Share.updateOne({ _id: req.body._id }, data).then((result) => {
        res.json({ status: true, message: 'Task user updated!' })
    }).catch((e) => {
        res.json({ status: false, message: 'Database Error' })
    })
})

router.post('/delete_shared_task', async function (req, res) {
    await Share.deleteOne({ _id: req.body._id }).then((result) => {
        res.json({ status: true,  message: 'Task deleted Error' })
    }).catch((e) => {
        res.json({ status: false, message: 'Database Error' })
        console.log(e)
    })
})

module.exports = router;