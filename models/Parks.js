const mongoose = require('mongoose');



const parkSchema = new mongoose.Schema({
	name: {type: String},
	parkCode: String,
	latLong: {type: String},
	notes: [String]
})

const Park = mongoose.model('Park', parkSchema)

module.exports = Park