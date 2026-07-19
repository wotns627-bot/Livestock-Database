'use client';
import { useState, useEffect } from 'react';

export default function ShippingPage() {
  const [shippingData, setShippingData] = useState([]);

  // 데이터 로드 (실제 출하 상태인 소들만 필터링하거나 별도 API 호출)
  useEffect(() => {
    // 예시 데이터 구조
    setShippingData([
      { id: 1, cowNumber: '262026', date: '2026-07-19', grade: 'A++', weight: 450, marbling: '9' }
    ]);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">🚚 4. 출하 현황</h1>
      
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <table className="w-full text-center">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-4">개체번호</th>
              <th className="p-4">출하일자</th>
              <th className="p-4">등급</th>
              <th className="p-4">도체중</th>
              <th className="p-4">근내지방</th>
              <th className="p-4">관리</th>
            </tr>
          </thead>
          <tbody>
            {shippingData.map((data: any) => (
              <tr key={data.id} className="border-t">
                <td className="p-4 font-bold">{data.cowNumber}</td>
                <td className="p-4">{data.date}</td>
                <td className="p-4 text-purple-600 font-bold">{data.grade}</td>
                <td className="p-4">{data.weight}kg</td>
                <td className="p-4">{data.marbling}</td>
                <td className="p-4">
                  <button className="bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200">수정</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}