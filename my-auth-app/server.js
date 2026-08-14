const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = 3000;

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// SQLite 데이터베이스 연결 및 초기화
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) console.error('데이터베이스 연결 실패:', err.message);
    else console.log('SQLite 데이터베이스 연결 성공');
});

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
)`);

// 1. 회원가입 API
app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: '아이디와 비밀번호를 입력해주세요.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], function(err) {
            if (err) {
                return res.status(400).json({ success: false, message: '이미 존재하는 아이디입니다.' });
            }
            res.json({ success: true, message: '회원가입이 완료되었습니다.' });
        });
    } catch (e) {
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
});

// 2. 로그인 API
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (err || !user) {
            return res.status(400).json({ success: false, message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
        }

        res.json({ success: true, message: '로그인 성공!', username: user.username });
    });
});

app.listen(PORT, () => {
    console.log(`서버 실행 중: http://localhost:${PORT}`);
});