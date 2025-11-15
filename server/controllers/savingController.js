const Saving = require("../models/Saving");

exports.createSaving = async (req, res) => {
  try {
    const { title, targetAmount, savedAmount, deadline } = req.body;

    const saving = new Saving({
      userId: req.user.id,
      title,
      targetAmount,
      savedAmount,
      deadline
    });

    await saving.save();
    res.json(saving);
  } catch (err) {
    res.status(500).json({ message: "Error creating saving" });
  }
};

exports.getSavings = async (req, res) => {
  try {
    const savings = await Saving.find({ userId: req.user.id });
    res.json(savings);
  } catch (err) {
    res.status(500).json({ message: "Error loading savings" });
  }
};
exports.addAmount = async (req, res) => {
  try {
    const { amount } = req.body;

    const saving = await Saving.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!saving) return res.status(404).json({ message: "Goal not found" });

    saving.savedAmount += Number(amount);

    await saving.save();

    res.json(saving);
  } catch (err) {
    res.status(500).json({ message: "Could not update saving amount" });
  }
};
