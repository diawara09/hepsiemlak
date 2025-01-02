import Projects from '../models/projects.mjs'
import express, { Router } from 'express'
import multer from 'multer'
import fs from 'node:fs'
import path from 'node:path'

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
const router = Router()

// Check if user exists
const checkUser = (req, res, next) => {
  if (!req.user) return res.send({ error: "Vous n'etes pas connecte!" })
  next()
}

// create a Projects here
router.post('/', checkUser, upload.array('images', 20), async (req, res) => {
  const data = req.body
  data.images = req.files.map((item) => item.filename)
  data.owner = {
    name: req.user.fullName,
    picture: req.user.picture,
    email: req.user.email,
    phone: req.user.phone,
  }
  try {
    const newProjects = new Projects(data)
    await newProjects.save()
    return res.send({ msg: 'Projet Crée' })
  } catch (error) {
    return res.send({ error: error.message })
  }
})

// Edit Projects with images
router.put('/:id', checkUser, upload.array('images', 20), async (req, res) => {
  const { id } = req.params
  //Setting the new Projects
 const location = req.body.location.split(',')
 const data = req.body
 data.location.country = location[0]
 data.location.city = location[1]
 data.location.district = location[2]
 data.location.street = location[3] || ''
 data.location.door = location[4] || ''
  data.images = req.files.map((item) => item.filename)
  data.owner = {
    name: req.user.fullName,
    picture: req.user.picture,
    email: req.user.email,
    phone: req.user.phone,
  }
  //Check the Projects exists
  const toBeUpdated = await Projects.findById(id)
  if (!toBeUpdated) return res.send({ error: "Projet n'existe pas!" })

  try {
    await Projects.findByIdAndUpdate(id, data)
    if (toBeUpdated.images) {
      toBeUpdated.images.forEach((item) => fs.unlinkSync(destination + item))
    }
    return res.send({ msg: 'Projet mis a jour!' })
  } catch (error) {
    return res.send({ error: error.message })
  }
})

router.use(express.json())

// update Projects without the images

router.patch('/:id', checkUser, async (req, res) => {
  const { id } = req.params
  //Setting the new Projects
 const location = req.body.location.split(',')
 const data = req.body
 data.location.country = location[0]
 data.location.city = location[1]
 data.location.district = location[2]
 data.location.street = location[3] || ''
 data.location.door = location[4] || ''

  data.owner = {
    name: req.user.fullName,
    picture: req.user.picture,
    email: req.user.email,
    phone: req.user.phone,
  }
  //Check the Projects exists
  const toBeUpdated = await Projects.findById(id)
  if (!toBeUpdated) return res.send({ error: "Projet n'existe pas!" })
  data.images = toBeUpdated.images
  try {
    await Projects.findByIdAndUpdate(id, data)
    return res.send({ msg: 'Projet mis a jour!' })
  } catch (error) {
    return res.send({ error: error.message })
  }
})
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  //Check the Projects exists
  const toBeDeleted = await Projects.findById(id)
  if (!toBeDeleted) return res.send({ error: "Projet n'existe pas!" })

  try {
    await Projects.findByIdAndDelete()
    if (toBeDeleted.images) {
      toBeDeleted.images.forEach((item) => fs.unlinkSync(destination + item))
    }
    return res.send({ msg: 'Projet supprimé' })
  } catch (error) {
    return res.send({ error: error.message })
  }
})

// the get routes
router.get('/', async (req, res) => {
  const { cursor, country, city, q, document } = req.query
  const query = {}

  if (cursor) {
    query._id = { $lt: cursor }
  }
  if (country) {
    query['location.country'] = country
  }
  if (city) {
    query['location.city'] = city
  }
  if (document) {
    query.document = document
  }
  if (q) {
    query.name = { $regex: q, $options: 'i' }
  }
  try {
    const allProjects = await Projects.find(query, null, {
      sort: { _id: -1 },
      limit: 5,
    })
    return res.send(allProjects)
  } catch (error) {
    return res.send({ error: error.message })
  }
})

export default router
