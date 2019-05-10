const mongoose = require('mongoose');
const Park = require('./Parks')


const tripSchema = new mongoose.Schema({
	startDate: String,
	endDate: String,
	name: String,
	parks: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Park'
	}]
})

const Trip = mongoose.model('Trip', tripSchema)

module.exports = Trip;