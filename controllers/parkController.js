const express = require('express');
const router = express.Router();
require('dotenv').config()
const superagent = require('superagent');
const Park = require('../models/park')
const Trip = require('../models/trip')
const Note = require('../models/note')


//as of current this is only getting 50 of the 496 parks due to a preset limit query param !!!!!!!!!!!
//Get/parks/ this route is going to get the name lat and long for all natl parks as well as any notes saved to my db for that park
// router.get('/', (req,res, next)=>{
// 	superagent.get('https://developer.nps.gov/api/v1/parks?api_key=' + process.env.API_KEY)
// 	.then((data)=>{
// 		const actualData = JSON.parse(data.text)
// 		console.log(actualData.data);
// 		const justDataNeeded = actualData.data.map((park)=>{
// 			return{
// 				parkCode: park.parkCode,
// 				name: park.fullName,
// 				latLong: park.latLong
// 			}
// 		})
// 		const parks = []
// 		for(let i = 0; i < justDataNeeded.length; i++) {
// 			let newPark = {}
// 			newPark.name = justDataNeeded[i].name,
// 			newPark.parkCode = justDataNeeded[i].parkCode,
// 			newPark.latLong = justDataNeeded[i].latLong,
// 			newPark.notes = []
// 			parks.push(newPark)
// 		}
// 		Parks.create(parks, (err, createParks) => {
// 			if(err){
// 				console.error(err)
// 			} 
// 			else {
// 				res.status(200).json({
// 				status: 200,
// 				data: createParks
// 				})
// 			}
// 		})
// 	}).catch((error)=>{
	
// 		res.status(400).json({
// 			status: 400,
// 			error: error
// 		})
// 	})
// })

//get/parks/{parkCode}this calls the api to get all the info on a certain nat park
router.get('/camps', async(req,res)=>{
	let searchTerm = req.query.parkCode
	
			try{
				superagent.get(`https://developer.nps.gov/api/v1/campgrounds?parkCode=${searchTerm}&api_key=${process.env.API_KEY}`)
				.then((data)=>{
					res.status(200).json({
						status: 200,
						data: data.body.data
					})
				})
				.catch((error)=>{
					res.status(400).json({
						status:400,
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
//Get/ this route gets all info on all parks in a user specified state
router.get('/', (req,res, next)=>{
	console.log(req.query);
	let searchTerm = req.query.stateCode
	console.log("search Term: ", searchTerm)
	superagent.get(`https://developer.nps.gov/api/v1/parks?stateCode=${searchTerm}&api_key=${process.env.API_KEY}`)
	.then((data)=>{
		res.status(200).json({
			status: 200,
			data: data
		})
	}).catch((error)=>{
		res.status(400).json({
			status: 400,
			error: error
		})
		
	})
})

// Post/notes this route will allow users to make notes on their recent experience assigned to specific park!!!
router.post('/:id', async (req,res,next)=>{
	try{
		const createdNote = await Note.create(req.body)
		const foundPark = await Park.findById(req.params.id)
		await createdNote.save()
		foundPark.notes.push(createdNote)
		await foundPark.save()
		res.status(200).json({
			status: 200,
			data: createdNote
		})
	}catch(error){
		res.status(400).json({
			status: 400,
			error: error
		})
	}
})



module.exports = router;