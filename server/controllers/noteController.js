const Note = require("../models/Note");

exports.createNote = async (req, res) => {
  const note = new Note({
    userId: req.user.id,
    text: req.body.text
  });
  await note.save();
  res.json(note);
};

exports.getNotes = async (req, res) => {
  const notes = await Note.find({ userId: req.user.id });
  res.json(notes);
};
exports.editNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    note.text = req.body.text;
    await note.save();

    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Error editing note" });
  }
};

exports.pinNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    note.pinned = !note.pinned;
    await note.save();

    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Error pinning note" });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    await Note.deleteOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting note" });
  }
};
