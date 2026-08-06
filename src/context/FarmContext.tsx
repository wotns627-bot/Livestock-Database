// src/context/FarmContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// 데이터 타입 정의 (필요에 따라 확장 가능)
export interface Barn {
  id: string;
  name: string; // 축사 이름 (예: 제1축사)
  capacity: number; // 수용 두수
  currentCount: number; // 현재 사육 두수
  memo: string;
}

interface FarmContextType {
  barns: Barn[];
  addBarn: (barn: Omit<Barn, 'id'>) => void;
  deleteBarn: (id: string) => void;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export function FarmProvider({ children }: { children: React.ReactNode }) {
  // 초기 데이터를 LocalStorage에서 불러오거나 기본값 사용
  const [barns, setBarns] = useState<Barn[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hanwoo_barns');
      if (saved) return JSON.parse(saved);
    }
    return [
      { id: '1', name: '제1축사 (비육우사)', capacity: 50, currentCount: 42, memo: '1번 구역 환풍기 점검 필요' },
      { id: '2', name: '제2축사 (번식우사)', capacity: 30, currentCount: 28, memo: '분만사 인근 소독 철저' },
    ];
  });

  // barns 상태가 바뀔 때마다 LocalStorage에 저장하여 새로고침해도 유지되도록 함
  useEffect(() => {
    localStorage.setItem('hanwoo_barns', JSON.stringify(barns));
  }, [barns]);

  const addBarn = (newBarn: Omit<Barn, 'id'>) => {
    const barnWithId = { ...newBarn, id: Date.now().toString() };
    setBarns((prev) => [barnWithId, ...prev]);
  };

  const deleteBarn = (id: string) => {
    setBarns((prev) => prev.filter((barn) => barn.id !== id));
  };

  return (
    <FarmContext.Provider value={{ barns, addBarn, deleteBarn }}>
      {children}
    </FarmContext.Provider>
  );
}

export function useFarm() {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
}