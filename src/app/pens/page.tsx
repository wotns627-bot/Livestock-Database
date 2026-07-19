'use client';
import { useState, useEffect } from 'react';

export default function PensPage() {
  const [cows, setCows] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/cows')
      .then((res) => res.json())
      .then((data) => setCows(data))
      .catch((err) => console.error("데이터 로드 실패:", err));
  }, []);

  // 1동과 2동으로 데이터 필터링
  const getCowsByPen = (penPrefix: string) => 
    cows.filter(c => c.penNumber?.startsWith(penPrefix));

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">축사 현황 (동별 구분)</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 1동 */}
        <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-blue-500">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">🏠 1동 (총 {getCowsByPen('1동').length}마리)</h2>
          <div className="space-y-2">
            {getCowsByPen('1동').map(c => (
              <div key={c._id} className="p-3 bg-blue-50 rounded-lg flex justify-between">
                <span>개체번호: {c.cowNumber}</span>
                <span className="text-sm text-blue-600 font-bold">{c.penNumber}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2동 */}
        <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-green-500">
          <h2 className="text-2xl font-bold text-green-600 mb-4">🏠 2동 (총 {getCowsByPen('2동').length}마리)</h2>
          <div className="space-y-2">
            {getCowsByPen('2동').map(c => (
              <div key={c._id} className="p-3 bg-green-50 rounded-lg flex justify-between">
                <span>개체번호: {c.cowNumber}</span>
                <span className="text-sm text-green-600 font-bold">{c.penNumber}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}