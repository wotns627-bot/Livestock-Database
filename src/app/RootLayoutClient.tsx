// src/app/RootLayoutClient.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FarmProvider } from '@/context/FarmContext'; // 1. 방금 만든 Context 임포트

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <FarmProvider> {/* 2. 전체를 감싸서 데이터 연동 활성화 */}
      <div className="flex min-h-screen relative">
        {/* 모바일 상단 헤더 */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center justify-between px-4 z-30 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-600 text-white p-1.5 rounded-lg text-sm font-bold">H</span>
            <span className="font-bold text-sm">한우 스마트 ERP</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
          >
            {isMobileMenuOpen ? '✕ 닫기' : '☰ 메뉴'}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-20"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* 좌측 사이드바 */}
        <aside
          className={`bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 fixed h-screen z-30 transition-all duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
            ${isSidebarOpen ? 'md:w-64' : 'md:w-20'}
          `}
        >
          <div>
            <div className="p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="bg-emerald-600 text-white p-2 rounded-xl text-lg font-bold shrink-0">H</span>
                {(isSidebarOpen || isMobileMenuOpen) && (
                  <span className="font-bold text-white text-base truncate">한우 스마트 ERP</span>
                )}
              </div>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hidden md:block p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition shrink-0"
              >
                {isSidebarOpen ? '◀' : '▶'}
              </button>
            </div>

            <nav 
              className="p-4 space-y-1 text-sm overflow-y-auto max-h-[calc(100vh-100px)] mt-16 md:mt-0"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Link href="/" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition">
                <span>🏠</span> {(isSidebarOpen || isMobileMenuOpen) && <span>대시보드</span>}
              </Link>
              <Link href="/cattle" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition">
                <span>🐄</span> {(isSidebarOpen || isMobileMenuOpen) && <span>개체 관리</span>}
              </Link>
              <Link href="/barn" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition">
                <span>🏡</span> {(isSidebarOpen || isMobileMenuOpen) && <span>축사 관리</span>}
              </Link>
              <Link href="/breeding" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition">
                <span>❤️</span> {(isSidebarOpen || isMobileMenuOpen) && <span>번식 관리</span>}
              </Link>
              <Link href="/health" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition">
                <span>🩺</span> {(isSidebarOpen || isMobileMenuOpen) && <span>건강/방역</span>}
              </Link>
              <Link href="/feed" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition">
                <span>🌾</span> {(isSidebarOpen || isMobileMenuOpen) && <span>사료/재고</span>}
              </Link>
              <Link href="/schedule" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition">
                <span>📅</span> {(isSidebarOpen || isMobileMenuOpen) && <span>일정 관리</span>}
              </Link>
              <Link href="/tmr" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition">
                <span>⚙️</span> {(isSidebarOpen || isMobileMenuOpen) && <span>TMR 관리</span>}
              </Link>
              <Link href="/settlement" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition">
                <span>💰</span> {(isSidebarOpen || isMobileMenuOpen) && <span>경영/정산</span>}
              </Link>
              <Link href="/inventory" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-xl transition">
                <span>🌾</span> {(isSidebarOpen || isMobileMenuOpen) && <span>사료 및 자재/약품 관리</span>}
              </Link>
              <Link href="/shipping" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition">
                <span>🚛</span> {(isSidebarOpen || isMobileMenuOpen) && <span>출하 관리</span>}
              </Link>

              <div className="pt-3 mt-3 border-t border-slate-800">
                <Link href="/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition text-slate-400 hover:text-white">
                  <span>⚙️</span> {(isSidebarOpen || isMobileMenuOpen) && <span>설정 목록</span>}
                </Link>
              </div>
            </nav>
          </div>
        </aside>

        {/* 우측 메인 콘텐츠 영역 */}
        <main
          className={`flex-1 min-h-screen bg-slate-50 transition-all duration-300 ease-in-out pt-16 md:pt-0 ${
            isSidebarOpen ? 'md:ml-64' : 'md:ml-20'
          }`}
        >
          {children}
        </main>
      </div>
    </FarmProvider>
  );
}