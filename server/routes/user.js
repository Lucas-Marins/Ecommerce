const express = require('express')
const router = express.Router()
const userCrtl = require('../controllers/userController')
const auth = require('../middlewares/auth')

router.post('/register', userCrtl.register)

router.post('/login', userCrtl.login)

router.get('/logout',userCrtl.logout)

router.get('/refresh_token', userCrtl.refreshToken)

router.get('/infor',auth, userCrtl.getUser)

module.exports = router