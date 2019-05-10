const mongoose = require('mongoose');



const parkSchema = new mongoose.Schema({
	name: {type: String, unique: true, required: true},
	notes: [String]
})

const Park = mongoose.model('Park', parkSchema)

module.exports = Park