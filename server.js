const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cors = require('cors')
const session = require('express-session')
const app = express();
require('dotenv').config()

//require db
require ('./db/db.js')


const PORT = process.env.PORT

//require controllers

//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.use(session({
	secret:process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}))




app.use((req,res, next) => {
	if (!req.session.logged) {
		res.redirect('/users/login')
	} else{
		next()
	}
})

app.listen(PORT, () => {
	console.log('app is listening on port: ', PORT);
})