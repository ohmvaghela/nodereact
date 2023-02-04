const mongoose = require("mongoose");
const mongooseURL = "mongodb://localhost:27017/VSCodeDB"; 

const ConnectDB = async ()=>{
  await mongoose.connect(mongooseURL,()=>
    {
        console.log("DB connected succesfully");
    });
}

module.exports = ConnectDB;