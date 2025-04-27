import Listing from '../../models/listings/listing.mjs'
import express, { Router } from 'express'
import fs from 'node:fs'
import path from 'node:path'
import residenceRouter from './residence.mjs'
import commercialRouter from './commercial.mjs'
import passport from 'passport'
import '../../strategies/jwt.mjs'
//import listing from '../../models/listings/listing.mjs'
// Setting the destination path for product photos
const root = path.resolve()
const destination = path.join(root, '/public/')
const router = Router()

router.use('/residence', residenceRouter)
router.use('/commercial', commercialRouter)

router.use(express.json())



// Get all Listing

router.get('/', async (req, res) => {
  const { type, cursor } = req.query
  const query = {}
  console.log("Inside get residence!");
  if (type) {

    console.log(type)
    query.type = type
  }
  
  if (cursor) {
    query._id = {$lt:cursor}
  }
  try {
    const allListings = await Listing.find(query, null, {limit: 5, sort: {_id:-1}})
    return res.send(allListings)
  } catch (error) {
    return res.send({ error: error.message })
  }
})
// Search
router.get("/search", async (req, res) => {
  const { q, type, category } = req.query 
  const query = {}
  if (q) {
    query['$or'] = [
      { title: { $regex: q, $options: i } },
      { location: { $regex: q, $options: i } },
    ] 
  }
  if (type) {
    query.type = type
  }
  if (category) {
    query.adType = category
  }

  try {
    const searchOptions = await Listing.find(query)
    return res.send(searchOptions)
  } catch (error) {
    return res.send({error: error.message})
  }
})
router.get('/filter', async (req, res) => {
  const { type, adType, country, price, cursor } = req.query
  const query = {}
  if (type) {
    query.type = type
  }
  if (cursor) {
    console.log(cursor)
    query._id = { $gt: cursor }
  }
  if (adType) {
    query.adType = adType
  }
   if (country) {
     query["location.country"] = country
    }

  try {
    const filteredListing = await Listing.find(query, null, {
      limit: 5,
      sort: { price: Number(price)||1 },
    })
    return res.send(filteredListing)
  } catch (error) {
    return res.send({ error: error.message })
  }
})

//
router.get("/homeSearch", async (req, res) => {
  const { q, adType, type, cursor, country } = req.query
  const query = {}
   if (type) {
     query.type = type
   }
   if (cursor) {
     console.log(cursor)
     query._id = { $gt: cursor }
   }
  if (q) {
    query.title =  {$regex: q, $options: 'i'}
  }
   if (adType) {
     query.adType = adType
   }
   if (country) {
     query['location.country'] = country
   }
   try {
     const filteredListing = await Listing.find(query, null, {
       limit: 5
     })
     return res.send(filteredListing)
   } catch (error) {
     return res.send({ error: error.message })
   }
})


// Delete Listing

router.delete("/:id", async (req, res) => {
  const { id } = req.params 
  
  const toBeDeleted = await Listing.findById(id)
  if (!toBeDeleted) return res.send("Listing not found")
  
  try {
    await Listing.findByIdAndDelete(id)
    try {
      toBeDeleted.images.forEach(item => {fs.unlinkSync(destination + item)})
    } catch (error) {
      
    }
    
    return res.send({msg: "Deleted with success!"})
  } catch (error) {
    return res.send({error: error.message})
  }
})

router.get('/special/:id', async (req, res) => {
  const { id } = req.params
  const residence = await Listing.findById(id)
  if (!residence) return res.send({ error: `Residence not found!` })
  const location =
    residence.location.country +
    ',' +
    residence.location.city +
    ',' +
    residence.location.district +
    ',' +
    residence.location.street +
    ',' +
    residence.location.door
  const area = Object.values(residence.area).join('/')
  const floor = Object.values(residence.details.floor).join('/')
  const heating = Object.values(residence.details.heating).join('/')
  const numOfRooms = Object.values(residence.details.numberOfRooms).join('+')
  const steps = {}
  steps['step1'] = {
    type: residence.type,
    age: residence.age,
    location,
    title: residence.title,
    usage: residence.usage,
  }
  steps['step2'] = {
    adType: residence.adType,
    area,
    category: residence.category,
    price: residence.price,
  }
  steps['step3'] = {
    floor,
    furnishing: residence.details.furnishing,
    heating,
    numOfRooms,
    numOfToilets: residence.details.numberOfToilets,
  }
  steps['step4'] = {
    description: residence.description,
    images: residence.images,
    state: residence.details.state,
  }

  return res.send(steps)
})
// Get one Listing
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const singleListing = await Listing.findById(id)
    if (!singleListing) return res.send({ error: 'No listing found!' })

    return res.send(singleListing)
  } catch (error) {
    return res.send({ error: error.message })
  }
})




export default router
