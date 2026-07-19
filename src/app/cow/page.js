"use client";

import React from 'react';

// 반드시 export default가 앞에 붙어 있어야 합니다.
export default function CowPage() {
  const mockCow = {
    id: '123456789',
    location: '1동 A열 01칸',
    status: '정상',
    entryDate: '2026-07-19',
    genetics: {
      '도체중': 'A',
      '등심단면적': 'A',
      '등지방두께': 'B',
      '근내지방도': 'A'
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">개체 상세 정보 조회 - {mockCow.id}</h1>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-semibold mb-4">유전 능력 평가</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(mockCow.genetics).map(([key, value]) => (
              <div key={key} className="border p-4 rounded text-center bg-gray-50">
                <p className="text-sm text-gray-500">{key}</p>
                <p className="text-2xl font-bold text-blue-600">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}