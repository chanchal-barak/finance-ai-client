const mongoose = require("mongoose");

const SavingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  savedAmount: { type: Number, default: 0 },
  deadline: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Saving", SavingSchema);
