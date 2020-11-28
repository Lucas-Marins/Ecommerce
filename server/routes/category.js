const express = require('express')
const router = express.Router()
const categoryCrtl = require('../controllers/categoryController')
const auth = require('../middlewares/auth')
const authAdmin = require('../middlewares/authAdmin')

router.get('/category', categoryCrtl.getCategories)
router.post('/category', auth, authAdmin, categoryCrtl.createCategory)

router.delete('/category/:id', categoryCrtl.deleteCategory)
router.put('/category/:id', categoryCrtl.updateCategory)

router.get()

module.exports = router