// src/app/layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedDarkMode = localStorage.getItem('smartFarmDarkMode');
    if (savedDarkMode === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    localStorage.setItem('smartFarmDarkMode', String(nextMode));
    
    if (nextMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    window.dispatchEvent(new Event('storage'));
  };

  const menuItems = [
    { name: '대시보드', href: '/' },
    { name: '개체 관리', href: '/cattle' },
    { name: '축사 관리', href: '/barn' },
    { name: '번식 관리', href: '/breeding' },
    { name: '건강/방역', href: '/health' },
    { name: '사료/재고', href: '/feed' },
    { name: '일정 관리', href: '/schedule' },
    { name: 'TMR 관리', href: '/tmr' },
    { name: '경영/정산', href: '/finance' },
    { name: '사료 및 자재/약품 관리', href: '/inventory' },
    { name: '출하 관리', href: '/shipping' },
    { name: '설정 목록', href: '/settings' },
  ];

  return (
    <html lang="ko" className={isDarkMode ? 'dark' : ''} suppressHydrationWarning>
      <head>
        <title>한우 스마트 ERP - 스마트팜 한우 농장 통합 관리 시스템</title>
        <meta name="description" content="한우 농장을 위한 가축 개체 관리, 번식, 건강/방역, 사료 재고 및 TMR 통합 ERP 시스템" />
        <meta name="keywords" content="한우, 스마트팜, 농장관리, ERP, 가축관리, 축사관리" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* 구글 서치 콘솔 소유권 확인 태그 */}
        <meta name="google-site-verification" content="WV-oHnr5SFH2p6rrEqNmBuH8AfaiMslk81UPaUC5PSY" />
        
        {/* 소셜미디어 및 검색엔진 최적화 태그 */}
        <meta property="og:title" content="한우 스마트 ERP" />
        <meta property="og:description" content="스마트 한우 농장 통합 관리 시스템" />
        <meta property="og:type" content="website" />
      </head>
      <body className={`antialiased transition-colors duration-200 ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
        <div className={`min-h-screen flex flex-col lg:flex-row relative ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
          
          {/* 📱 모바일 상단 헤더 */}
          <header className="lg:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 active:bg-slate-600 focus:outline-none cursor-pointer"
                aria-label="메뉴 열기"
              >
                <svg className="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              <span className="font-bold text-base tracking-tight">H 한우 스마트 ERP</span>
            </div>

            {/* 모바일 상단 야간/주간모드 토글 */}
            {mounted && (
              <button
                type="button"
                onClick={toggleDarkMode}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-amber-400 font-bold text-xs flex items-center gap-1 border border-slate-700 cursor-pointer"
              >
                {isDarkMode ? '☀️ 주간' : '🌙 야간'}
              </button>
            )}
          </header>

          {/* 📱 모바일 배경 어둡게 처리 */}
          {isMobileMenuOpen && (
            <div 
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
          )}

          {/* 🖥️ 좌측 사이드바 */}
          <aside className={`
            fixed lg:static inset-y-0 left-0 z-50
            w-64 bg-slate-900 text-slate-300 flex flex-col
            transform transition-transform duration-200 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="p-6 hidden lg:flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                  H
                </div>
                <span className="font-bold text-white text-base">한우 스마트 ERP</span>
              </div>
            </div>

            {/* PC 사이드바 하단 야간/주간 모드 버튼 */}
            <div className="px-4 py-3 border-t border-slate-800 hidden lg:block">
              {mounted && (
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
                >
                  {isDarkMode ? '☀️ 주간 모드 (라이트)' : '🌙 야간 모드 (다크)'}
                </button>
              )}
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-xs transition ${
                      isActive 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 active:bg-slate-800'
                    }`}
                  >
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* 📄 우측 메인 콘텐츠 영역 */}
          <main className={`flex-1 overflow-x-hidden min-w-0 ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            <div className="w-full p-2 lg:p-6">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}