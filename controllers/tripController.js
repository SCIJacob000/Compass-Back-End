const express = require('express');
const router = express.Router();
const Park = require('../models/Parks.js')
const Trip = require('../models/Trip')
const User = require('../models/User')

//post/ this route will create a new trip and assign it to the logged in user!!!! note to self use session to find user! 
router.post('/', async(req,res)=>{
	try{
		const createdTrip = await Trip.create(req.body)
		const foundUser = await User.findById(req.session.userDbId)
		foundUser.trips.push(createdTrip)
		await foundUser.save()
		await createdTrip.save()
		res.status(200).json({
			status: 200,
			data: createdTrip
		})
	}
	catch(error){
		res.status(400).json({
			status: 400,
			error: error
		})
	}
})


//delete this route will delete a trip from the logged in user hint: same as above!
router.delete('/:id', async(req,res)=>{
	try{
		const deletedTrip = await Trip.findByIdAndRemove(req.params.id)
		const foundUser = await User.findOne({'trips': req.params.id})
		await foundUser.trips.remove(req.params.id)
		await foundUser.save()
		res.status(200).json({
			status: 200,
			data: deletedTrip
		})

	}
	catch(error){
		res.status(400).json({
			status: 400,
			error: error
		})
	}
})


//not sure if this post is the right thing to do!!!!
//post/ this route will add a park to a trip  
router.post('/:id', async(req,res)=>{
	try{
		const foundTrip = await Trip.findById(req.params.id)
		const foundPark = await Parks.findById(req.params.id)// this is def not right !!!!
		foundTrip.parks.push(foundPark)
		await foundTrip.save()
		res.status(200).json({
			status: 200,
			data: foundTrip
		})
	}
	catch(error){
		res.status(400).json({
			status: 400,
			error: error
		})
	}
})


//delete this route will delete a park off a trip
//not sure how to go about this route!

module.exports = router;