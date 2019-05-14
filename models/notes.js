const mongoose = require('mongoose');


const noteSchema = new mongoose.Schema({
	content:{type: String, required: true}
})

const Note = mongoose.model('note' noteSchema);

module.exports= Note;