import express, { Router } from 'express'
import multer from 'multer'
import fs from 'node:fs'
import path from 'node:path'
import Residence from '../../models/listings/residence.mjs'
import passport from 'passport'
import '../../strategies/jwt.mjs'
// Setting the destination path for product photos
const root = path.resolve()
const destination = path.join(root, '/public/')
// ReArranging the Residence 
const reArrangeListing = (req) => {
  //console.log(typeof req.body.adType)
  console.log(req.body)
  const numberOfRooms = {}
  const heating = {}
  const floor = {}
  const area = {}
  const location = {}
  const numberOfToilets = req.body.numOfToilets
  const furnishing = req.body.furnishing
  const state = req.body.state

  // Set number of Rooms
  numberOfRooms.rooms = req.body.numOfRooms.split('+')[0]
  numberOfRooms.hall = req.body.numOfRooms.split('+')[1]
  //Set heating
  heating.heatingType = req.body.heating.split('/')[0]
  heating.fuel = req.body.heating.split('/')[1]
  // Set floor
  floor.specific = req.body.floor.split('/')[1]
  floor.total = req.body.floor.split('/')[0]
  // set area
  area.gross = req.body.area.split('/')[0]
  area.net = req.body.area.split('/')[1]
  // set Location
  location.country = req.body.location.split(',')[0]
  location.city = req.body.location.split(',')[1]
  location.district = req.body.location.split(',')[2]
  location.street = req.body.location.split(',')[3] || ''
  location.door = req.body.location.split(',')[4] || ''

  const details = {
    numberOfRooms,
    numberOfToilets,
    heating,
    floor,
    furnishing,
    state,
  }

  for (const key in details) {
    if (details[key]) {
      delete req.body[key]
    }
  }
  const data = req.body
  //console.log(req.body.description)
  //console.log(data.description)
  data.details = details
  data.owner = {
    name: req.user.fullName,
    email: req.user.email,
    picture: req.user.picture,
    phone: req.user.phone
  }
    data.area = area
    data.location = location
    console.log(req.body.price)
  //const numberOfRooms = req.body.numberOfRooms.split("+")
  if (req.files) {
    data.images = req.files.map((item) => item.filename)

  }

  return data

}

const checkUser = (req,res,next) => {
  if (!req.user) {
      if(passport.authenticate('jwt',{session:false})){
        return next()
      }
      return res.send({ error: 'Not logged in!' })
    }
    next()
}

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

const router = Router()

router.post('/', upload.array('images', 20),checkUser,async (req, res) => {
 
  const data = reArrangeListing(req)

  try {
    const newResidence = new Residence(data)
    await newResidence.save()
    return res.send({ msg: 'Residence Created!' })
  } catch (error) {
    return res.send({ error: error.message })
  }
})



router.put('/:id',checkUser, (req, res, next) => {
  console.log("before", req.body)
  next()
},upload.array('images', 20),(req, res, next) => {
  console.log("after",req.body)
  next()
}, async (req, res) => {
  const { id } = req.params

  const data = reArrangeListing(req)

  const residence = await Residence.findById(id)
  if (!residence) return res.send({ error: `Residence not found!` })

  try {
    await Residence.findByIdAndUpdate(id, data)
    try {
      residence.images.forEach((item) => {
        fs.unlinkSync(destination + item)
      })
    } catch (error) {
      
    }
    
    return res.send({ msg: 'Residence updated!' })
  } catch (error) {
    return res.send({ error: error.message })
  }
})

router.use(express.json())

router.patch("/:id",checkUser, async (req, res) => {
  console.log('Inside patch residence')
  const { id } = req.params
 
  const data = reArrangeListing(req)

  const residence = await Residence.findById(id)
  if (!residence) return res.send({ error: `Residence not found!` })
  try {
    data.images = residence.images
    await Residence.findByIdAndUpdate(id, data)
    return res.send({ msg: 'Residence updated!' })
  } catch (error) {
    return res.send({ error: error.message })
  }
})

router.get("/:id", async (req, res) => {
  const { id } = req.params
   const residence = await Residence.findById(id)
  if (!residence) return res.send({ error: `Residence not found!` })
  const location = residence.location.country + ',' + residence.location.city +","+ residence.location.district + "," +residence.location.street +","+residence.location.door
  const area = Object.values(residence.area).join("/")
  const floor = Object.values(residence.details.floor).join("/")
  const heating = Object.values(residence.details.heating).join("/")
  const numOfRooms = Object.values(residence.details.numberOfRooms).join('+')
  const steps = {}
  steps['step1'] = {
    type: residence.type,
    age: residence.age,
    location,
    title: residence.title,
    
  }
  steps["step2"] = { adType: residence.adType, area, category: residence.category, price: residence.price }
  steps['step3'] = {
    floor,
    furnishing: residence.details.furnishing,
    heating,
    numOfRooms,
    numOfToilets: residence.details.numberOfToilets,
  }
  steps["step4"] = { description: residence.description, images: residence.images, state: residence.details.state }
  
  return res.send(steps)
})



export default router
