const Cow = require('../models/Cow.model');

// 소 전체 목록 가져오기
exports.getAllCows = async (req, res) => {
  try {
    const cows = await Cow.find();
    res.json(cows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 새 소 등록하기
exports.addCow = async (req, res) => {
  const cow = new Cow(req.body);
  try {
    const newCow = await cow.save();
    res.status(201).json(newCow);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};