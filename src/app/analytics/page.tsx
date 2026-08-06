'use client';

export default function AnalyticsPage() {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-gray-100 min-h-screen">
      {/* 상단 헤더 */}
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold">통계 및 분석</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border text-sm">
            <span>☀️ 28°C</span>
            <span className="font-medium ml-2">2025.07.20 (월)</span>
          </div>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">보고서 내보내기</button>
        </div>
      </header>

      {/* 본문 콘텐츠 */}
      <div className="p-8 space-y-6">
        {/* 상단 요약 카드 */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-xl border shadow-sm flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">이번 달 출하 두수</p>
              <h3 className="text-2xl font-bold mt-1">12 <span className="text-sm font-normal text-gray-500">두</span></h3>
            </div>
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">📈</div>
          </div>
          <div className="bg-white p-5 rounded-xl border shadow-sm flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">평균 출하 체중</p>
              <h3 className="text-2xl font-bold mt-1">795 <span className="text-sm font-normal text-gray-500">kg</span></h3>
            </div>
            <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">⚖️</div>
          </div>
          <div className="bg-white p-5 rounded-xl border shadow-sm flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">1+등급 이상 출하율</p>
              <h3 className="text-2xl font-bold mt-1 text-emerald-600">83.3 <span className="text-sm font-normal text-gray-500">%</span></h3>
            </div>
            <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">⭐</div>
          </div>
          <div className="bg-white p-5 rounded-xl border shadow-sm flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">두당 평균 사료비</p>
              <h3 className="text-2xl font-bold mt-1">2,450 <span className="text-sm font-normal text-gray-500">천원</span></h3>
            </div>
            <div className="p-3 bg-purple-100 text-purple-700 rounded-xl">💰</div>
          </div>
        </div>

        {/* 중단 그래프 및 분석 영역 */}
        <div className="grid grid-cols-2 gap-6">
          {/* 월별 사육 두수 추이 */}
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 text-sm">월별 사육 두수 추이</h3>
            <div className="h-64 flex items-end justify-between gap-4 pt-6 px-4 border-b pb-2">
              <div className="w-full bg-emerald-100 rounded-t flex flex-col justify-end items-center h-[60%] pb-2">
                <span className="text-xs font-semibold text-emerald-800">110두</span>
              </div>
              <div className="w-full bg-emerald-200 rounded-t flex flex-col justify-end items-center h-[70%] pb-2">
                <span className="text-xs font-semibold text-emerald-800">115두</span>
              </div>
              <div className="w-full bg-emerald-300 rounded-t flex flex-col justify-end items-center h-[85%] pb-2">
                <span className="text-xs font-semibold text-emerald-800">122두</span>
              </div>
              <div className="w-full bg-emerald-500 rounded-t flex flex-col justify-end items-center h-[95%] pb-2">
                <span className="text-xs font-semibold text-white">128두</span>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 px-4">
              <span>4월</span>
              <span>5월</span>
              <span>6월</span>
              <span>7월 (현재)</span>
            </div>
          </div>

          {/* 출하 성적 등급 분포 */}
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 text-sm">출하 성적 등급 분포 (최근 6개월)</h3>
            <div className="space-y-4 py-2">
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>1++ 등급</span>
                  <span className="text-emerald-600">45%</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full w-[45%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>1+ 등급</span>
                  <span className="text-emerald-500">38%</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[38%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>1 등급</span>
                  <span className="text-amber-500">14%</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full w-[14%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>2등급 이하</span>
                  <span className="text-rose-500">3%</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-rose-400 h-full w-[3%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 최근 출하 이력 테이블 */}
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <h3 className="font-bold text-gray-800 text-sm">최근 출하 이력</h3>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b text-gray-400 text-xs">
                <th className="pb-3">출하일자</th>
                <th className="pb-3">이력번호</th>
                <th className="pb-3">성별</th>
                <th className="pb-3">도체중</th>
                <th className="pb-3">육질등급</th>
                <th className="pb-3">경락가격</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-600">
              <tr className="hover:bg-gray-50">
                <td className="py-3">2025-07-15</td>
                <td className="py-3 font-semibold text-gray-800">312-8591-0192</td>
                <td className="py-3">거세</td>
                <td className="py-3 font-medium">492 kg</td>
                <td className="py-3"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-xs font-bold">1++</span></td>
                <td className="py-3 font-semibold text-emerald-600">11,800,000 원</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3">2025-07-10</td>
                <td className="py-3 font-semibold text-gray-800">312-8591-0185</td>
                <td className="py-3">거세</td>
                <td className="py-3 font-medium">478 kg</td>
                <td className="py-3"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-xs font-bold">1++</span></td>
                <td className="py-3 font-semibold text-emerald-600">11,250,000 원</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3">2025-07-02</td>
                <td className="py-3 font-semibold text-gray-800">312-8591-0174</td>
                <td className="py-3">암</td>
                <td className="py-3 font-medium">410 kg</td>
                <td className="py-3"><span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-bold">1+</span></td>
                <td className="py-3 font-semibold text-emerald-600">8,900,000 원</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}