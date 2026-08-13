const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); // 쿠키 처리를 위해 추가
const Cow = require('./models/Cow');
const User = require('./models/User');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true })); // 크로스브라우징 쿠키 허용
app.use(express.json());
app.use(cookieParser()); // 쿠키 파서 미들웨어 장착

const uri = process.env.MONGODB_URI || "mongodb+srv://wotns627_db_user:4z1GcvsYUfWLcln7@wotns627.3itoagd.mongodb.net/?appName=wotns627";

mongoose.connect(uri)
  .then(() => console.log('데이터베이스 연결 성공!'))
  .catch(err => console.error('연결 실패:', err));

// [기존 Cow API들은 그대로 유지...]
app.post('/api/cows', async (req, res) => {
  try {
    const newCow = new Cow(req.body);
    await newCow.save();
    res.status(201).json({ message: '소 정보 등록 성공!', data: newCow });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.get('/api/cows', async (req, res) => {
  try {
    const cows = await Cow.find();
    res.json(cows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete('/api/cows/:id', async (req, res) => {
  try {
    await Cow.findByIdAndDelete(req.params.id);
    res.json({ message: '소 정보 삭제 성공!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put('/api/cows/:id', async (req, res) => {
  try {
    const updatedCow = await Cow.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: '소 정보 수정 성공!', data: updatedCow });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// ==========================================
// 인증(Auth) 관련 API
// ==========================================

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
    await User.create({ username, password: hashedPassword, name, email, phone, address });
    res.json({ success: true, message: '회원가입이 완료되었습니다.' });
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 내부 오류가 발생했습니다.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password, autoLogin } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }
    const secret = process.env.JWT_SECRET || 'smart_farm_secret_key';
    const token = jwt.sign({ userId: user._id, username: user.username }, secret, { expiresIn: autoLogin ? '30d' : '1d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: autoLogin ? 60 * 60 * 24 * 30 * 1000 : 60 * 60 * 24 * 1000,
      path: '/',
    });
    res.json({ success: true, message: '로그인 성공' });
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 내부 오류가 발생했습니다.' });
  }
});

// 아이디 찾기 API
app.post('/api/auth/find', async (req, res) => {
  try {
    const { action, name, email } = req.body;
    if (action === 'findId') {
      const user = await User.findOne({ name, email });
      if (!user) return res.status(404).json({ success: false, message: '일치하는 정보가 없습니다.' });
      return res.json({ success: true, message: `고객님의 아이디는 [ ${user.username} ] 입니다.` });
    }
    res.status(400).json({ success: false, message: '잘못된 요청입니다.' });
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 내부 오류가 발생했습니다.' });
  }
});

// ★ [신규 추가] 로그아웃 API (쿠키 강제 삭제)
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.json({ success: true, message: '로그아웃되었습니다.' });
});

// ★ [신규 추가] 로그인 상태 체크 API
app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ success: false, message: '로그인되지 않았습니다.' });

    const secret = process.env.JWT_SECRET || 'smart_farm_secret_key';
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });

    res.json({ success: true, user });
  } catch (err) {
    res.status(401).json({ success: false, message: '유효하지 않은 토큰입니다.' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
  });
}

module.exports = app;