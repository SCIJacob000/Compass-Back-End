const mongoose = require('mongoose');
const Note = require('./note')


const parkSchema = new mongoose.Schema({
	name: {type: String},
	parkCode: String,
	notes: [String]
})

const Park = mongoose.model('Park', parkSchema)

module.exports = Park