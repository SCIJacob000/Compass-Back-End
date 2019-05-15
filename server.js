const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const session = require('express-session')
const app = express();
require('dotenv').config()
const superagent = require('superagent');

const PORT = process.env.PORT;
//require db
require ('./db/db.js')



//middlewares
app.use(bodyParser.json())


app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}))

//cors middleware
const corsOptions = {
	origin: process.env.CLIENT_URL, 
	credentials: true,
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

//require controllers
const userController = require('./controllers/userController');
const parkController = require('./controllers/parkController');
const tripController = require('./controllers/tripController');
const noteController = require('./controllers/noteController');


app.use('/users', userController);
app.use('/parks', parkController);
app.use('/trips', tripController);
app.use('/notes', noteController);



//Get/alerts this route gets all alerts for all nat parks

app.get('/alerts', (req,res,next)=>{
	superagent.get('https://developer.nps.gov/api/v1/alerts?api_key=' + process.env.API_KEY)
	.then((data)=>{

		const actualData = data.body.data
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