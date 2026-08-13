'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false); // 자동 로그인 상태 추가
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // autoLogin 데이터도 함께 서버로 전송
        body: JSON.stringify({ username, password, autoLogin }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // 로그인 성공 시 대시보드나 홈으로 이동
        router.push('/');
        router.refresh();
      } else {
        setError(data.message || '아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('서버 통신 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Smart Farm 로그인</h1>
        
        {error && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{error}</div>}

        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">아이디</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
            required
          />
        </div>

        {/* 새로 추가된 자동 로그인 & 아이디/비밀번호 찾기 영역 */}
        <div className="mb-6 flex items-center justify-between">
          <label className="flex cursor-pointer items-center text-sm text-gray-700">
            <input
              type="checkbox"
              checked={autoLogin}
              onChange={(e) => setAutoLogin(e.target.checked)}
              className="mr-2 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            자동 로그인
          </label>
          <Link href="/find-account" className="text-sm text-blue-600 hover:underline">
            아이디/비밀번호 찾기
          </Link>
        </div>

        <button
          type="submit"
          className="w-full rounded bg-green-600 py-2 text-white font-bold hover:bg-green-700 mb-4 transition"
        >
          로그인
        </button>

        <div className="text-center text-sm">
          <Link href="/signup" className="text-blue-600 hover:underline">
            계정이 없으신가요? 회원가입하기
          </Link>
        </div>
      </form>
    </div>
  );
}