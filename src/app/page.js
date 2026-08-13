'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 페이지에 들어오자마자 로그인 상태인지 검사
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          // 로그인이 안 되어 있다면 로그인 페이지로 강제 이동
          router.push('/login');
        } else {
          setLoading(false); // 로그인 상태가 확인되면 화면 표시
        }
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      alert('성공적으로 로그아웃되었습니다.');
      router.push('/login');
    } catch (err) {
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  // 로딩 중일 때 보여줄 화면
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-lg font-bold text-gray-600">인증 확인 중...</p>
      </div>
    );
  }

  return (
    <main style={{ padding: '40px' }}>
      <h1>스마트팜 ERP 홈 화면</h1>
      <p>환영합니다! 로그인이 성공적으로 완료된 안전한 상태입니다.</p>

      {/* 로그아웃 버튼 */}
      <button 
        onClick={handleLogout}
        style={{ 
          marginTop: '20px', 
          padding: '10px 20px', 
          backgroundColor: '#ff4d4f', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer' 
        }}
      >
        로그아웃
      </button>
    </main>
  );
}