'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleLogout = () => {
    // 1. 만약 쿠키나 localStorage에 토큰을 저장해두었다면 여기서 삭제합니다.
    // 예: localStorage.removeItem('token'); 
    // (쿠키를 사용하는 경우 서버 API를 호출하거나 쿠키를 만료시키는 로직이 들어갈 수 있습니다)

    // 2. 로그인 페이지로 이동
    router.push('/login');
  };

  return (
    <main style={{ padding: '40px' }}>
      <h1>스마트팜 ERP 홈 화면</h1>
      <p>환영합니다! 로그인이 성공적으로 완료된 상태입니다.</p>

      {/* 로그아웃 버튼 추가 */}
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