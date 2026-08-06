'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: '대시보드', href: '/', icon: '📊' },
    { name: '개체 관리', href: '/cattle', icon: '🐄' },
    { name: '축사 관리', href: '/barn', icon: '🏠' },
    { name: '번식 관리', href: '/breeding', icon: '💕' },
    { name: '건강/방역', href: '/health', icon: '💉' },
    { name: '사료/재고', href: '/inventory', icon: '🌾' },
    { name: '일정 관리', href: '/schedule', icon: '📅' },
    { name: 'TMR 관리', href: '/tmr', icon: '🚜' },
    { name: '경영/정산', href: '/settlement', icon: '💰' },
    { name: '출하 관리', href: '/shipping', icon: '🚚' },
    { name: '설정 목록', href: '/settings', icon: '⚙️' },
  ];

  return (
    <>
      {/* 모바일에서 사이드바가 열렸을 때 뒷배경을 어둡게 막아주는 오버레이 */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* 모바일에서는 기본적으로 화면 왼쪽 밖으로 숨겨짐(-translate-x-full), 열리면(translate-x-0) 나타남 */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col min-h-screen p-4 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 text-white font-bold p-2 rounded-lg">H</div>
            <span className="text-white font-bold text-lg">한우 스마트 ERP</span>
          </div>
          {/* 모바일용 닫기 버튼 */}
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden text-slate-400 hover:text-white font-bold text-xl px-2"
          >
            ✕
          </button>
        </div>

        <nav className="space-y-1 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)} // 메뉴를 누르면 모바일에서 자동으로 닫힘
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}