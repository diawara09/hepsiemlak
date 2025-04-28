import Users from '../models/users.mjs'
import express, { query, Router } from 'express'
import multer from 'multer'
import fs from 'node:fs'
import path from 'node:path'
import sendgrid from '@sendgrid/mail'
import { } from 'dotenv/config'
import passport from 'passport'
//import '../strategies/magicLink.mjs'
import '../strategies/jwt.mjs'


sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

// Setting the destination path for product photos
const root = path.resolve()
const destination = path.join(root, '/public/')

// Initializing multer diskStorage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, destination)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const extension = file.mimetype.split('/')[1]
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension)
  },
})
const upload = multer({ storage })
const checkIfConnected = (req, res, next) => {
  if (!req.user) {
      if(passport.authenticate('jwt',{session:false})){
        return next()
      }
      return res.send({ error: 'Not logged in!' })
    }
    next()
}
const checkIfAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) return res.send({ error: "Vous n'etes pas autorise!" })
  next()
}
const router = Router()

router.put('/:id', upload.single('picture'), async (req, res) => {
  //console.log('inside put');
  const { id } = req.params
  const { fullName, email, phone,description,userType } = req.body
  // Get the user to be updated
  const toBeUpdated = await Users.findById(id)
  if (!toBeUpdated) return res.send({ error: 'No user found!' })

 // if (Boolean(toBeUpdated.picture))
 try {
  fs.unlinkSync(destination + toBeUpdated.picture)
 } catch (error) {
  
 }
 

  try {
    const newUser = { fullName, email, phone, picture: req.file.filename, description, userType }
    await Users.findByIdAndUpdate(id, newUser)

    return res.send({ msg: 'User updated with success!' })
  } catch (error) {
    return res.send({ error: error.message })
  }
})
//Verification submit
router.patch("/verifySubmit/:id", checkIfConnected,upload.array("documents", 5),async (req, res) => {
  const { id } = req.params
  const {userType} = req.body
  // Get the user to be updated
  const toBeUpdated = await Users.findById(id)
  if (!toBeUpdated) return res.send({ error: 'No user found!' })
  
 try {
   if (toBeUpdated.documents && toBeUpdated.documents.length > 0)
     //delete prev documents
    try {
      toBeUpdated.documents.forEach((item) => fs.unlinkSync(destination + item))
    } catch (error) {
      
    }
     
 } catch (error) {
  
 }
  try {
   
    // repopulate th document array
    toBeUpdated.documents = []
    req.files.forEach((item) => {
      toBeUpdated.documents.push(item.filename)
    })
    toBeUpdated.userType = userType

    await Users.findByIdAndUpdate(id, toBeUpdated)

    return res.send({msg: 'Demande de Verification reçue!'})
    
  } catch (error) {
    return res.send({error: error.message})
  }
})

router.use(express.json())

router.get('/', async (req, res) => {
  const { cursor } = req.query

  const query = {}
  if (cursor) {
    query._id = { $gt: cursor }
  }
  try {
    const allUsers = await Users.find(query, null, { limit: 5 })
    return res.send(allUsers)
  } catch (error) {
    return res.send({ error: error.message })
  }
})
router.get("/unverified", async (req, res) => {
  const { cursor } = req.query
  const query = {
    isVerified: false,
    userType: { $exists: true, $ne: 'visitor' },
  }
  if (cursor) {
    query._id = {$gt: cursor}
  }
  try {
    const unverifiedUsers = await Users.find(query, null, { limit: 5 })
    return res.send(unverifiedUsers)
    
  } catch (error) {
    return res.send({error: error.message})
  }
})
router.get("/notary", async (req, res) => {
  const { cursor, userType } = req.query 
  const query = {userType}
  if (cursor) {
    query._id = {$gt: cursor}
  }

  try {
    const allNotaries = await Users.find(query, null, { limit: 5 })
    return res.send(allNotaries)
  } catch (error) {
    return res.send({error: error.message})
  }
})
router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const singleUser = await Users.findById(id)
    if (!singleUser) return res.send({ error: 'User not found' })

    return res.send(singleUser)
  } catch (error) {
    return res.send({ error: error.message })
  }
})

router.patch(
  '/verifyResult/:id',
  checkIfConnected,
  checkIfAdmin,
  async (req, res) => {
    const { id } = req.params
    const { adminMsg, isVerified } = req.body
    // Get the user to be updated
    const toBeUpdated = await Users.findById(id)
    if (!toBeUpdated) return res.send({ error: 'No user found!' })
    toBeUpdated.isVerified = isVerified

    try {
      await Users.findByIdAndUpdate(id, toBeUpdated)

      const link = 'https://sahelimmo.info/login/'
      const msg = {
        to: toBeUpdated.email,
        from: process.env.EMAIL,
        subject: 'Statut de votre verification!',
        text:
          `Salut ${toBeUpdated.fullName}! votre verifiction a ete ${
            isVerified ? 'approve' : 'rejette'
          } avec le message suivant:.\r\n\r\n` +
          adminMsg +
          ' .Reconnectez vous!' +
          link,
        html:
          `<h3>Salut ${toBeUpdated.fullName}!</h3><p>votre verifiction a ete ${
            isVerified ? 'approve' : 'rejette'
          } avec le message suivant: ${adminMsg}. Reconnectez vous!</p><p><a href="` +
          link +
          `">Sign in</a></p>`,
      }
      sendgrid.send(msg)
      return res.send({ msg: 'Message envoye!' })
    } catch (error) {
      return res.send({ error: error.message })
    }
  }
)


// Change notification url
router.patch('/notifUrl/:id', async (req, res) => {
  const { id } = req.params
  //console.log(req.body)
  const { notifUrl } = req.body
  // Get the user to be updated
  const toBeUpdated = await Users.findById(id)
  if (!toBeUpdated) return res.send({ error: 'No user found!' })
  try {
    const newUser = {
      fullName: toBeUpdated.fullName,
      email: toBeUpdated.email,
      picture: toBeUpdated.picture,
      notifUrl,
    }
    //console.log(newUser)
    await Users.findByIdAndUpdate(id, newUser)
    return res.send({ msg: 'User updated with success!' })
  } catch (error) {
    return res.send({ error: error.message })
  }
})
router.patch('/:id', async (req, res) => {
  const { id } = req.params
  const { fullName, email, phone, description, userType } = req.body
  // Get the user to be updated
  const toBeUpdated = await Users.findById(id)
  if (!toBeUpdated) return res.send({ error: 'No user found!' })

  try {
    const newUser = { fullName, email,phone, picture: toBeUpdated.picture, description, userType }
    await Users.findByIdAndUpdate(id, newUser)

    return res.send({ msg: 'User updated with success!' })
  } catch (error) {
    return res.send({ error: error.message })
  }
})
export default router
