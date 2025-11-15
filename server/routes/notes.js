const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { createNote, getNotes,editNote,pinNote,deleteNote} = require("../controllers/noteController");

router.post("/create", auth, createNote);
router.get("/", auth, getNotes);
router.put("/edit/:id", auth, editNote);
router.put("/pin/:id", auth, pinNote);
router.delete("/delete/:id", auth, deleteNote);

module.exports = router;
