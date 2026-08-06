'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function Navbar() {
  const pathname = usePathname();

  // 경로가 일치하는지 확인하는 헬퍼 함수
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-8 h-16 flex justify-between items-center">
        {/* 로고 / 홈 버튼 */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-800 hover:text-blue-600 transition">
          <span>🚜</span>
          <span>Cows Manager</span>
        </Link>

        {/* 네비게이션 메뉴 링크 */}
        <div className="flex items-center gap-6">
          <Link
            href="/cows"
            className={`px-4 py-2 rounded-lg font-medium transition ${
              isActive('/cows')
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            🐄 소 개체 관리
          </Link>

          <Link
            href="/feeds"
            className={`px-4 py-2 rounded-lg font-medium transition ${
              isActive('/feeds')
                ? 'bg-green-50 text-green-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            🌾 사료 재고 관리
          </Link>
        </div>
      </div>
    </nav>
  );
}