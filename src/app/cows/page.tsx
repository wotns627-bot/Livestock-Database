"use client";

import React, { useState } from 'react';

export default function CowsDashboard() {
  // 샘플 데이터 목록
  const [cows, setCows] = useState([
    { id: '2026-001', location: '1동 A열', status: '정상', genetics: { 도체중: 'A', 등심: 'A', 등지방: 'B', 근내지방: 'A' } },
    { id: '2026-002', location: '2동 B열', status: '입고', genetics: { 도체중: 'B', 등심: 'B', 등지방: 'A', 근내지방: 'C' } },
  ]);

  const [selectedCow, setSelectedCow] = useState(cows[0]);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">한우 개체 관리 대시보드</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 왼쪽: 개체 목록 */}
        <div className="md:col-span-1 bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold mb-4">개체 목록</h2>
          {cows.map(cow => (
            <div 
              key={cow.id} 
              onClick={() => setSelectedCow(cow)}
              className={`p-3 mb-2 border rounded cursor-pointer ${selectedCow.id === cow.id ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'}`}
            >
              <p className="font-bold">{cow.id}</p>
              <p className="text-sm text-gray-500">상태: {cow.status} | 위치: {cow.location}</p>
            </div>
          ))}
        </div>

        {/* 오른쪽: 상세 및 수정 폼 */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">개체 정보 상세/수정</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">상태 변경</label>
              <select className="w-full border p-2 rounded">
                <option>정상</option>
                <option>이동</option>
                <option>폐사</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(selectedCow.genetics).map(([key, val]) => (
                <div key={key}>
                  <label className="block text-sm font-medium">{key}</label>
                  <input type="text" defaultValue={val} className="w-full border p-2 rounded" />
                </div>
              ))}
            </div>
            
            <button className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">
              정보 저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}