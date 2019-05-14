const express = require('express');
const router = express.Router();


//there is full CRUD functionality on the notes!!!



// Post/notes this route will allow users to make notes on their recent experience assigned to specific park!!!
router.post('/', async (req,res,next)=>{
	const foundPark = await Parks.findById(req.params.id)
	foundPark.notes.push(req.body)
	await foundPark.save()
})








// Put/notes/:id/edit this route allows users to update their notes on their experiences







// Delete/notes this route will allow users to delete their notes on a certain experience











module.exports= router;