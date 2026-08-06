'use client';

export default function InventoryPage() {
  const inventoryItems = [
    { name: '볏짚', category: '부산물', stock: '8,200', unit: 'kg', price: '280', date: '2025-07-18', memo: '-' },
    { name: '황우2호', category: '배합사료', stock: '6,500', unit: 'kg', price: '510', date: '2025-07-18', memo: '-' },
    { name: '비지', category: '부산물', stock: '10,000', unit: 'kg', price: '120', date: '2025-07-17', memo: '-' },
    { name: '버섯폐지', category: '부산물', stock: '20,000', unit: 'kg', price: '60', date: '2025-07-16', memo: '-' },
    { name: '미강', category: '곡물류', stock: '3,000', unit: 'kg', price: '250', date: '2025-07-16', memo: '-' },
    { name: '라이완등치', category: '조사료', stock: '1,000', unit: 'kg', price: '200', date: '2025-07-15', memo: '재고 부족' },
    { name: '질탄등치', category: '조사료', stock: '1,000', unit: 'kg', price: '150', date: '2025-07-15', memo: '재고 부족' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-gray-100 min-h-screen">
      {/* 상단 헤더 */}
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold">원료 관리</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border text-sm">
            <span>☀️ 28°C</span>
            <span className="font-medium ml-2">2025.07.20 (월)</span>
          </div>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">+ 원료 추가</button>
          <button className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900">입고 등록</button>
        </div>
      </header>

      {/* 본문 콘텐츠 */}
      <div className="p-8 space-y-6">
        {/* 상단 요약 카드 4개 */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-xl border shadow-sm flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">전체 원료</p>
              <h3 className="text-2xl font-bold mt-1">10 <span className="text-sm font-normal text-gray-500">종</span></h3>
            </div>
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">🌾</div>
          </div>
          <div className="bg-white p-5 rounded-xl border shadow-sm flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">총 재고</p>
              <h3 className="text-2xl font-bold mt-1">45.2 <span className="text-sm font-normal text-gray-500">톤</span></h3>
            </div>
            <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">📦</div>
          </div>
          <div className="bg-white p-5 rounded-xl border shadow-sm flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">평균 단가</p>
              <h3 className="text-2xl font-bold mt-1">318 <span className="text-sm font-normal text-gray-500">원/kg</span></h3>
            </div>
            <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">💰</div>
          </div>
          <div className="bg-white p-5 rounded-xl border shadow-sm flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">재고 부족</p>
              <h3 className="text-2xl font-bold mt-1 text-rose-600">1 <span className="text-sm font-normal text-gray-500">종 ▲</span></h3>
            </div>
            <div className="p-3 bg-rose-100 text-rose-700 rounded-xl">⚠️</div>
          </div>
        </div>

        {/* 메인 레이아웃 (좌측 목록 + 우측 알림 및 입고내역) */}
        <div className="grid grid-cols-3 gap-6">
          {/* 좌측 원료 목록 테이블 (2칸 차지) */}
          <div className="col-span-2 bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800">원료 목록</h3>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b text-gray-400 text-xs">
                  <th className="pb-3">원료명</th>
                  <th className="pb-3">분류</th>
                  <th className="pb-3">현재 재고</th>
                  <th className="pb-3">단위</th>
                  <th className="pb-3">평균 단가(원/kg)</th>
                  <th className="pb-3">최근 입고일</th>
                  <th className="pb-3">비고</th>
                </tr>
              </thead>
              <tbody className="divide-y text-gray-600">
                {inventoryItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="py-3 font-semibold text-gray-800">{item.name}</td>
                    <td className="py-3">{item.category}</td>
                    <td className={`py-3 font-semibold ${item.memo === '재고 부족' ? 'text-rose-600' : 'text-emerald-700'}`}>{item.stock}</td>
                    <td className="py-3">{item.unit}</td>
                    <td className="py-3">{item.price}</td>
                    <td className="py-3">{item.date}</td>
                    <td className="py-3">
                      {item.memo === '재고 부족' ? (
                        <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-xs font-semibold">부족</span>
                      ) : (
                        item.memo
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 우측 사이드 영역 (재고 부족 알림 + 최근 입고 내역) */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-3">
              <h3 className="font-bold text-gray-800 text-sm">재고 부족 알림</h3>
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-1">
                <p className="font-bold text-rose-800">라이완등치</p>
                <p className="text-rose-600">재고 1,000kg (최소 2,000kg)</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-800 text-sm">최근 입고 내역</h3>
                <span className="text-xs text-emerald-600 cursor-pointer font-medium">더보기 &gt;</span>
              </div>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between border-b pb-2">
                  <span>2025-07-18 | 볏짚</span>
                  <span className="font-semibold">2,000kg</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>2025-07-18 | 황우2호</span>
                  <span className="font-semibold">2,000kg</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>2025-07-17 | 비지</span>
                  <span className="font-semibold">2,000kg</span>
                </div>
                <div className="flex justify-between">
                  <span>2025-07-16 | 버섯폐지</span>
                  <span className="font-semibold">5,000kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}