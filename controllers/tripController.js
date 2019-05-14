const express = require('express');
const router = express.Router();
const Park = require('../models/Parks.js')
const Trip = require('../models/Trip')
const User = require('../models/User')

//post/ this route will create a new trip and assign it to the logged in user!!!! note to self use session to find user! 
router.post('/', async(req,res)=>{
	try{
		const createdTrip = await Trip.create(req.body)
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



//put/ this route will add a park to a trip  !!!!need help with this one!!!!
router.put('/:id', async(req,res)=>{
	try{

	}
	catch(error){
		res.status(400).json({
			status: 400,
			error: error
		})
	}
})


//delete this route will delete a park off a trip

module.exports = router;