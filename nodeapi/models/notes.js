const { Schema, model } = require("mongoose");

var NotesSchema = new Schema({
    username:
    {
        type:String,
    },
    title:
    {
        type:String,
    },
    description:
    {
        type:String
    },
})

module.exports = model("notesSchema",NotesSchema) ;