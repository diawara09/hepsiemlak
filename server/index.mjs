import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
// imports needed for auth
import passport from 'passport'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import cors from 'cors'
// Socket.io imports
import {createServer} from 'node:http'
import { Server } from 'socket.io'
// Routers
import authRouter from './routes/auth.mjs'
import tweetsRouter from './routes/tweets.mjs'
import usersRouter from './routes/users.mjs'
import listingRouter from './routes/listings/listing.mjs'
import landRouter from './routes/land.mjs'
import projectsRouter from './routes/projects.mjs'
import path from 'node:path'

// Setting the destination path for product photos
const root = path.resolve()



const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://www.sahelimmo.info',
    'https://sahelimmo.info',
  ],

  //credentials: true,
  optionsSuccessStatus: 200,
  credentials: true,
}

try {
  const connection = await mongoose.connect(process.env.MongoDB_URI)
  console.log('Database connected')
} catch {
  console.log('Error occured')
}
const app = express()
// Socket.io connection
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: ['https://sahelimmo.info', 'https://www.sahelimmo.info'],
    methods: ['GET', 'POST'],
  },
})
const connections = []
io.on("connection", (socket) => {
  //console.log("user connected")
  connections.push(socket)
  socket.on("disconnect", () => {
    console.log("user disconnected")
  })
})
app.use(express.static(path.join(root, '/public')))
app.use((req, res, next) => {
  req.io = io
  next()
})
app.use(cors(corsOptions))



app.use(express.json())
app.use(cookieParser('yes'))
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      dbName: 'boiler',
    }),
  })
)
app.use(passport.initialize())
app.use(passport.session())

const port = process.env.PORT
app.use('/users', usersRouter)
app.use('/listings', listingRouter)
app.use('/projects', projectsRouter)
app.use('/land', landRouter)
app.use('/auth', authRouter)
app.use('/tweets', tweetsRouter)
app.get('/', (req, res) => {
  res.send('Here is the Home Page')
})

server.listen(port, () => {
  console.log(`Server listening to port: ${port}`)
})
