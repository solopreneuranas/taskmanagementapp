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

module.exports = router;