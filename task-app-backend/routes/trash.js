var express = require('express');
var router = express.Router();
var upload = require('./multer')
var Trash = require('./DatabaseModel/trashModel')

const { ObjectId } = require('mongodb');
const { default: mongoose } = require('mongoose');

router.post('/create_trash_task', function (req, res) {
    try {
        var trash = new Trash(req.body)
        trash.save().then((saveData) => {
            if (trash == saveData) {
                res.json({ status: true, message: 'Task added to Trash!' });
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

router.post('/display_all_trash_task_by_user', async function (req, res) {
    await Trash.aggregate([
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "categoryData"
            }
        },
        {
            $match: {
                userid: new mongoose.Types.ObjectId(req.body.userid)
            }
        }
    ],
        { $unwind: "$trashTaskData", $unwind: "$categoryData" }
    ).then((result) => {
        res.json({ status: true, data: result })
    }).catch((e) => {
        res.json({ msg: "Error",error:e })
    })
})

router.post('/delete-trash-task', async function (req, res) {
    await Trash.deleteOne({ _id: req.body._id }).then((result) => {
        res.json({ status: true })
    }).catch((e) => {
        res.json({ status: false, message: 'Database Error' })
        console.log(e)
    })
})

router.post('/delete-trash-task', async function (req, res) {
    await Trash.deleteOne({ _id: req.body._id }).then((result) => {
        res.json({ status: true })
    }).catch((e) => {
        res.json({ status: false, message: 'Database Error' })
        console.log(e)
    })
})

module.exports = router;