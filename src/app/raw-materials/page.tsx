// src/app/raw-materials/page.tsx
'use client';

import React from 'react';

export default function RawMaterialsPage() {
  const materials = [
    { name: '볏짚', category: '부산물', stock: '8,200', unit: 'kg', price: '280', date: '2025-07-18' },
    { name: '황우2호', category: '배합사료', stock: '6,500', unit: 'kg', price: '510', date: '2025-07-18' },
    { name: '비지', category: '부산물', stock: '10,000', unit: 'kg', price: '120', date: '2025-07-17' },
    { name: '라이완동치', category: '조사료', stock: '1,000', unit: 'kg', price: '200', date: '2025-07-15', low: true },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6 bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">원료 관리</h2>
        <div className="flex gap-2">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm">+ 원료 추가</button>
          <button className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold px-4 py-2 rounded-xl text-xs transition">입고 등록</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 font-bold text-gray-800 text-sm">원료 목록</div>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 text-gray-500 uppercase border-b border-gray-200">
              <th className="px-4 py-3 font-semibold">원료명</th>
              <th className="px-4 py-3 font-semibold">분류</th>
              <th className="px-4 py-3 font-semibold text-right">현재 재고</th>
              <th className="px-4 py-3 font-semibold text-center">단위</th>
              <th className="px-4 py-3 font-semibold text-right">평균 단가(원/kg)</th>
              <th className="px-4 py-3 font-semibold text-center">최근 입고일</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {materials.map((m, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-bold text-gray-900">{m.name}</td>
                <td className="px-4 py-3 text-gray-500">{m.category}</td>
                <td className={`px-4 py-3 text-right font-extrabold ${m.low ? 'text-red-600' : 'text-gray-900'}`}>{m.stock}</td>
                <td className="px-4 py-3 text-center text-gray-500">{m.unit}</td>
                <td className="px-4 py-3 text-right font-medium">{m.price}</td>
                <td className="px-4 py-3 text-center text-gray-500">{m.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}