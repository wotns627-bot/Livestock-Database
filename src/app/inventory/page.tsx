'use client';
import { useState } from 'react';

export default function InventoryPage() {
  const [items, setItems] = useState([
    { name: '옥수수', stock: 500, unit: 'kg' },
    { name: '알팔파', stock: 300, unit: 'kg' },
    { name: '비타민제', stock: 50, unit: 'kg' },
  ]);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">📦 3. 원료 재고 관리</h1>
      
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-4">현재 재고 현황</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">원료명</th>
              <th className="p-3">현재 재고</th>
              <th className="p-3">관리</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-3 font-semibold">{item.name}</td>
                <td className="p-3">{item.stock} {item.unit}</td>
                <td className="p-3">
                  <button className="text-blue-500 hover:underline">수정</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="font-bold text-yellow-800">💡 TMR 배합 계산기</h3>
          <p className="text-sm text-yellow-700">원료를 입력하면 필요한 사료량을 자동 계산합니다.</p>
          {/* 배합 계산 로직 추가 예정 */}
        </div>
      </div>
    </div>
  );
}