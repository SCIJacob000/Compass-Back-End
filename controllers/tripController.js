const express = require('express');
const router = express.Router();
const Park = require('../models/park')
const Trip = require('../models/trip')
const User = require('../models/user')
const session = require('express-session')
const superagent = require('superagent')

//post/ this route will add a park to a trip  
router.post('/parks', async (req, res, next) => {
	try{
		const parkCode = req.query.parkCode
		// console.log(parkCode)
		const foundTrip = await Trip.findOne({'name': req.body.trip});
		// console.log(foundTrip)
			await superagent.get(`https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=${process.env.API_KEY}`)
			.then(async(data)=>{
					res.status(200).json({
						status: 200,
						data: JSON.parse(data.text)
					})
				const newPark = {}; 
				newPark.name = data.fullName
				newPark.parkCode = data.parkCode
				newPark.notes = []

				const createdPark = await Park.create(newPark)
				// console.log("This is the newly created park:");
				// console.log(createdPark);
				foundTrip.parks.push(createdPark)
				await foundTrip.save()
				// console.log("This is the trip the park got pushed to:");
				// console.log(foundTrip);
			}).catch((error, next)=>{
				res.status(400).json({
					status: 400,
					error: error
				})
				
			})		
	}
	catch(error){
		res.status(400).json({
			status: 400,
			error: error
		})
	}
})
//post/ this route will create a new trip and assign it to the logged in user!!!! note to self use session to find user! 
router.post('/', async(req, res)=>{

	console.log("hitting trip post route")
	console.log("req.body:");
	console.log(req.body)

	try{
		const userDbEntry = {}

		userDbEntry.startDate = req.body.startDate
		userDbEntry.endDate = req.body.endDate
		userDbEntry.name = req.body.name
		userDbEntry.parks = []

		console.log("userDbEntry: ")
		console.log(userDbEntry)

		const createdTrip = await Trip.create(userDbEntry)
		console.log(createdTrip);
		const foundUser = await User.findById(req.session.userDbId)
		console.log(foundUser);
		foundUser.trips.push(createdTrip)
		await foundUser.save()
		console.log(foundUser);
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

// router.delete('/:id/park/:parkId')
// const foundTrip = Trip.findById(req.params.id)
// const foundPark = Park.findById(req.params.parkId)
//trips/stops/:{parkId}
//delete this route will delete a park off a trip
//not sure how to go about this route!
//find trip using req.params
router.delete('/:id/park/:parkId', async(req,res)=>{
	try{
		const foundTrip = await Trip.findById(req.params.id)
		const foundPark = await Park.findById(req.params.parkId)
		await foundTrip.parks.remove(foundPark)
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





module.exports = router;