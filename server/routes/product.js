const express = require('express')
const router = express.Router()
const productCtrl = require('../controllers/productController')

router.get('/products', productCtrl.getProduct)
router.post('/products', productCtrl.createProduct)
router.patch('/products/:id', productCtrl.reviews)

router.delete('/products/:id', productCtrl.deleteProduct)
router.put('/products/:id', productCtrl.updateProducts)




module.exports = router