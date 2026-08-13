const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Cow = require('./models/Cow');
const User = require('./models/User'); // 회원 모델 (아직 없다면 아래 안내 참고)

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB 연결 (하드코딩된 URI 대신 환경변수 우선 사용, 없으면 기존 URI 사용)
const uri = process.env.MONGODB_URI || "mongodb+srv://wotns627_db_user:4z1GcvsYUfWLcln7@wotns627.3itoagd.mongodb.net/?appName=wotns627";

mongoose.connect(uri)
  .then(() => console.log('데이터베이스 연결 성공!'))
  .catch(err => console.error('연결 실패:', err));

// ==========================================
// 1. 소(Cow) 관련 API
// ==========================================

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


// ==========================================
// 2. 인증(Auth) 관련 API (회원가입, 로그인, 아이디 찾기)
// ==========================================

// 회원가입 API
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, password, name, email, phone, address } = req.body;

    if (!username || !password || !name || !email || !phone || !address) {
      return res.status(400).json({ success: false, message: '모든 항목을 입력해주세요.' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: '이미 존재하는 아이디입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: hashedPassword,
      name,
      email,
      phone,
      address,
    });

    res.json({ success: true, message: '회원가입이 완료되었습니다.' });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ success: false, message: '서버 내부 오류가 발생했습니다.' });
  }
});

// 로그인 API
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password, autoLogin } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }

    const secret = process.env.JWT_SECRET || 'smart_farm_secret_key';
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      secret,
      { expiresIn: autoLogin ? '30d' : '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: autoLogin ? 60 * 60 * 24 * 30 * 1000 : 60 * 60 * 24 * 1000,
      path: '/',
    });

    res.json({ success: true, message: '로그인 성공', token });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ success: false, message: '서버 내부 오류가 발생했습니다.' });
  }
});

// 아이디 찾기 API
app.post('/api/auth/find', async (req, res) => {
  try {
    const { action, name, email } = req.body;

    if (action === 'findId') {
      const user = await User.findOne({ name, email });
      if (!user) {
        return res.status(404).json({ success: false, message: '일치하는 정보가 없습니다.' });
      }
      return res.json({ success: true, message: `고객님의 아이디는 [ ${user.username} ] 입니다.` });
    }

    res.status(400).json({ success: false, message: '잘못된 요청입니다.' });
  } catch (err) {
    console.error('Find Error:', err);
    res.status(500).json({ success: false, message: '서버 내부 오류가 발생했습니다.' });
  }
});


// ==========================================
// 서버 실행 설정 (로컬 및 Vercel 배포 양쪽 지원)
// ==========================================

// 로컬에서 실행할 때 (node server.js)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
  });
}

// Vercel 서버리스 배포를 위한 내보내기
module.exports = app;