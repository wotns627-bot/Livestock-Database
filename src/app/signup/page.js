'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
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

    // 빈 값 체크
    if (!formData.username || !formData.password || !formData.name || !formData.phone || !formData.address) {
      setError('모든 항목(아이디, 비밀번호, 이름, 연락처, 주소)을 빠짐없이 입력해주세요.');
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-12">
      <form onSubmit={handleSignup} className="w-full max-w-lg rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Smart Farm 회원가입</h1>
        
        {error && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{error}</div>}

        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">아이디</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
            placeholder="사용하실 아이디를 입력하세요"
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">비밀번호</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">이름</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
            placeholder="성함을 입력하세요"
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">전화번호</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
            placeholder="010-0000-0000"
            required
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-bold text-gray-700">스마트팜 주소 (농장 위치)</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
            placeholder="농장 주소를 입력하세요"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded bg-green-600 py-3 text-white font-bold hover:bg-green-700 mb-4 transition"
        >
          회원가입 완료
        </button>

        <div className="text-center text-sm">
          <Link href="/login" className="text-blue-600 hover:underline">
            이미 계정이 있으신가요? 로그인하기
          </Link>
        </div>
      </form>
    </div>
  );
}