'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface CattleItem {
  id: number;
  earTag: string;
  barnLocation: string;
  status: '사육중' | '출하완료';
  [key: string]: any;
}

// 큰축사(좌측 15칸, 우측 15칸) + 작은축사(우측 7칸 등) 고정 구조 정의
const LARGE_BARN_LEFT = Array.from({ length: 15 }, (_, i) => `큰축사 좌${i + 1}`);
const LARGE_BARN_RIGHT = Array.from({ length: 15 }, (_, i) => `큰축사 우${i + 1}`);
const SMALL_BARN_RIGHT = Array.from({ length: 7 }, (_, i) => `작은축사 우${i + 1}`);

export default function BarnPage() {
  const [cattleList, setCattleList] = useState<CattleItem[]>([]);
  const [barnCattleMap, setBarnCattleMap] = useState<{ [key: string]: string[] }>({});

  // 페이지 마운트 시 및 로컬스토리지 변경 감지
  useEffect(() => {
    const loadData = () => {
      const savedCattle = localStorage.getItem('allCattleList');
      if (savedCattle) {
        try {
          const parsed = JSON.parse(savedCattle);
          setCattleList(parsed);

          // 칸별로 사육 중인 개체의 귀표번호 매핑 생성
          const map: { [key: string]: string[] } = {};
          parsed.forEach((c: CattleItem) => {
            if (c.status === '사육중' && c.barnLocation) {
              if (!map[c.barnLocation]) {
                map[c.barnLocation] = [];
              }
              map[c.barnLocation].push(c.earTag);
            }
          });
          setBarnCattleMap(map);
        } catch (e) {
          console.error('개체 데이터 로드 오류:', e);
        }
      }
    };

    loadData();

    // 다른 페이지나 탭에서 데이터가 바뀔 때를 대비한 이벤트 리스너
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  // 총 사육 두수 계산
  const totalRaisingCount = Object.values(barnCattleMap).reduce((acc, curr) => acc + curr.length, 0);

  // 칸 렌더링 헬퍼 컴포넌트
  const renderCell = (locationName: string) => {
    const occupants = barnCattleMap[locationName] || [];
    const isOccupied = occupants.length > 0;

    return (
      <div 
        key={locationName}
        className={`p-4 rounded-2xl border transition flex flex-col justify-between min-h-[110px] ${
          isOccupied 
            ? 'bg-emerald-50/40 border-emerald-200 shadow-sm' 
            : 'bg-white border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex justify-between items-center">
          <span className="font-bold text-xs text-slate-800">{locationName.replace(/^(큰축사|작은축사)\s*/, '')}</span>
          <span className={`w-2 h-2 rounded-full ${isOccupied ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-slate-200'}`}></span>
        </div>

        <div className="my-2">
          {isOccupied ? (
            <div className="space-y-1">
              {occupants.map((tag) => (
                <div key={tag} className="bg-emerald-600 text-white font-bold text-xs px-2 py-1 rounded-lg text-center shadow-sm">
                  🐄 {tag}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-xs text-slate-400 font-medium py-1">
              공실
            </div>
          )}
        </div>

        <div className="text-[10px] text-right text-slate-400 font-semibold">
          {isOccupied ? '사육중' : '비어있음'}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* 상단 타이틀 영역 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">🏠 축사 현황 및 칸 관리</h1>
          <p className="text-sm text-slate-500 mt-1">개체 관리에서 지정한 위치가 실시간으로 각 칸에 반영됩니다.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/cattle" className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-emerald-700 transition">
            개체 관리로 이동 &gt;
          </Link>
        </div>
      </div>

      {/* 큰축사 구역 */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">큰축사</h2>
            <p className="text-xs text-slate-500 mt-0.5">사육 두수: <strong className="text-emerald-600">{totalRaisingCount}두</strong> / 총 30칸</p>
          </div>
        </div>

        {/* 좌측 라인 */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-600">좌측 라인 (15칸)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {LARGE_BARN_LEFT.map(loc => renderCell(loc))}
          </div>
        </div>

        {/* 우측 라인 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-600">우측 라인 (15칸)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {LARGE_BARN_RIGHT.map(loc => renderCell(loc))}
          </div>
        </div>
      </div>

      {/* 작은축사 구역 */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">작은축사</h2>
            <p className="text-xs text-slate-500 mt-0.5">총 7칸</p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-600">우측 라인 (7칸)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
            {SMALL_BARN_RIGHT.map(loc => renderCell(loc))}
          </div>
        </div>
      </div>
    </div>
  );
}