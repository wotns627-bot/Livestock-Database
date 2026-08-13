'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password || !formData.name || !formData.email || !formData.phone || !formData.address) {
      setError('모든 항목을 빠짐없이 입력해주세요.');
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
        router.push('/login');
      } else {
        setError(data.message || '회원가입에 실패했습니다.');
      }
    } catch (err) {
      setError('서버 통신 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🌾 Smart Farm 회원가입</h2>
        <p style={styles.subtitle}>새로운 계정을 만들어 스마트팜을 시작하세요.</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSignup} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>아이디</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="사용하실 아이디를 입력하세요"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>비밀번호</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>이름</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="성함을 입력하세요"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>이메일</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="아이디/비밀번호 찾기에 사용됩니다"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>전화번호</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-0000-0000"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>스마트팜 주소 (농장 위치)</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="농장 주소를 입력하세요"
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            회원가입 완료
          </button>
        </form>

        <div style={styles.footer}>
          <span>이미 계정이 있으신가요? </span>
          <Link href="/login" style={styles.link}>
            로그인하기
          </Link>
        </div>
      </div>
    </div>
  );
}

// 디자인 스타일 객체
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
    maxWidth: '450px',
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
    fontSize: '14px',
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
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
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #dcdde1',
    borderRadius: '6px',
    outline: 'none',
  },
  button: {
    marginTop: '10px',
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
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '13px',
    color: '#7f8c8d',
  },
  link: {
    color: '#27ae60',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
};