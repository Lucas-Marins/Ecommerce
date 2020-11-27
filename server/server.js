const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
  useTempFiles: true
}))

// Connect to mongoose
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}, err =>{
  if(err) throw err
  console.log('Connect to MongoDB')
})

//Routes
const userRouter = require('./routes/user')
const categoryRouter = require('./routes/category')
const uploadRouter = require('./routes/uploads')

app.use('/user', userRouter)
app.use('/api', categoryRouter)
app.use('/api', uploadRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
  console.log(`Server is running on port`, PORT)
})

