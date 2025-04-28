import express, { Router } from 'express'
import multer from 'multer'
import fs from 'node:fs'
import path from 'node:path'
import Commercial from '../../models/listings/commercial.mjs'
import passport from 'passport'
import '../../strategies/jwt.mjs'
// Setting the destination path for product photos
const root = path.resolve()
const destination = path.join(root, '/public/')
// ReArranging the Commercial
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
  location.street = req.body.location.split(',')[3]
  location.door = req.body.location.split(',')[4]

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
  data.details = details
  data.owner = {
    name: req.user.fullName,
    email: req.user.email,
    picture: req.user.picture,
    phone: req.user.phone,
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

const checkUser = (req, res, next) => {
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

router.post('/', upload.array('images', 20),checkUser, async (req, res) => {
  const data = reArrangeListing(req)

  try {
    const newCommercial = new Commercial(data)
    await newCommercial.save()
    return res.send({ msg: 'Commercial Created!' })
  } catch (error) {
    return res.send({ error: error.message })
  }
})

router.put(
  '/:id',
  checkUser,
  (req, res, next) => {
    console.log('before', req.body)
    next()
  },
  upload.array('images', 20),
  
  async (req, res) => {
    const { id } = req.params

    const data = reArrangeListing(req)

    const commercial = await Commercial.findById(id)
    if (!commercial) return res.send({ error: `Commercial not found!` })

    try {
      await Commercial.findByIdAndUpdate(id, data)
      try {
        commercial.images.forEach((item) => {
          fs.unlinkSync(destination + item)
        })
      } catch (error) {
        
      }
     
      return res.send({ msg: 'Commercial updated!' })
    } catch (error) {
      return res.send({ error: error.message })
    }
  }
)

router.use(express.json())

router.patch('/:id', checkUser, async (req, res) => {
  console.log('Inside patch Commercial')
  const { id } = req.params

  const data = reArrangeListing(req)

  const commercial = await Commercial.findById(id)
  if (!commercial) return res.send({ error: `Commercial not found!` })
  try {
    data.images = commercial.images
    await Commercial.findByIdAndUpdate(id, data)
    return res.send({ msg: 'Commercial updated!' })
  } catch (error) {
    return res.send({ error: error.message })
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const commercial = await Commercial.findById(id)
  if (!commercial) return res.send({ error: `Commercial not found!` })
  const location =
    commercial.location.country +
    ',' +
    commercial.location.city +
    ',' +
    commercial.location.district +
    ',' +
    commercial.location.street +
    ',' +
    commercial.location.door
  const area = Object.values(commercial.area).join('/')
  const floor = Object.values(commercial.details.floor).join('/')
  const heating = Object.values(commercial.details.heating).join('/')
  const numOfRooms = Object.values(commercial.details.numberOfRooms).join('+')
  const steps = {}
    steps['step1'] = {
      type: commercial.type,
    age: commercial.age,
    location,
    title: commercial.title,
    usage: commercial.usage,
  }
  steps['step2'] = {
    adType: commercial.adType,
    area,
    category: commercial.category,
    price: commercial.price,
  }
  steps['step3'] = {
    floor,
    furnishing: commercial.details.furnishing,
    heating,
    numOfRooms,
    numOfToilets: commercial.details.numberOfToilets,
  }
  steps['step4'] = {
    description: commercial.description,
    images: commercial.images,
    state: commercial.details.state,
  }

  return res.send(steps)
})

export default router
