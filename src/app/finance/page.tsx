// src/app/finance/page.tsx
import React from 'react';

export default function FinancePage() {
  return (
    <div className="w-full h-full flex flex-col gap-6 p-6">
      
      {/* 1. 상단 헤더 영역 (고정 날짜/날씨 제거 완료) */}
      <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          경영 및 정산 관리
        </h2>
        
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <input 
              type="text" 
              placeholder="거래처, 출하번호, 항목명 검색..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-full pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
            <svg className="w-5 h-5 text-gray-400 absolute right-3 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200 text-emerald-600 font-bold text-xs">N</div>
          <span className="text-gray-800 font-bold text-xs">관리자님</span>
        </div>
      </header>

      {/* 2. 경영 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* 카드 1 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-xs font-semibold mb-1">당월 총 매출 (출하/판매)</div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-blue-600">28,500</span><span className="text-sm text-gray-600 font-medium">천원</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
        </div>

        {/* 카드 2 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-xs font-semibold mb-1">당월 총 지출 (사료/약품/기타)</div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-red-500">11,200</span><span className="text-sm text-gray-600 font-medium">천원</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
          </div>
        </div>

        {/* 카드 3 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-xs font-semibold mb-1">당월 추정 순이익</div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-emerald-600">+17,300</span><span className="text-sm text-gray-600 font-medium">천원</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>

        {/* 카드 4 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-xs font-semibold mb-1">평균 두당 출하 금액</div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-gray-900">9,500</span><span className="text-sm text-gray-600 font-medium">천원</span>
              <span className="ml-2 text-xs font-bold text-blue-500">1++ 등급 위주</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /></svg>
          </div>
        </div>
      </div>

      {/* 3. 메인 콘텐츠 */}
      <div className="flex gap-6 flex-1 h-full">
        
        {/* 좌측: 매출/지출 내역 테이블 */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          
          <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500">
              <option>거래 구분 (전체)</option>
              <option>수입 (출하/퇴비 등)</option>
              <option>지출 (사료/약품/자재)</option>
            </select>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 ml-2">기간</span>
              <input type="date" className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white" defaultValue="2026-07-01" />
              <span className="text-gray-400">~</span>
              <input type="date" className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white" defaultValue="2026-07-22" />
            </div>
            <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition">조회</button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-200">
                  <th className="px-4 py-3 font-semibold">일자</th>
                  <th className="px-4 py-3 font-semibold text-center">구분</th>
                  <th className="px-4 py-3 font-semibold">항목명 / 내역</th>
                  <th className="px-4 py-3 font-semibold">거래처</th>
                  <th className="px-4 py-3 font-semibold text-right">금액 (원)</th>
                  <th className="px-4 py-3 font-semibold text-center">결제 상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {[
                  { date: '2026-07-20', type: '수입', item: '거세우 2두 출하 정산 (0016 등)', client: '축협 공판장', amount: '19,000,000', status: '입금완료' },
                  { date: '2026-07-15', type: '지출', item: '배합사료 10톤 구매', client: '농협 사료', amount: '6,500,000', status: '지급완료' },
                  { date: '2026-07-10', type: '지출', item: '수의사 진료 및 백신 구매', client: '동물병원', amount: '450,000', status: '지급완료' },
                  { date: '2026-07-05', type: '수입', item: '송아지 1두 판매', client: '지역 우시장', amount: '4,200,000', status: '입금완료' },
                  { date: '2026-07-02', type: '지출', item: '축사 전기요금 및 용수비', client: '한국전력공사', amount: '380,000', status: '지급완료' },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-blue-50/30 transition-colors cursor-pointer">
                    <td className="px-4 py-3 text-gray-600">{item.date}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        item.type === '수입' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                      }`}>{item.type}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-800">{item.item}</td>
                    <td className="px-4 py-3 text-gray-600">{item.client}</td>
                    <td className={`px-4 py-3 text-right font-extrabold ${
                      item.type === '수입' ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {item.type === '수입' ? '+' : '-'}{item.amount}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded text-xs font-bold bg-gray-100 text-gray-600">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 우측: 수입/지출 등록 폼 */}
        <div className="w-96 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-800">거래 내역 등록</h3>
            <p className="text-xs text-gray-400 mt-0.5">새로운 수입 또는 지출을 기록합니다.</p>
          </div>
          
          <div className="p-5 flex-1 overflow-y-auto space-y-4 text-sm">
            <div>
              <label className="block text-gray-600 font-semibold mb-1 text-xs">거래 유형</label>
              <div className="grid grid-cols-2 gap-2">
                <button className="border border-blue-500 bg-blue-50 text-blue-700 font-bold py-2 rounded-lg">수입 (+)</button>
                <button className="border border-gray-200 bg-white text-gray-600 font-medium py-2 rounded-lg hover:bg-gray-50">지출 (-)</button>
              </div>
            </div>

            <div>
              {/* 오늘 날짜 2026-07-22를 기본값으로 적용 */}
              <label className="block text-gray-600 font-semibold mb-1 text-xs">거래 일자</label>
              <input type="date" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus:outline-none focus:border-blue-500" defaultValue="2026-07-22" />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1 text-xs">항목 / 내역</label>
              <input type="text" placeholder="예: 거세우 출하 정산, 사료 대금" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus:outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1 text-xs">거래처</label>
              <input type="text" placeholder="거래처명 입력" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus:outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1 text-xs">금액 (원)</label>
              <input type="number" placeholder="0" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus:outline-none focus:border-blue-500 font-bold text-gray-900" />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1 text-xs">결제 구분</label>
              <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus:outline-none focus:border-blue-500">
                <option>계좌이체</option>
                <option>카드결제</option>
                <option>현금</option>
                <option>외상/미수금</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1 text-xs">비고</label>
              <textarea rows={2} placeholder="특이사항 입력..." className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:border-blue-500 resize-none"></textarea>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-sm">
              내역 저장하기
            </button>
          </div>
        </div>

      </div>
      
    </div>
  );
}