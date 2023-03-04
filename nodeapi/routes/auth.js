const { genSalt, hash, compare } = require("bcryptjs");
const express = require("express");
const { body, validationResult } = require("express-validator");
const { sign } = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchHandle");
// const  mongoose = require("mongoose");
const UserSchema = require("../models/User");
const router = express.Router();

const JwtSecret = "myKey";

const addUserHandle = async (req, res) => {

    // Validate data with schema 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    try {
        // check for uniqueness or duplicate data
        let user = await UserSchema.findOne({ username: req.body.username });
        if (user) {
            console.log(`console user : ${req.body.username} already exist `);
            return res.status(400).json({ error: `client user : ${req.body.username} already exist ` })
        }

        const salt = await genSalt(10);
        secretPassword = await hash(req.body.password, salt);

        // add data to collection 

        // two ways of adding data to collection
        // 1
        user = UserSchema({
            username: req.body.username,
            password: secretPassword,
            email: req.body.email

        });
        // user.password = secretPassword;
        // 2 
        // user = await UserSchema.create({
        //     username:   req.body.username,
        //     password:   secretPassword,
        //     email:      req.body.email
        // });
        user.save();

        // adding jwt token
        const data = {
            user: {
                id: user.id
            }
        }
        const jwtToken = sign(data, JwtSecret, (err, token) => {
            console.log(`data.id : ${data.user.id}`);
            res.json({ token });
        })

        // display validated data and send response
        console.log(req.body)
        // res.send(user);
    } catch (error) {
        console.log(error);
        return res.status(500).send("error occured");
    }

}

const loginHandle = async (req, res) => {

    // validate result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    // extract email and password from request qurey
    const { email, password } = req.body;

    try {
        // try to find if email ID matched with DB
        let user = await UserSchema.findOne({ email: email });

        // if email id not found then show following error
        if (!user) {
            console.log(`log email : ${user.email} not found`);
            return res.status(400).json({ errors: `client email : ${user.email} not found ` });
        }

        // compare password
        // compare(input_passowrd, hash_password_in_DB)
        const passwordCompare = await compare(password, user.password);
        // return error if password dont match 
        // ususally error output to user/client are same but here they are different for learning purpose  
        if (!passwordCompare) {
            console.log(`log password : ${password} | not matched`);
            return res.status(400).json({ errors: `client password : ${user.password} not matching ` });
        }

        // as both if statements are passed then user is valid
        // now return json token
        const data = {
            user: {
                id: user.id
            }
        }
        const jwtToken = sign(data, JwtSecret, (err, token) => {
            console.log(`token sent : ${token}`);
            return res.json({ token });
        })

    } catch (error) {
        // if there is server side error
        console.log({ error });
        return res.status(500).send(`catch internal server error : ${error} `);
    }
}

const userDetailHandle = async(req,res) =>{
    // if fetch user varifes token
    // it replace token in req to original data
    try {
        // now data found using id which is unique
        const userID = req.user.id;
        const user = await UserSchema.findById(userID).select("-password");
        // const user = await UserSchema.find();

        // send the fetched data back to user
        res.send(user);
    } catch (error) {
        res.status(500).send(`user detail server error \n ${error}`)
    }
}

addUserValidator = [
    body("username").isLength({ min: 3, max: 20 }),
    body("email").isEmail()
]

loginValidator = [
    body("email").exists(),
    body("password").exists()
]

router.post('/addUser', addUserValidator, addUserHandle);

router.post("/login", loginValidator, loginHandle);

router.post("/userDetails",fetchUser,userDetailHandle);

module.exports = router