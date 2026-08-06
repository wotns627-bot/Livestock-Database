'use client';

export default function NoticesPage() {
  const notifications = [
    { id: 1, type: '경고', title: '사료 재고 부족', desc: '라이완등치 재고가 1,000kg 이하로 떨어졌습니다.', date: '2025-07-20 14:32', unread: true },
    { id: 2, type: '일정', title: '백신 접종 예정', desc: 'A-1 축사 비육우 대상 구제역 백신 접종일입니다.', date: '2025-07-20 09:00', unread: true },
    { id: 3, type: '정보', title: 'TMR 배합 완료', desc: '금일 오전 TMR 사료 6,254kg 생산이 완료되었습니다.', date: '2025-07-20 07:30', unread: false },
    { id: 4, type: '경고', title: '개체 건강 주의', desc: 'B-1 축사 송아지(312-8591-0233) 체온 이상 감지 (주의 필요)', date: '2025-07-19 18:15', unread: false },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-gray-100 min-h-screen">
      {/* 상단 헤더 */}
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold">알림 및 경고</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border text-sm">
            <span>☀️ 28°C</span>
            <span className="font-medium ml-2">2025.07.20 (월)</span>
          </div>
          <button className="bg-gray-100 text-gray-700 border px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">모두 읽음</button>
        </div>
      </header>

      {/* 본문 콘텐츠 */}
      <div className="p-8 space-y-6 max-w-4xl">
        <div className="bg-white rounded-xl border shadow-sm divide-y">
          {notifications.map((item) => (
            <div key={item.id} className={`p-5 flex items-start justify-between hover:bg-gray-50 transition ${item.unread ? 'bg-emerald-50/30' : ''}`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    item.type === '경고' ? 'bg-rose-100 text-rose-700' : 
                    item.type === '일정' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {item.type}
                  </span>
                  <h4 className="font-bold text-gray-800 text-sm">{item.title}</h4>
                  {item.unread && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
                </div>
                <p className="text-sm text-gray-600">{item.desc}</p>
                <p className="text-xs text-gray-400 pt-1">{item.date}</p>
              </div>
              <button className="text-xs text-gray-400 hover:text-gray-600 font-medium">삭제</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}