const express = require('express')
const router = express.Router()

const commentCrtl = require('../controllers/commentController')

router.get('/comments/:id', commentCrtl.getComments)

module.exports = router