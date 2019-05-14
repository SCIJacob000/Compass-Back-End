const express = require('express');
const router = express.Router();
const Parks = require('../models/Parks')
const Note = require('../models/notes')







// Put/notes/:id/edit this route allows users to update their notes on their experiences
router.put('/:id', (req,res)=>{
	try{
		const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {new: true})
		res.status(200).json({
			status: 200,
			data: updatedNote
		})
	}
	catch(error){
		res.status(400).json({
			status: 400,
			error: error
		})
	}
})


// Delete/notes this route will allow users to delete their notes on a certain experience

router.delete('/:id', async (req,res)=>{
	try{
		const deletedNote = await Note.findByIdAndRemove(req.params.id)
		const foundPark = await Parks.findOne({'notes': req.params.id})
		await foundPark.notes.remove(req.params.id)
		await foundPark.save()
		res.status(200).json({
			status: 200,
			data: deletedNote
		})
	}
	catch(error){
		res.status(400).json({
			status: 400,
			data: deletedNote
		})
	}
})









module.exports= router;