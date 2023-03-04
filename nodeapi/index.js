const DB = require("./models/VSCodeDB")
// var http = require("http");
const express = require("express");
const router = require("./routes/auth");

app = express();
const port = 5000;
app.use(express.json());
DB();

app.get("/",(req,res)=>{res.send("holla");});

app.use("/auth",router);

app.listen(port, () => {
    console.log(`listeneing to ${port}`)
});



