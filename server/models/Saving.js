const mongoose = require("mongoose");

const savingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  savedAmount: { type: Number, default: 0 },
  deadline: Date
}, { timestamps: true });

module.exports = mongoose.model("Saving", savingSchema);
