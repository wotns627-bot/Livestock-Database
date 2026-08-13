'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FindAccountPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleFindId = async (e) => {
    e.preventDefault();
    setResult('');
    setError('');

    try {
      const res = await fetch('/api/auth/find', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'findId', name, email }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setResult(data.message); // 아이디 찾기 성공 메시지 출력
      } else {
        setError(data.message || '일치하는 정보가 없습니다.');
      }
    } catch (err) {
      setError('서버와 통신 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-12">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">아이디 찾기</h1>
        
        {error && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{error}</div>}
        {result && <div className="mb-4 rounded bg-green-100 p-3 text-sm font-bold text-green-700 text-center">{result}</div>}

        <form onSubmit={handleFindId}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">가입한 이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-gray-700">가입한 이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-blue-600 py-2 text-white font-bold hover:bg-blue-700 mb-4 transition"
          >
            내 아이디 확인
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link href="/login" className="text-gray-600 hover:underline">
            로그인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}