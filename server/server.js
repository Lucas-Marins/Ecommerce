const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const Comments = require('./models/comment')

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
  useTempFiles: true
}))

const http = require('http').createServer(app)
const io = require('socket.io')(http)


//Socketio
let users = []
io.on('connection', socket => {
  // console.log(socket.id + 'connected')

  socket.on('joinRoom', id => {
    const user = {userId: socket.id, room: id}

    const check = users.every(user => user.userId !== socket.id)

    if(check){
        users.push(user)
        socket.join(user.room)
    }else{
        users.map(user => {
            if(user.userId === socket.id){
                if(user.room !== id){
                    socket.leave(user.room)
                    socket.join(id)
                    user.room = id
                }
            }
        })
    }
   
    // console.log(users)
    // console.log(socket.adapter.rooms)
  })


  socket.on('createComment', async msg=> {
    const {username, content, product_id, createdAt, rating, send} = msg

    const newComment = new Comments({
      username, 
      content, 
      product_id, 
      createdAt, 
      rating
    })

    if(send === 'replyComment'){
      const {_id, username, content, product_id, createdAt, rating} = newComment

      const comment = await Comments.findById(product_id)

      if(comment){
          comment.reply.push({_id, username, content, createdAt, rating})

          await comment.save()
          io.to(comment.product_id).emit('sendReplyCommentToClient', comment)
      }
  }else{
      await newComment.save()
      io.to(newComment.product_id).emit('sendCommentToClient', newComment)
  }

  
  })


  socket.on('disconnet', ()=> {
    // console.log(socket.id + 'disconnected.')
    user = user.filter(user => user.userId !== socket.id)
  })
})

// Listen server
const PORT = process.env.PORT || 5000
http.listen(PORT, ()=> {
  console.log('Server is runnin on', PORT)
})

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
const productRouter = require('./routes/product')
const paymentRouter = require('./routes/payment')
const commentRouter = require('./routes/comments')

app.use('/user', userRouter)
app.use('/api', categoryRouter)
app.use('/api', uploadRouter)
app.use('/api', productRouter)
app.use('/api', paymentRouter)
app.use('/api', commentRouter)

