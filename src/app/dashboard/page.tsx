// src/app/dashboard/page.tsx
'use client';

import React from 'react';

export default function DashboardPage() {
  // 등급별 출하 통계 데이터 (총 30마리 기준)
  const gradeStats = [
    { grade: '1++A (마블링 9점)', count: 12, percentage: 40, color: 'bg-emerald-500', hex: '#10b981' },
    { grade: '1++A (마블링 8점)', count: 8, percentage: 26.7, color: 'bg-blue-500', hex: '#3b82f6' },
    { grade: '1++B (마블링 8~9점)', count: 5, percentage: 16.7, color: 'bg-purple-500', hex: '#8b5cf6' },
    { grade: '1+ 등급 (A/B)', count: 3, percentage: 10, color: 'bg-amber-500', hex: '#f59e0b' },
    { grade: '1등급 이하', count: 2, percentage: 6.6, color: 'bg-gray-400', hex: '#9ca3af' },
  ];

  // 도넛 그래프 conic-gradient 스타일 생성 (누적 퍼센트 계산)
  // 0~40(emerald), 40~66.7(blue), 66.7~83.4(purple), 83.4~93.4(amber), 93.4~100(gray)
  const donutGradient = `conic-gradient(
    #10b981 0% 40%, 
    #3b82f6 40% 66.7%, 
    #8b5cf6 66.7% 83.4%, 
    #f59e0b 83.4% 93.4%, 
    #9ca3af 93.4% 100%
  )`;

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6">
      
      {/* 1. 상단 환영 및 주요 지표 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-xs font-semibold mb-1">총 사육 마리수</div>
            <div className="text-2xl font-extrabold text-gray-900">128 <span className="text-sm font-normal text-gray-500">두</span></div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">🐄</div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-xs font-semibold mb-1">이번 달 출하 두수</div>
            <div className="text-2xl font-extrabold text-blue-600">4 <span className="text-sm font-normal text-gray-500">두</span></div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">🚚</div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-xs font-semibold mb-1">1++ 등급 출하 비중</div>
            <div className="text-2xl font-extrabold text-purple-600">83.4 <span className="text-sm font-normal text-gray-500">%</span></div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">⭐</div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-xs font-semibold mb-1">당월 추정 순이익</div>
            <div className="text-2xl font-extrabold text-emerald-600">+17,300 <span className="text-sm font-normal text-gray-500">천원</span></div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">💰</div>
        </div>
      </div>

      {/* 2. 메인 분석 영역 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* 좌측 2개 컬럼: 출하 성적 등급별 분포 도넛 그래프 */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">올해 출하 성적 등급별 점유율</h3>
              <p className="text-xs text-gray-400 mt-0.5">전체 출하 개체(30두) 기준 육질·육량 복합 등급 분포 현황입니다.</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
              총 30두 분석 완료
            </span>
          </div>

          {/* 그래프 및 범례 배치 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-4">
            
            {/* 동그라미(도넛) 그래프 */}
            <div className="flex justify-center">
              <div 
                className="relative w-52 h-52 rounded-full flex items-center justify-center shadow-inner"
                style={{ background: donutGradient }}
              >
                {/* 도넛 중앙 홀 (흰색 원) */}
                <div className="w-36 h-36 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                  <span className="text-xs text-gray-400 font-semibold">1++ 최우수 비중</span>
                  <span className="text-2xl font-extrabold text-emerald-600 mt-0.5">83.4%</span>
                  <span className="text-[10px] text-gray-400">25두 / 30두</span>
                </div>
              </div>
            </div>

            {/* 우측 범례 및 마리수 상세 리스트 */}
            <div className="space-y-3">
              {gradeStats.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-3.5 h-3.5 rounded-full ${item.color} shadow-xs`}></div>
                    <span className="font-medium text-gray-700 text-xs">{item.grade}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900 text-xs">{item.count}두</span>
                    <span className="text-xs font-extrabold text-gray-500 w-12 text-right">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
            <span>💡 고품질 KPN 정액 투입 개체군에서 1++A등급 출하율이 전년 대비 <strong className="text-emerald-600">+12.5%</strong> 증가했습니다.</span>
          </div>
        </div>

        {/* 우측 1개 컬럼: 긴급 알림 및 금일 일정 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="font-bold text-gray-800 text-lg mb-1">농장 긴급 알림 및 일정</h3>
          <p className="text-xs text-gray-400 mb-4">오늘 처리해야 할 주요 작업입니다.</p>

          <div className="space-y-3 flex-1 overflow-y-auto">
            <div className="p-3.5 bg-red-50/70 border border-red-100 rounded-xl">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-extrabold text-red-700">분만 임박 개체</span>
                <span className="text-[10px] bg-red-200 text-red-800 px-1.5 py-0.5 rounded font-bold">D-1</span>
              </div>
              <p className="text-xs text-gray-700 font-medium">0023번 개체 분만실 이동 및 관찰 필요</p>
            </div>

            <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-extrabold text-blue-700">백신 접종 일정</span>
                <span className="text-[10px] bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded font-bold">오늘</span>
              </div>
              <p className="text-xs text-gray-700 font-medium">송아지 구제역 2차 일괄 접종 (A동)</p>
            </div>

            <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-xl">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-extrabold text-amber-700">사료 재고 경고</span>
                <span className="text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded font-bold">잔량 15%</span>
              </div>
              <p className="text-xs text-gray-700 font-medium">비육우 후기사료 추가 주문 필요</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-2.5 rounded-xl text-xs transition border border-gray-200">
              전체 알림 및 이력 보기
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}