'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface SettlementItem {
  id: number;
  date: string;
  type: '수입' | '지출';
  category: string;
  title: string;
  client: string;
  amount: number;
}

interface CompletedShippingItem {
  id: string | number;
  meatQualityGrade: string;
  meatQuantityGrade: string;
  [key: string]: any;
}

interface ScheduleItem {
  id?: string | number;
  title: string;
  date?: string;
  time?: string;
  [key: string]: any;
}

interface InventoryItem {
  id?: string | number;
  name: string;
  category?: string;
  totalStock?: number;
  unit?: string;
  [key: string]: any;
}

export default function DashboardPage() {
  const [settlementList, setSettlementList] = useState<SettlementItem[]>([]);
  const [cattleCount, setCattleCount] = useState({ total: 0, castrated: 0, female: 0, calf: 0 });
  const [inventoryStatus, setInventoryStatus] = useState<InventoryItem[]>([]);
  const [scheduleList, setScheduleList] = useState<ScheduleItem[]>([]);
  
  // 판정 등급 통계용 상태
  const [completedList, setCompletedList] = useState<CompletedShippingItem[]>([]);
  const [qualityCounts, setQualityCounts] = useState<{ [key: string]: number }>({});
  const [quantityCounts, setQuantityCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    // 1. 경영/정산 데이터 로드
    const savedSettlement = localStorage.getItem('settlementList');
    if (savedSettlement) {
      setSettlementList(JSON.parse(savedSettlement));
    } else {
      const defaultSettlement: SettlementItem[] = [
        { id: 1, date: '2026-07-10', type: '수입', category: '출하대금', title: '거세우 출하 정산 (3119)', client: '농협음성축산물공판장', amount: 9200000 },
        { id: 2, date: '2026-07-15', type: '지출', category: '사료비', title: 'TMR 고급사료 구입', client: '남해사료', amount: 1200000 },
        { id: 3, date: '2026-06-20', type: '수입', category: '출하대금', title: '거세우 출하 정산 (3115)', client: '부경축산공판장', amount: 8900000 },
        { id: 4, date: '2026-06-05', type: '지출', category: '약품/방역', title: '구제역 백신 구입', client: '동방동물약품', amount: 450000 },
        { id: 5, date: '2026-05-12', type: '지출', category: '사료비', title: '농후사료 구입', client: '대한사료', amount: 850000 },
      ];
      setSettlementList(defaultSettlement);
      localStorage.setItem('settlementList', JSON.stringify(defaultSettlement));
    }

    // 2. 개체 수 데이터 동기화 (출하완료 상태 제외, 사육중인 소들만 산출)
    const savedCattle = localStorage.getItem('allCattleList');
    if (savedCattle) {
      const parsed = JSON.parse(savedCattle);
      const activeCattle = parsed.filter((c: any) => !c.status || c.status === '사육중');
      
      const total = activeCattle.length;
      const castrated = activeCattle.filter((c: any) => c.gender === '거세').length;
      const female = activeCattle.filter((c: any) => c.gender === '암').length;
      const calf = activeCattle.filter((c: any) => c.type === '송아지').length;
      
      setCattleCount({ total, castrated, female, calf });
    } else {
      setCattleCount({ total: 0, castrated: 0, female: 0, calf: 0 });
    }

    // 3. 사료 및 재고 데이터 동기화
    const savedInventory = localStorage.getItem('inventoryList');
    if (savedInventory) {
      try {
        const parsed = JSON.parse(savedInventory);
        if (Array.isArray(parsed)) {
          setInventoryStatus(parsed);
        }
      } catch (e) {
        console.error('Failed to parse inventoryList', e);
      }
    }

    // 4. 일정 데이터 동기화 (localStorage의 scheduleList 연동)
    const savedSchedule = localStorage.getItem('scheduleList');
    if (savedSchedule) {
      try {
        const parsed = JSON.parse(savedSchedule);
        if (Array.isArray(parsed)) {
          setScheduleList(parsed);
        }
      } catch (e) {
        console.error('Failed to parse scheduleList', e);
      }
    }

    // 5. 출하 정산 판정 등급 데이터 로드 및 집계
    const savedCompleted = localStorage.getItem('completedShippingDetails');
    if (savedCompleted) {
      try {
        const parsed: CompletedShippingItem[] = JSON.parse(savedCompleted);
        setCompletedList(parsed);

        const qMap: { [key: string]: number } = {};
        const qtyMap: { [key: string]: number } = {};

        parsed.forEach(item => {
          const qual = item.meatQualityGrade || '미분류';
          qMap[qual] = (qMap[qual] || 0) + 1;

          const qty = item.meatQuantityGrade || '미분류';
          qtyMap[qty] = (qtyMap[qty] || 0) + 1;
        });

        setQualityCounts(qMap);
        setQuantityCounts(qtyMap);
      } catch (e) {
        console.error('Failed to parse completed shipping details', e);
      }
    }
  }, []);

  // 최근 6개월 월별 매출(수입) 및 지출 데이터 집계
  const getLast6MonthsData = () => {
    const monthsData: { [key: string]: { income: number; expense: number } } = {};
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthsData[yearMonth] = { income: 0, expense: 0 };
    }

    settlementList.forEach(item => {
      if (!item.date) return;
      const ym = item.date.substring(0, 7);
      if (monthsData[ym]) {
        if (item.type === '수입') {
          monthsData[ym].income += item.amount;
        } else if (item.type === '지출') {
          monthsData[ym].expense += item.amount;
        }
      }
    });

    return Object.keys(monthsData).map(ym => {
      const [year, month] = ym.split('-');
      return {
        label: `${Number(month)}월`,
        income: monthsData[ym].income,
        expense: monthsData[ym].expense,
      };
    });
  };

  const monthlyChartData = getLast6MonthsData();
  const maxAmount = Math.max(...monthlyChartData.map(d => Math.max(d.income, d.expense)), 1000000);
  const totalCompletedCount = completedList.length;

  // 도넛(원형) 그래프 렌더링 헬퍼 함수
  const renderDonutChart = (dataMap: { [key: string]: number }, title: string) => {
    let accumulatedPercent = 0;
    const entries = Object.entries(dataMap);
    const strokeColors = ['#f59e0b', '#3b82f6', '#10b981', '#6366f1', '#f43f5e', '#a855f7'];

    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
          <p className="text-xs text-slate-500">총 정산 완료 {totalCompletedCount}두 기준 비율</p>
        </div>

        <div className="flex items-center justify-center my-6">
          {totalCompletedCount === 0 ? (
            <div className="text-slate-400 text-xs py-10">등록된 출하 정산 데이터가 없습니다.</div>
          ) : (
            <div className="relative w-36 h-36 rounded-full flex items-center justify-center shadow-inner bg-slate-50 overflow-hidden">
              <div className="absolute w-20 h-20 bg-white rounded-full z-10 flex flex-col items-center justify-center shadow-sm">
                <span className="text-[10px] text-slate-400 font-semibold">총 출하</span>
                <span className="text-xs font-bold text-slate-800">{totalCompletedCount}두</span>
              </div>
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {entries.map(([key, count], index) => {
                  const percentage = (count / totalCompletedCount) * 100;
                  const strokeDashArray = `${percentage} ${100 - percentage}`;
                  const dashOffset = -accumulatedPercent;
                  accumulatedPercent += percentage;
                  const color = strokeColors[index % strokeColors.length];

                  return (
                    <circle
                      key={key}
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="transparent"
                      stroke={color}
                      strokeWidth="3.8"
                      strokeDasharray={strokeDashArray}
                      strokeDashoffset={dashOffset}
                      className="transition-all duration-500"
                    />
                  );
                })}
              </svg>
            </div>
          )}
        </div>

        <div className="space-y-1.5 pt-3 border-t border-slate-100">
          {entries.map(([key, count], index) => {
            const percentage = totalCompletedCount > 0 ? Math.round((count / totalCompletedCount) * 100) : 0;
            const dotColor = strokeColors[index % strokeColors.length];
            
            return (
              <div key={key} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: dotColor }}></span>
                  <span className="font-semibold text-slate-700">{key}등급</span>
                </div>
                <div className="text-slate-500 font-medium">
                  {count}두 <span className="text-slate-400">({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* 상단 대시보드 타이틀 */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">🐮 스마트 한우 농장 종합 대시보드</h1>
          <p className="text-sm text-slate-500 mt-1">체계적인 사육부터 출하 성적, 경영/정산 현황을 한눈에 파악하세요.</p>
        </div>
        <div className="text-right text-xs text-slate-500 font-medium bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
          경상남도 남해군 실시간 날씨 <br />
          <span className="font-bold text-slate-800 text-sm">28°C 맑음 (습도 81%)</span>
        </div>
      </div>

      {/* 요약 카드 영역 (사육 현황 / 일정 / 사료 재고) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 사육 현황 요약 (출하완료 소 제외) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-800 text-sm">📊 사육 현황 구성 비율</h2>
            <Link href="/cattle" className="text-xs text-emerald-600 font-bold hover:underline">상세보기 &gt;</Link>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="font-extrabold text-slate-900 text-lg">
              전체 두수 <span className="text-emerald-600 text-xl">{cattleCount.total}두</span>
            </div>
            <div className="text-xs space-y-1 text-slate-600 font-medium">
              <div>🟢 거세우: {cattleCount.castrated}두</div>
              <div>🔵 암소: {cattleCount.female}두</div>
              <div>🟣 송아지: {cattleCount.calf}두</div>
            </div>
          </div>
        </div>

        {/* 오늘의 일정 알림 (실제 일정 데이터 연동 및 없을 시 빈 상태 표시) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-800 text-sm">🔔 오늘의 일정 알림</h2>
            <Link href="/schedule" className="text-xs text-emerald-600 font-bold hover:underline">일정표 &gt;</Link>
          </div>
          <div className="space-y-2.5 text-xs">
            {scheduleList.length === 0 ? (
              <div className="text-slate-400 text-center py-6">등록된 일정이 없습니다.</div>
            ) : (
              scheduleList.slice(0, 2).map((item, index) => (
                <div key={index} className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="font-bold text-amber-900">{item.title}</span>
                    <div className="text-slate-500 mt-0.5">{item.time || item.date || '일정 확인'}</div>
                  </div>
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 font-bold rounded-md">예정</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 주요 사료 재고 현황 (localStorage 연동) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-800 text-sm">🌾 주요 사료 재고 현황</h2>
            <Link href="/inventory" className="text-xs text-emerald-600 font-bold hover:underline">재고관리 &gt;</Link>
          </div>
          <div className="space-y-3 text-xs">
            {inventoryStatus.length === 0 ? (
              <div className="text-slate-400 text-center py-6">등록된 재고 데이터가 없습니다.</div>
            ) : (
              inventoryStatus.slice(0, 2).map((item, index) => {
                const stock = item.totalStock ?? 0;
                const unit = item.unit || 'kg';
                // 재고 상태 판단 (예: 5000 이상 안정, 미만 주의)
                const isStable = stock >= 5000;
                const statusText = isStable ? '안정' : '주의';
                const statusColor = isStable ? 'text-emerald-600' : 'text-amber-600';
                const barColor = isStable ? 'bg-emerald-500' : 'bg-amber-500';
                const percentage = Math.min(Math.round((stock / 20000) * 100), 100);

                return (
                  <div key={item.id || index}>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>{item.name}</span>
                      <span className={statusColor}>
                        {stock.toLocaleString()} {unit} ({statusText})
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`${barColor} h-full`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 출하 판정 등급 통계 원형 그래프 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderDonutChart(qualityCounts, '🥩 출하 육질등급 판정 비율 통계')}
        {renderDonutChart(quantityCounts, '⚖️ 출하 육량등급 판정 비율 통계')}
      </div>

      {/* 월별 매출 및 지출 현황 분석 그래프 영역 */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">📈 월별 매출 및 지출 현황 분석</h2>
            <p className="text-xs text-slate-500 mt-0.5">최근 6개월간 공판장 출하대금(수입)과 사료비·약품비 등(지출)의 흐름을 비교합니다.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-500 rounded-sm inline-block"></span>수입 (매출)</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-rose-400 rounded-sm inline-block"></span>지출</div>
            <Link href="/settlement" className="text-emerald-600 font-bold hover:underline ml-2">경영/정산 가기 &gt;</Link>
          </div>
        </div>

        {/* 바 차트 시각화 영역 */}
        <div className="grid grid-cols-6 gap-2 sm:gap-4 pt-6 pb-2 border-b border-slate-100 items-end h-64">
          {monthlyChartData.map((data, idx) => {
            const incomeHeight = Math.round((data.income / maxAmount) * 160);
            const expenseHeight = Math.round((data.expense / maxAmount) * 160);

            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1 h-48 px-1">
                  <div 
                    style={{ height: `${Math.max(incomeHeight, 4)}px` }}
                    className="w-1/2 bg-emerald-500 rounded-t-lg transition-all duration-300 group-hover:bg-emerald-600 relative"
                    title={`수입: ${data.income.toLocaleString()}원`}
                  ></div>
                  <div 
                    style={{ height: `${Math.max(expenseHeight, 4)}px` }}
                    className="w-1/2 bg-rose-400 rounded-t-lg transition-all duration-300 group-hover:bg-rose-500 relative"
                    title={`지출: ${data.expense.toLocaleString()}원`}
                  ></div>
                </div>
                <div className="text-xs font-bold text-slate-700 mt-3">{data.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 text-center">
                  <span className="text-emerald-600 font-semibold">{(data.income / 10000).toLocaleString()}만</span> / 
                  <span className="text-rose-500 font-semibold"> {(data.expense / 10000).toLocaleString()}만</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 하단 바로가기 메뉴 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/cattle" className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-emerald-500 transition group">
          <div className="text-2xl mb-2">🐄</div>
          <h3 className="font-bold text-slate-900 group-hover:text-emerald-600">개체 관리</h3>
          <p className="text-xs text-slate-500 mt-1">새로운 소 등록 및 이력 관리</p>
        </Link>
        <Link href="/schedule" className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-emerald-500 transition group">
          <div className="text-2xl mb-2">📅</div>
          <h3 className="font-bold text-slate-900 group-hover:text-emerald-600">일정 관리</h3>
          <p className="text-xs text-slate-500 mt-1">방역, 수정, 출하일정 캘린더</p>
        </Link>
        <Link href="/inventory" className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-emerald-500 transition group">
          <div className="text-2xl mb-2">🌾</div>
          <h3 className="font-bold text-slate-900 group-hover:text-emerald-600">사료 및 재고</h3>
          <p className="text-xs text-slate-500 mt-1">원료 및 TMR 배합비 관리</p>
        </Link>
        <Link href="/shipping" className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-emerald-500 transition group">
          <div className="text-2xl mb-2">📦</div>
          <h3 className="font-bold text-slate-900 group-hover:text-emerald-600">출하 및 성적</h3>
          <p className="text-xs text-slate-500 mt-1">출하 등록 및 등급별 분석</p>
        </Link>
      </div>
    </div>
  );
}