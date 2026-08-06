'use client';

import { useState } from 'react';

export default function CowsPage() {
  // 샘플 개체 데이터 (추후 MongoDB API 연동 가능)
  const cows = [
    { id: '0001', tag: '002 1234 567890', sex: '수', birth: '2023-05-12', month: '26개월', pen: 'A동-05칸', status: '사육중', weight: '728 kg', breed: 'KPN 002-123456', memo: '특이사항 없음' },
    { id: '0002', tag: '002 1234 567891', sex: '암', birth: '2023-06-01', month: '25개월', pen: 'A동-05칸', status: '사육중', weight: '695 kg', breed: 'KPN 002-123457', memo: '건강함' },
    { id: '0003', tag: '002 1234 567892', sex: '수', birth: '2023-05-20', month: '26개월', pen: 'A동-06칸', status: '사육중', weight: '742 kg', breed: 'KPN 002-123458', memo: '-' },
    { id: '0004', tag: '002 1234 567893', sex: '암', birth: '2023-04-18', month: '27개월', pen: 'B동-02칸', status: '사육중', weight: '701 kg', breed: 'KPN 002-123459', memo: '-' },
    { id: '0005', tag: '002 1234 567894', sex: '수', birth: '2023-03-30', month: '28개월', pen: 'B동-02칸', status: '출하예정', weight: '812 kg', breed: 'KPN 002-123460', memo: '출하 대기중' },
    { id: '0006', tag: '002 1234 567895', sex: '수', birth: '2023-04-02', month: '27개월', pen: 'B동-03칸', status: '사육중', weight: '680 kg', breed: 'KPN 002-123461', memo: '-' },
  ];

  const [selectedCow, setSelectedCow] = useState(cows[0]);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-gray-100 min-h-screen">
      {/* 상단 헤더 */}
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold">개체 관리</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="개체번호, 귀표번호, 혈통번호 검색..." 
              className="bg-gray-50 border rounded-lg px-4 py-1.5 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border text-sm">
            <span>☀️ 28°C</span>
            <span className="font-medium ml-2">2025.07.20 (월)</span>
          </div>
        </div>
      </header>

      {/* 본문 콘텐츠 */}
      <div className="p-8 space-y-6">
        {/* 상단 요약 카드 4개 */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-xl border shadow-sm flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">전체 개체수</p>
              <h3 className="text-2xl font-bold mt-1">240 <span className="text-sm font-normal text-gray-500">두</span> <span className="text-xs text-emerald-600 font-semibold">+3</span></h3>
            </div>
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">🐂</div>
          </div>
          <div className="bg-white p-5 rounded-xl border shadow-sm flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">사육 중</p>
              <h3 className="text-2xl font-bold mt-1">228 <span className="text-sm font-normal text-gray-500">두</span> <span className="text-xs text-blue-600 font-semibold">95%</span></h3>
            </div>
            <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">🏡</div>
          </div>
          <div className="bg-white p-5 rounded-xl border shadow-sm flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">출하 예정</p>
              <h3 className="text-2xl font-bold mt-1">12 <span className="text-sm font-normal text-gray-500">두</span></h3>
            </div>
            <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">🚚</div>
          </div>
          <div className="bg-white p-5 rounded-xl border shadow-sm flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">최근 출하</p>
              <h3 className="text-2xl font-bold mt-1">6 <span className="text-sm font-normal text-gray-500">두</span></h3>
            </div>
            <div className="p-3 bg-purple-100 text-purple-700 rounded-xl">📊</div>
          </div>
        </div>

        {/* 메인 레이아웃 (좌측 테이블 + 우측 상세정보) */}
        <div className="grid grid-cols-3 gap-6">
          {/* 좌측 개체 목록 테이블 (2칸 차지) */}
          <div className="col-span-2 bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <select className="border px-3 py-1.5 rounded-lg text-sm bg-gray-50"><option>축사/칸 전체</option></select>
                <select className="border px-3 py-1.5 rounded-lg text-sm bg-gray-50"><option>상태 전체</option></select>
                <select className="border px-3 py-1.5 rounded-lg text-sm bg-gray-50"><option>성별 전체</option></select>
              </div>
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">+ 개체 등록</button>
            </div>

            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b text-gray-400 text-xs">
                  <th className="pb-3"><input type="checkbox" /></th>
                  <th className="pb-3">개체번호</th>
                  <th className="pb-3">귀표번호</th>
                  <th className="pb-3">성별</th>
                  <th className="pb-3">생년월일</th>
                  <th className="pb-3">월령</th>
                  <th className="pb-3">축사/칸</th>
                  <th className="pb-3">상태</th>
                  <th className="pb-3">최근 체중</th>
                </tr>
              </thead>
              <tbody className="divide-y text-gray-600">
                {cows.map((cow) => (
                  <tr 
                    key={cow.id} 
                    onClick={() => setSelectedCow(cow)} 
                    className="hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="py-3"><input type="checkbox" onClick={(e) => e.stopPropagation()} /></td>
                    <td className="py-3 font-semibold text-emerald-700">{cow.id}</td>
                    <td className="py-3 text-gray-800">{cow.tag}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${cow.sex === '수' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-750 text-rose-600'}`}>
                        {cow.sex}
                      </span>
                    </td>
                    <td className="py-3">{cow.birth}</td>
                    <td className="py-3">{cow.month}</td>
                    <td className="py-3">{cow.pen}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${cow.status === '사육중' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {cow.status}
                      </span>
                    </td>
                    <td className="py-3 font-semibold">{cow.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 우측 선택 개체 상세 정보 패널 (1칸 차지) */}
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-800">선택 개체 상세 정보</h3>
              <span className="text-gray-400 cursor-pointer text-sm">✕</span>
            </div>

            <div className="w-full h-40 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center text-gray-400 font-medium">
              🐂 우군 사진 영역
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">개체번호</span>
                <span className="font-bold text-emerald-700 text-base">{selectedCow.id}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">귀표번호</span>
                <span className="font-medium">{selectedCow.tag}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">성별 / 월령</span>
                <span className="font-medium">{selectedCow.sex}성 / {selectedCow.month}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">생년월일</span>
                <span className="font-medium">{selectedCow.birth}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">축사/칸</span>
                <span className="font-medium">{selectedCow.pen}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">현재 체중</span>
                <span className="font-bold text-gray-800">{selectedCow.weight}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">혈통번호</span>
                <span className="font-medium">{selectedCow.breed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">비고</span>
                <span className="font-medium">{selectedCow.memo}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg text-sm font-medium transition">수정</button>
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-sm font-medium transition">상세보기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}