'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false); // 로그인/회원가입 상태 전환
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || '오류가 발생했습니다.');
        return;
      }

      alert(data.message);
      
      if (!isSignup) {
        // 로그인 성공 시 메인 페이지나 대시보드로 이동
        router.push('/'); 
      } else {
        // 회원가입 성공 시 로그인 모드로 전환
        setIsSignup(false);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setMessage('서버 통신 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>{isSignup ? '회원가입' : '로그인'}</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '8px', 
              boxSizing: 'border-box',
              color: 'black',          // 👈 글자 색상을 검은색으로 지정
              backgroundColor: 'white' // 👈 배경을 하얀색으로 지정
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '8px', 
              boxSizing: 'border-box',
              color: 'black',          // 👈 글자 색상을 검은색으로 지정
              backgroundColor: 'white' // 👈 배경을 하얀색으로 지정
            }}
          />
        </div>

        {message && <p style={{ color: 'red', fontSize: '14px' }}>{message}</p>}

        <button 
          type="submit" 
          style={{ padding: '10px', backgroundColor: '#0070f3', color: '#white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {isSignup ? '가입하기' : '로그인하기'}
        </button>
      </form>

      <button
        onClick={() => setIsSignup(!isSignup)}
        style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer', marginTop: '15px', width: '100%', textAlign: 'center' }}
      >
        {isSignup ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
      </button>
    </div>
  );
}