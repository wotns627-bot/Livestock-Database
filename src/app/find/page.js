'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FindPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [error, setError] = useState('');

  const handleFindId = async (e) => {
    e.preventDefault();
    setError('');
    setResultMessage('');

    try {
      const res = await fetch('/api/auth/find', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'findId', name, email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setResultMessage(data.message);
      } else {
        setError(data.message || '일치하는 정보를 찾을 수 없습니다.');
      }
    } catch (err) {
      setError('서버 통신 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔍 아이디 찾기</h2>
        <p style={styles.subtitle}>가입 시 등록한 이름과 이메일을 입력해주세요.</p>

        {error && <div style={styles.errorBox}>{error}</div>}
        {resultMessage && <div style={styles.successBox}>{resultMessage}</div>}

        <form onSubmit={handleFindId} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="가입자 이름"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="가입 시 등록한 이메일"
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            아이디 찾기
          </button>
        </form>

        <div style={styles.footer}>
          <Link href="/login" style={styles.link}>
            로그인 화면으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f7f6',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    padding: '40px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '13px',
    color: '#7f8c8d',
    marginBottom: '24px',
    textAlign: 'center',
  },
  errorBox: {
    marginBottom: '16px',
    padding: '10px',
    backgroundColor: '#ffeaa7',
    color: '#d63031',
    borderRadius: '6px',
    fontSize: '13px',
    textAlign: 'center',
  },
  successBox: {
    marginBottom: '16px',
    padding: '10px',
    backgroundColor: '#e8f8f5',
    color: '#27ae60',
    borderRadius: '6px',
    fontSize: '13px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
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
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '13px',
  },
  link: {
    color: '#27ae60',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
};