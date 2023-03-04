# Backend

## Connecting to mongoDB using mongoose

- Export file

```js
const mongoose = require("mongoose");
// URL
const mongooseURL = "mongodb://localhost:27017/VSCodeDB";

//connection
// mongoose.connect(url, buffer command)
const ConnectDB = async () => {
  await mongoose.connect(mongooseURL, () => {
    console.log("DB connected succesfully");
  });
};
```

- index.js

```js
const DB = require("./above_file_name_with_path");
DB();
```

## Creating Schema

- Export file "User.js"

```js
const mongoose = reuqire("mongoose");

var UserSchema = new mongoose.Schema({
    username:{
        type:    String,
        requred: true
    }
    .
    .
    .
    date:{
        type: Date,
        default: Date.now
    }
});

model.exports = mongoose.model("SchemaName",UserSchame )
```

- Main file

```js
const MySchema = require("./User");
// then MySchema can be used for CURD operations Eg.
/*
    let user = await MySchema.findone({username: someInput});
*/
```

## Working with GET/POST request to save data to DB

- For working without authentaction, add following to header
  - Content-Type : application/json
- For saving data

  - In index.js code for connecting to DB is there
    ```js
    const DB = require("./models/VSCodeDB");
    DB();
    ```
  - Route for saving data to DB

    ```js
    // for get
    const express = requrie("express");
    const router = express.Router();

    // importing schema
    const User = require("./models/User"); //User.js

    // converting data to schema

    // 1st way
    const userFn = (req, res) => {
      const user = User(req.body);
      user.save();
    };

    // 2nd way
    // use this if input qurey schema dont match with schema
    const userFn = async (req, res) => {
      user = await User.create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
      });
      user.save();
    };

    router.get("/temp", userFn);

    // for POST
    // router.post("/temp",userFn);

    module.exports = router;
    ```

# Adding data validator

- It is added so if schema if not valid so server wont shut down and only error is shown

```js
const express = require("express");
const router = express.Router();
const { body, validateResult } = require("express-validator");

const userFn = async (req, res) => {
  // get the error from validator
  const error = validationResult(req);
  // error message is not empty so there is an error
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }
  let user = User.findOne({ email: req.body.email });

  // if user already exists so it dont goes to schema and crash server
  if (user) {
    return res.status(400).json({ error: "user already exists" });
  }

  user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  user.save();
};

// validator syntex
// body("parameter","error message").validation_criteria
const userValidator = [
  body("username", "enter valid name").isLength({ min: 3 }),
  body("email", "enter valid name").isEmail(),
  body("password", "enter valid name").isLength({ min: 3 }),
];

router.get("/temp", userValidator, userFn);

// for POST
// router.post("/temp", userValidator, userFn);

module.exports = router;
```

# Password hashing and salt

- Password as stored in to be secured even if the database is hacked
- To do this a function is used to convert password to hash
- This is one way function we cant get output from input
- even with change in one character entire hash changes
- To further add security additionally a some character are added to end
- These character in collective sense called salt

```js

const userFn = async (req,res)=>{
    const error = validationReult(req);
    if(!error.isEmpty()){
        res.status(400).json(error:error.array());
    }
    let user = await User.findOne({email : req.body.email});
    if (user){
        return res.status(400).json({error:"user already exists"})
    };

    // adding salt and encrypting password
    const salt = await bcrypt.genSalt(10);
    const secpass = await bcrypt.hash(req.body.password, salt);

    user = await User.create({
        username:   req.body.username,
        password:   secpass,
        email:      req.body.email
    })
    user.save();
    res.json(user.password);
}

```

# JWT webtoken

- Once user is validated on website so for that session user need not to be validated again and again
- for this a token is provided which will be used to further for all requests

```js
// JWT secret key
const myKey = "jwtSecretKey";

const userFn = async (req,res)=>{
    const error = validationResults(req);
    .
    .
    .
    user.save();

    // data that will be stored in jwt Token
    const data = {
        user : {
            id : user.id
        }
    }

    // genetating token
    const jwtToken = jwt.sign(data,myKey,(err,token)=>{
        res.json({token});
    })

}

```

# login endpoint

- If user login then send JWT token

```js
const loginFn = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }
  let user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json({ error: "user dont exist" });
  }

  // extract the input given by user
  const { username, password } = res.body;

  try {
    // try to find if email ID matched with DB
    let user = await UserSchema.findOne({ email: email });

    // if email id not found then show following error
    if (!user) {
      console.log(`log email : ${user.email} not found`);
      return res
        .status(400)
        .json({ errors: `client email : ${user.email} not found ` });
    }

    // compare password
    // compare(input_passowrd, hash_password_in_DB)
    const passwordCompare = await compare(password, user.password);
    // return error if password dont match
    // ususally error output to user/client are same but here they are different for learning purpose
    if (!passwordCompare) {
      console.log(`log password : ${password} | not matched`);
      return res
        .status(400)
        .json({ errors: `client password : ${user.password} not matching ` });
    }

    // as both if statements are passed then user is valid
    // now return json token
    const data = {
      user: {
        id: user.id,
      },
    };
    const jwtToken = sign(data, JwtSecret, (err, token) => {
      console.log(`token sent : ${token}`);
      return res.json({ token });
    });
  } catch (error) {
    // if there is server side error
    console.log({ error });
    return res.status(500).send(`catch internal server error : ${error} `);
  }
};
```

# JWT validator middleware

- Token is provided in header
- While testing we need to add token to header with some name and same name should be in JWT validator
-

```js
    const { verify } = require("jsonwebtoken");

    const JWTsecretKey = "myKey";
    
    const JwtValidatorMiddleware = (req,res,next) => {
        // token is taken from header
        const token = req.header('auth-token');

        // if token dont exists
        if(!token)
        {
            res.status(400).send("token not found");
        }

        // if token recived
        try{
            // verify token
            // if valid then extact data from token
            // The secret key must match with that in other files
            const data = verify(token,JWTsecretKey);

            // replace the request with data so it can be further processed
            // user component of request is generated
            req.user = data.user;

            // to exit middleware next is must
            next();
        }
        catch(error){
            res.status(401).send(`internal server error \n ${error}`);
        }
    }
    module.exports = JwtValidatorMiddleware;
```
# getting user details
```js
// middleware to validate JWT token
const fetchUser = require("../middleware/fetchHandle");

const userDetails = async (req,res)=>{
    // if fetch works (JWT is verified) then this function will be executed
    // JWT varifiaction middleware written by us will attach _id with req
    try{
        const userID = req.user.id;
        // all info will be given to user except password
        const user = await UserSchema.findById(userID).select("-password");
        // user below if info of all users is required
        // const user = await UserSchema.find();

        res.send(user);
    }
    catch(error){
        res.send(500).send("internal server error");
    }
}

router.post("/userDetails",fetchUser,userDetailHandle);

```
