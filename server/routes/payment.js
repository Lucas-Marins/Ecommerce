const express = require('express')
const router = express.Router()
const paymentCrtl = require('../controllers/paymentController')
const auth = require('../middlewares/auth')
const authAdmin = require('../middlewares/authAdmin')

router.get('/payment', auth, authAdmin, paymentCrtl.getPayments)
router.post('/payment', auth, paymentCrtl.createPayment)



module.exports = router