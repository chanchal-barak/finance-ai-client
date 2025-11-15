const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { createSaving, getSavings,addAmount} = require("../controllers/savingController");

router.post("/create", auth, createSaving);
router.get("/", auth, getSavings);
router.put("/add-amount/:id", auth, addAmount);

module.exports = router;
