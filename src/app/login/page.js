'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, autoLogin }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        alert('로그인 성공!');
        router.push('/');
      } else {
        alert(data.message || '로그인에 실패했습니다.');
      }
    } catch (err) {
      alert('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🌾 Smart Farm ERP</h2>
        <p style={styles.subtitle}>시스템을 이용하려면 로그인하세요.</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>아이디</label>
            <input
              type="text"
              placeholder="아이디를 입력하세요"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.options}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={autoLogin}
                onChange={(e) => setAutoLogin(e.target.checked)}
              />
              자동 로그인
            </label>
          </div>

          <button type="submit" style={styles.button}>
            로그인
          </button>
        </form>

        <div style={styles.footer}>
          <span>계정이 없으신가요? </span>
          <Link href="/signup" style={styles.link}>
            회원가입하기
          </Link>
        </div>
      </div>
    </div>
  );
}

// 깔끔한 디자인을 위한 스타일 객체
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f7f6',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    padding: '40px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#7f8c8d',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    textAlign: 'left',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#34495e',
  },
  input: {
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #dcdde1',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  options: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
    color: '#555',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
  },
  button: {
    marginTop: '8px',
    padding: '12px',
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#27ae60',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  footer: {
    marginTop: '24px',
    fontSize: '13px',
    color: '#7f8c8d',
  },
  link: {
    color: '#27ae60',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
};