const mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
    username:
    {
        type: String,
        // required: true
    },
    email:
    {
        type: String,
        // unique: true,
        // required: true
    },
    password:
    {
        type:String
    },
    date: 
    {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("userSchema", UserSchema) 
