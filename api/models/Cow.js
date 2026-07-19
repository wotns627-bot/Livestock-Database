// models/Cow.js 파일 내용
const mongoose = require('mongoose');

const cowSchema = new mongoose.Schema({
  penNumber: String,     // 사육칸번호
  cowNumber: String,     // 개체번호
  entryDate: Date,       // 입식일
  birthDate: Date,       // 생년월일
  kpn: String,           // KPN
  nurturing: String,     // 냉도체
  density: String,       // 배치단위면적
  fatness: String,       // 등지방두께
  method: String,        // 근내지방도
  breeder: String        // 번식자
});

module.exports = mongoose.model('Cow', cowSchema);