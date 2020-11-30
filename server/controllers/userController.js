const User  = require('../models/user')
const Payment = require('../models/payment')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const createAccessToken = (user) =>{
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{
    expiresIn: '11m'
  })
}

const createRefreshToken = (user) =>{
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET,{
    expiresIn: '7d'
  })
}


const userCrtl =  {
  register: async(req, res) => {
    try {
      const {name, email, password} = req.body

      const user = await User.findOne({email})
      if(user){
        return res.status(400).json({
          msg: "The email already exist"
        })
      }
  
      if(password.lenth < 6) return res.status(400).json({msg: "Password is at least 6 characters"})
  
      
      // Password Encrypt
      const passwordHash = await bcrypt.hash(password, 10)
      const newUser = new User({
        name,
        email,
        password: passwordHash
      })
  
      await newUser.save()
  
      //Then create jswonwebtoken to authentication 
      const accesstoken = createAccessToken({id: newUser._id})
      const refreshtoken = createRefreshToken({id: newUser._id})
  
      res.cookie('refreshtoken', refreshtoken, {
        httpOnly: true,
        path: '/user/refresh_token',
        maxAge: 7*24*60*60*1000 // 7d
      })
  
      return res.json({accesstoken})
  
    } catch (error) {
      return res.status(500).json({msg: "Try again"})
    } 
  },
  login: async(req, res) =>{
    try {
      const {email, password} = req.body

      const user = await User.findOne({email})
      if(!user) return res.status(400).json({msg:"User does not exist"})

      const isMatch =  await bcrypt.compare(password, user.password)
      if(!isMatch) return res.status(400).json({msg:"Incorrect password"})

      // if login succes, create access token and refresh token
      const accesstoken = createAccessToken({id: user._id})
      const refreshtoken = createRefreshToken({id: user._id})
  
      res.cookie('refreshtoken', refreshtoken, {
        httpOnly: true,
        path: '/user/refresh_token',
        maxAge: 7*24*60*60*1000 // 7d
      })

      return res.json({accesstoken})
  

    } catch (error) {
      return res.status(500).json({msg:err.message})
    }
   }, 
   logout: async(req, res) => {
    try {
      res.clearCookie('refreshToken', {path: '/user/refresh_token'})
      return res.json({msg:"Logged out"})
      
    } catch (error) {
      return res.status(500).json({msg:err.message})
    }
   } ,
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken
      if(!rf_token) return res.status(400).json({msg: "Please Login or Register"})

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user)=>{
        if(err) return res.status(400).json({msg: "Please Login or Register"})

        const accesstoken = createAccessToken({id: user.id})

        res.json({user, accesstoken})
      })
      
    } catch (error) {
      return res.status(500).json({msg:err.message})
    }
  } ,
  getUser: async(req, res) =>{
    try {
      const user = await User.findById(req.user.id).select('-password')
      if(!user) return res.status(500).json({msg:"User does not exist"})


     res.json(user)
    } catch (error) {
      return res.status(500).json({msg:err.message})
    }
  },
  addCart: async(req, res) => {
    try {
      const user = await User.findById(req.user.id)
      if(!user) return res.status(400).json({msg: "User does not exist"})
      
      await User.findOneAndUpdate({_id: req.user.id},{
        cart: req.body.cart
      })

      return res.json({msg: "Added to cart"})
    } catch (err) {
      return res.status(500).json({msg:err.message})
    }
  },
  history: async(req, res) => {
    try {
      const history = await Payment.find({user_id: req.user.id})

      res.json(history)
    } catch (error) {
      return res.status(500).json({msg:err.message})
    }
  }
}

module.exports = userCrtl