const { Router } = require("express");
const fetchUser = require("../middleware/fetchHandle");
const notes = require("../models/notes");


const router = Router();

const fetchNotesHandle = async (req,res) =>{
    try {
        const notesData = await notes.find({user : req.user.id});
        res.json(notesData);
        
    } catch (error) {
        res.status(500).send(`user detail server error \n ${error}`)
    } 
}

router.get("/fetchNotes", fetchUser, fetchNotesHandle);

module.exports = router;