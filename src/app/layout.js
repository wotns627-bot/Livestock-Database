'use client'; // 클라이언트 컴포넌트로 설정 (이미 되어있을 수 있습니다)

import { usePathname } from 'next/navigation';

export default function Layout({ children }) {
  const pathname = usePathname();
  
  // 현재 페이지가 로그인 페이지인지 확인
  const isLoginPage = pathname === '/login';

  return (
    <div className="flex">
      {/* 로그인 페이지가 아닐 때만 사이드바(메뉴)를 렌더링합니다 */}
      {!isLoginPage && (
        <aside className="w-64 ...">
          {/* 여기에 사이드바 메뉴 및 로그아웃 버튼 코드 */}
        </aside>
      )}

      {/* 본문 콘텐츠 영역 */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}