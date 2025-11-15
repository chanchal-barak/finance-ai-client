const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  userId: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
  pinned: { type: Boolean, default: false }

});

module.exports = mongoose.model("Note", NoteSchema);
