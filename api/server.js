const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Cow = require('./models/Cow');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://wotns627_db_user:4z1GcvsYUfWLcln7@wotns627.3itoagd.mongodb.net/?appName=wotns627";

mongoose.connect(uri)
  .then(() => console.log('데이터베이스 연결 성공!'))
  .catch(err => console.error('연결 실패:', err));

// 소 정보 등록 API
app.post('/api/cows', async (req, res) => {
  try {
    const newCow = new Cow(req.body);
    await newCow.save();
    res.status(201).json({ message: '소 정보 등록 성공!', data: newCow });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 소 전체 목록 조회 API
app.get('/api/cows', async (req, res) => {
  try {
    const cows = await Cow.find();
    res.json(cows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 소 데이터 삭제 API
app.delete('/api/cows/:id', async (req, res) => {
  try {
    await Cow.findByIdAndDelete(req.params.id);
    res.json({ message: '소 정보 삭제 성공!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 소 데이터 수정 API
app.put('/api/cows/:id', async (req, res) => {
  try {
    const updatedCow = await Cow.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: '소 정보 수정 성공!', data: updatedCow });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});