// src/app/notifications/page.tsx
import React from 'react';

export default function NotificationsPage() {
  // 알림 목업 데이터 (22일과 21일 데이터 포함)
  const notifications = [
    {
      id: 1,
      type: 'health',
      title: '발정 의심 개체 발견',
      message: '개체번호 0015 (암소) 활동량 급증. 발정이 의심되니 확인 바랍니다.',
      date: '2026-07-22',
      time: '09:30',
      isRead: false,
    },
    {
      id: 2,
      type: 'shipping',
      title: '출하 대기 알림',
      message: '이번 주 출하 예정인 개체(5두)의 최종 점검이 필요합니다.',
      date: '2026-07-22',
      time: '08:00',
      isRead: false,
    },
    {
      id: 3,
      type: 'system',
      title: '시스템 점검 안내',
      message: '자정부터 새벽 2시까지 서버 안정화 작업이 진행됩니다.',
      date: '2026-07-21',
      time: '18:45',
      isRead: true,
    },
    {
      id: 4,
      type: 'feed',
      title: '사료 재고 부족',
      message: '육성우용 배합사료 재고가 10% 미만입니다. 발주가 필요합니다.',
      date: '2026-07-21',
      time: '14:20',
      isRead: true,
    },
  ];

  const getIconAndColor = (type: string) => {
    switch (type) {
      case 'health':
        return { bg: 'bg-red-100', text: 'text-red-600', icon: '🩺' };
      case 'shipping':
        return { bg: 'bg-blue-100', text: 'text-blue-600', icon: '🚚' };
      case 'feed':
        return { bg: 'bg-orange-100', text: 'text-orange-600', icon: '🌾' };
      case 'system':
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600', icon: '⚙️' };
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6">
      
      {/* 1. 상단 타이틀 영역 (날짜/날씨 중복 제거 완료) */}
      <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          알림 센터
        </h2>
        
        <div className="flex items-center gap-4">
          <button className="text-sm font-semibold text-gray-500 hover:text-emerald-600 transition">
            모두 읽음 처리
          </button>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200 text-emerald-600 font-bold text-xs">N</div>
            <span className="text-gray-800 font-bold text-xs">관리자님</span>
          </div>
        </div>
      </header>

      {/* 2. 메인 알림 리스트 영역 */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        
        {/* 필터 탭 */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 px-4 pt-4 gap-6 text-sm font-semibold text-gray-500">
          <button className="pb-3 border-b-2 border-emerald-500 text-emerald-600">전체 알림</button>
          <button className="pb-3 border-b-2 border-transparent hover:text-gray-800 transition">개체 관리</button>
          <button className="pb-3 border-b-2 border-transparent hover:text-gray-800 transition">시스템 / 일정</button>
        </div>

        {/* 알림 목록 */}
        <div className="flex-1 overflow-y-auto p-2">
          {notifications.map((noti) => {
            const style = getIconAndColor(noti.type);
            return (
              <div 
                key={noti.id} 
                className={`flex gap-4 p-4 m-2 rounded-xl border transition-all cursor-pointer ${
                  noti.isRead 
                    ? 'bg-white border-gray-100 hover:bg-gray-50' 
                    : 'bg-emerald-50/30 border-emerald-100 hover:bg-emerald-50/70'
                }`}
              >
                {/* 아이콘 영역 */}
                <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-xl ${style.bg} ${style.text}`}>
                  {style.icon}
                </div>
                
                {/* 텍스트 영역 */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-bold ${noti.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                      {noti.title}
                    </h3>
                    <span className="text-xs font-medium text-gray-400">
                      {noti.date} {noti.time}
                    </span>
                  </div>
                  <p className={`text-sm ${noti.isRead ? 'text-gray-500' : 'text-gray-600'}`}>
                    {noti.message}
                  </p>
                </div>
                
                {/* 새 알림 표시 뱃지 */}
                {!noti.isRead && (
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}