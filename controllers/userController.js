const express = require('express');
const router = express.Router();
const User = require('../models/user')
const bcrypt = require('bcryptjs');




// Post/register this route will allow users to register an acct.
router.post('/register', async (req,res,next)=>{
	try{
		const password = req.body.password
		const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
		const userDBEntry = {};
		userDBEntry.username = req.body.username
		userDBEntry.password = passwordHash
		const createdUser = await User.create(userDBEntry);
		await createdUser.save()
		req.session.userDbId= createdUser._id
		req.session.logged = true
		req.session.username = createdUser.username
		res.json({
			status: 200,
			data: createdUser
		})
	}catch(error){
		req.session.message = "Username or Password is incorrect!"
		res.json({
			error: error
		})
	}
})




// Post/login this route allows returning users to log back in

router.post('/login', async(req,res)=>{
	try{
		const foundUser = await User.findOne({'username': req.body.username})
		console.log(foundUser)
		if(foundUser !== null){
			if(bcrypt.compareSync(req.body.password, foundUser.password) === true){
				req.session.logged = true;
				req.session.username = foundUser._id
				res.status(200).json({
					status:200,
					data: foundUser
				})
			}
			else{
				res.status(400).json({
					status: 400,
					data: "Invalid Login Params",
					wut: "bad pass"

				})
			}
		}
		else{
			res.status(400).json({
				status: 400,
				data: "Invalid Login Params",
				wut: "no user"
			})
		}
	}catch(error){
		res.status(400).json({
			status: 400,
			error: error
		})
	}
})



// Delete/logout this route allows users to logout/destroys session

router.get('/logout', async(req,res)=>{
	try{
		const destroyedSession = await req.session.destroy()
		res.status(200).json({
				status: 200
			})
			
		}catch(error){
			res.status(400).json({
				status: 400,
				error: error
			})
		}
	})











module.exports = router;