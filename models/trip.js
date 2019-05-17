const mongoose = require('mongoose');
const Park = require('./park')


const tripSchema = new mongoose.Schema({
	startDate: Date,
	endDate: Date,
	name: String,
	parks: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Park'
	}]
})

const Trip = mongoose.model('Trip', tripSchema)

module.exports = Trip;