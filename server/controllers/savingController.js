const Saving = require("../models/Saving");

exports.createSaving = async (req, res) => {
  const saving = await Saving.create({
    ...req.body,
    userId: req.user.id
  });
  res.json(saving);
};

exports.getSavings = async (req, res) => {
  res.json(await Saving.find({ userId: req.user.id }));
};

exports.addAmount = async (req, res) => {
  const saving = await Saving.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  saving.savedAmount += Number(req.body.amount);
  await saving.save();

  res.json(saving);
};
