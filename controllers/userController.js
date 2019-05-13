const express = require('express');
const router = express.Router();
const User = require('../models/user')
const bcrypt = require('bcryptjs');




// Post/register this route will allow users to register an acct.
router.post('/register', async (req,res)=>{
	console.log(req.body);
	console.log("you are hitting the route");
	const password = req.body.password
	const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

	const userDBEntry = {};

	userDBEntry.username = req.body.username
	userDBEntry.password = passwordHash



	try{
		const createdUser = await User.create(userDBEntry);
		await createdUser.save()
		
		req.session.logged = true
		req.session.username = userDBEntry.username


		res.json({
			status: 200,
			data: "login success"
		})
	}catch(error){
		req.session.message = "Username or Password is incorrect!"
		res.send(error)
	}
})




// Post/login this route allows returning users to log back in

router.post('/login', async(req,res, next)=>{
	try{
		const foundUser = User.findOne({'username': req.body.username})

		if(foundUser !== null){
			if(bcrypt.compareSync(req.body.password, foundUser.password)=== true){
				req.session.logged = true;
				req.session.userDbId = foundUser._id
				res.status(200).json({
					status:200
				})
			}
			else{
				req.session.message = "Username or password incorrect"
			}
		}
	}catch(error){
		next(error)
	}
})




// Put/{username} this route will allow users to update their acct info  







// Delete/logout this route allows users to logout/destroys session











module.exports = router;