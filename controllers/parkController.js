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
	
	console.log("hitting the route!");
	console.log(req.query)

	let searchTerm = req.query.parkCode
	
			try{
				superagent.get(`https://developer.nps.gov/api/v1/campgrounds?parkCode=${searchTerm}&api_key=${process.env.API_KEY}`)
				.then((data)=>{

					// console.log("here is the data: ")
					// console.log(data)

					// console.log("data.body:")
					// console.log(data.body)

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
	// console.log("this is req.body");
	// console.log(req.body);
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

//


router.get('/:id/campgrounds', (req,res)=>{
	Park.findById(req.params.id, (error, foundPark)=>{
		superagent.get(``)
			.then((data)=>{
				res.status(200).json({
					status: 200,
					data: JSON.parse(data.text)
				})
			})
			.catch((error)=>{
				res.status(400).json({
					status:400,
					error: error
				})
			})
	})
})




/*
"data": [
        {
            "regulationsurl": "",
            "weatheroverview": "The Badlands weather is variable and unpredictable with temperature extremes ranging from 116° F to -40° F. Summers are hot and dry with occasional violent thunderstorms. Hailstorms and occasional tornadoes can descend on the Badlands with sudden fury. Winters are typically cold with 12 to 24 inches of total snowfall.",
            "campsites": {
                "other": "0",
                "group": "0",
                "horse": "0",
                "totalsites": "0",
                "tentonly": "0",
                "electricalhookups": "0",
                "rvonly": "0",
                "walkboatto": "0"
            },
            "accessibility": {
                "wheelchairaccess": "The Cedar Pass Campground has two campsites that are fully accessible by wheelchair and one accessible site in the group loop. These sites are designated for wheelchair users, but are available on a first-come, first-served basis. They may not be available, if the campground is full. The campground has many level sites, which can be negotiated by wheelchair users. Restrooms and the automated fee machine are accessible.",
                "internetinfo": "Cedar Pass Lodge has free wifi.",
                "rvallowed": "1",
                "cellphoneinfo": "Cell phones may have service depending on what carrier you have.  ATT and Verizon work best but are still spotty.",
                "firestovepolicy": "The vast open prairies of the Badlands contain a variety of plants and animals. This variety and the relative openness make the Badlands a naturalist's paradise. In an effort to maintain the prairie grassland, fires are not allowed within Badlands National Park. You may use small, portable propane grills at your campsite for cooking.",
                "rvmaxlength": "0",
                "additionalinfo": "",
                "trailermaxlength": "0",
                "adainfo": "The Cedar Pass Campground has two campsites that are fully accessible by wheelchair and one accessible site in the group loop. These sites are designated for wheelchair users, but are available on a first-come, first-served basis. They may not be available, if the campground is full. The campground has many level sites, which can be negotiated by wheelchair users. Restrooms and the automated fee machine are accessible.",
                "rvinfo": "The Cedar Pass Campground has two campsites that are fully accessible by wheelchair and one accessible site in the group loop. These sites are designated for wheelchair users, but are available on a first-come, first-served basis. They may not be available, if the campground is full. The campground has many level sites, which can be negotiated by wheelchair users. Restrooms and the automated fee machine are accessible.",
                "accessroads": [
                    "Paved Roads - All vehicles OK"
                ],
                "trailerallowed": "1",
                "classifications": [
                    "Limited Development Campground"
                ]
            },
            "directionsoverview": "The Sage Creek Campground is located off of South Dakota State Highway 377.",
            "reservationsurl": "",
            "directionsUrl": "",
            "reservationssitesfirstcome": "",
            "name": "Cedar Pass Campground",
            "regulationsoverview": "",
            "latLong": "",
            "description": "Located near the Ben Reifel Visitor Center, the Cedar Pass Campground has 96 level sites with scenic views of the badlands formations.  This campground offers flush toilets and coin operated showers in the summertime.",
            "reservationssitesreservable": "",
            "parkCode": "badl",
            "amenities": {
                "trashrecyclingcollection": "Yes - year round",
                "toilets": [
                    "Vault Toilets - year round"
                ],
                "internetconnectivity": "No",
                "showers": [
                    "None"
                ],
                "cellphonereception": "No",
                "laundry": "No",
                "amphitheater": "",
                "dumpstation": "No",
                "campstore": "No",
                "stafforvolunteerhostonsite": "No",
                "potablewater": [
                    "No water"
                ],
                "iceavailableforsale": "No",
                "firewoodforsale": "No",
                "ampitheater": "No",
                "foodstoragelockers": "No"
            },
            "id": "2355",
            "reservationsdescription": ""
        },
        {
            "regulationsurl": "",
            "weatheroverview": "The Badlands weather is variable and unpredictable with temperature extremes ranging from 116° F to -40° F. Summers are hot and dry with occasional violent thunderstorms. Hailstorms and occasional tornadoes can descend on the Badlands with sudden fury. Winters are typically cold with 12 to 24 inches of total snowfall.",
            "campsites": {
                "other": "0",
                "group": "0",
                "horse": "0",
                "totalsites": "0",
                "tentonly": "0",
                "electricalhookups": "0",
                "rvonly": "0",
                "walkboatto": "0"
            },
            "accessibility": {
                "wheelchairaccess": "",
                "internetinfo": "",
                "rvallowed": "0",
                "cellphoneinfo": "",
                "firestovepolicy": "The vast open prairies of the Badlands contain a variety of plants and animals. This variety and the relative openness make the Badlands a naturalist's paradise. In an effort to maintain the prairie grassland, fires are not allowed within Badlands National Park. You may use small, portable propane grills at your campsite for cooking.",
                "rvmaxlength": "0",
                "additionalinfo": "",
                "trailermaxlength": "0",
                "adainfo": "",
                "rvinfo": "",
                "accessroads": [],
                "trailerallowed": "0",
                "classifications": []
            },
            "directionsoverview": "",
            "reservationsurl": "",
            "directionsUrl": "",
            "reservationssitesfirstcome": "",
            "name": "Sage Creek Campground",
            "regulationsoverview": "",
            "latLong": "",
            "description": "Sage Creek Campground is a primitive campground.  There is no charge to stay here and camping is available on a first come first serve basis.  The campground rarely fills to capacity.",
            "reservationssitesreservable": "",
            "parkCode": "badl",
            "amenities": {
                "trashrecyclingcollection": "Yes - year round",
                "toilets": [
                    "Vault Toilets - year round"
                ],
                "internetconnectivity": "No",
                "showers": [
                    "None"
                ],
                "cellphonereception": "No",
                "laundry": "No",
                "amphitheater": "",
                "dumpstation": "No",
                "campstore": "No",
                "stafforvolunteerhostonsite": "No",
                "potablewater": [
                    "No water"
                ],
                "iceavailableforsale": "No",
                "firewoodforsale": "No",
                "ampitheater": "No",
                "foodstoragelockers": "No"
            },
            "id": "2356",
            "reservationsdescription": ""
        }
    ],
    "limit": "50",
    "start": "1"
}
*/







module.exports = router;