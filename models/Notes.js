const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
  note: {
    type: String,
  }
})

module.exports = mongoose.model("note", notesSchema)