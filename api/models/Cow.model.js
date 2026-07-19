const mongoose = require('mongoose');

const CowSchema = new mongoose.Schema({
  farmId: String,
  cowNumber: String,
  kpn: String,
  meat: String,
  breeding: String,
  fat: String,
  growth: String,
  owner: String
});

module.exports = mongoose.model('Cow', CowSchema);