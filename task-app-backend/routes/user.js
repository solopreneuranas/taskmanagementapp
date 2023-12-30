var express = require('express');
var router = express.Router();
var upload = require('./multer')
var Users = require('./DatabaseModel/userModel')
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch')

router.post('/create-account', function (req, res) {
    try {
        var user = new Users(req.body)
        user.save().then((saveData) => {
            if (user == saveData) {
                //localStorage.setItem('User', JSON.stringify([saveData]))
                res.json({ status: true, message: 'User account created successfully!', data: [saveData] })
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

router.post('/login', async function (req, res) {
    await Users.find({ $and: [{ email: req.body.email }, { password: req.body.password }] }).then((result) => {
        if (result.length == 1) {
            console.log(result)
            res.json({ status: true, data: result })
        }
        else {
            res.json({ status: false })
        }
    })
})

router.get('/display_all_user', async function (req, res) {
    await Users.find({}).then((result) => {
        res.json({ status: true, data: result })
    }).catch((e) => {
        res.json({ status: false })
    })
})

router.post('/update-account', async function (req, res, next) {
    var { _id, ...data } = req.body
    await Users.updateOne({ _id: req.body._id }, data).then((result) => {
        res.json({ status: true, message: 'User updated!' })
    }).catch((e) => {
        res.json({ status: false, message: 'Database Error' })
    })
})

// router.post('/delete-task', async function (req, res) {
//     await Tasks.deleteOne({ _id: req.body._id }).then((result) => {
//         res.json({ status: true })
//     }).catch((e) => {
//         res.json({ status: false, message: 'Database Error' })
//         console.log(e)
//     })
// })

module.exports = router;