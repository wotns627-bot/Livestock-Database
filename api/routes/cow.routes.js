const express = require('express');
const router = express.Router();
const Cow = require('../models/Cow.model');

// 모든 소 목록 가져오기
router.get('/', async (req, res) => {
  try {
    const cows = await Cow.find();
    res.json(cows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;