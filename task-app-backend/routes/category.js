var express = require('express')
var router = express.Router()
var Category = require('./DatabaseModel/categoryModel')

router.post('/create-category', function (req, res) {
    try {
        var category = new Category(req.body)
        category.save().then((saveData) => {
            if (category == saveData) {
                res.json({ status: true, message: 'Category created successfully!' });
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

router.get('/display_all_category', async function (req, res) {
    await Category.find({}).then((result) => {
        res.json({ status: true, data: result })
    }).catch((e) => {
        res.json({ status: false })
    })
})

router.post('/display_all_category_by_user', async function (req, res) {
    await Category.find({ 'userid': req.body.userid }).then((result) => {
        res.json({ status: true, data: result })
    }).catch((e) => {
        res.json({ status: false })
    })
})

router.post('/update-category', async function (req, res, next) {
    var { _id, ...data } = req.body
    await Category.updateOne({ _id: req.body._id }, data).then((result) => {
        res.json({ status: true, message: 'Category updated!' })
    }).catch((e) => {
        res.json({ status: false, message: 'Database Error' })
    })
})

router.post('/delete-category', async function (req, res) {
    await Category.deleteOne({ _id: req.body._id }).then((result) => {
        res.json({ status: true })
    }).catch((e) => {
        res.json({ status: false, message: 'Database Error' })
        console.log(e)
    })
})

module.exports = router;