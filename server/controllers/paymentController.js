const Payment = require('../models/payment')
const User = require('../models/user')
const Product = require('../models/product')

const paymentCrtl = {
  getPayment: async(req, res) => {
    try {
      const payments = await Payment.find()
      res.json(payments)

    } catch (error) {
      return res.status(500).json({msg: error.message})
    }
  },
  createPayment: async(req, res) => {
    try {
      const user = await (await User.findById(req.user.id)).select('name email')
      if(!user) return res.status(500).json({msg: "User does not exist"})

      const {cart, paymentID, address} = req.body;
      const {_id, name, email} = user;

      const newPayment = new Payment({
        user_id: _id,
        name,
        email,
        cart,
        paymentID,
        address
      })

      res.json({newPayment})

    } catch (error) {
      return res.status(500).json({msg: error.message})
    }
  }
}

module.exports =  paymentCrtl