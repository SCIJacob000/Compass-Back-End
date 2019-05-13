const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cors = require('cors')
const session = require('express-session')
const app = express();
require('dotenv').config()
const superagent = require('superagent');

//require db
require ('./db/db.js')


const PORT = process.env.PORT

//require controllers


//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())

app.use(session({
	secret:process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}))

const userController = require('./controllers/userController')
const parkController = require('./controllers/parkController')
const tripController = require('./controllers/tripController')


app.use('/users', userController);

// this will be refactored to account for the logged in features!
// app.use((req,res, next) => {
// 	if (!req.session.logged) {
// 		res.redirect('/users/login')
// 	} else{
// 		next()
// 	}
// })

//Get/alerts this route gets all alerts for all nat parks

app.get('/alerts', (req,res,next)=>{
	superagent.get('https://developer.nps.gov/api/v1/alerts?api_key=' + process.env.API_KEY)
	.then((data)=>{

		const actualData = data.body.data//.data.articles.map(a => a.author)
      	const justTheDataWeNeed = actualData.map(article => {
      		return {
		         title: article.title,
		         description: article.description,
		         category: article.category
	        }
	    })
		res.status(200).json({
			status: 200,
			data: justTheDataWeNeed,
			description: data.body.data.description,
			category: data.body.data.category
		})
	}).catch((error)=>{
		res.status(400).json({
			status: 400,
			error: error
		})
	})
})












app.listen(PORT, () => {
	console.log('app is listening on port: ', PORT);
})