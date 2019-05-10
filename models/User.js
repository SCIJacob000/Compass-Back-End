const mongoose = require('mongoose');
const Trip = require('./Trip');

const userSchema = new mongoose.Schema({
	username: {type: String, required: true},
	password: {type: String, required:true},
	trips: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Trip'
	}]
})

const User = mongoose.model('User', userSchema)

module.exports = User;