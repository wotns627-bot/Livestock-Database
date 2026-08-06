// src/app/shipment/page.tsx
'use client';

import React from 'react';

export default function ShipmentPage() {
  const shipments = [
    { date: '2026-07-25', id: 'KR123456789016', barn: 'D동-02', weight: '710 kg', grade: '판정 대기', slaughterhouse: '남해축산물공판장', status: '출하예정' },
    { date: '2026-07-20', id: 'KR123456789005', barn: 'C동-01', weight: '735 kg', grade: '1++', slaughterhouse: '남해축산물공판장', status: '판정완료' },
    { date: '2026-07-10', id: 'KR123456789001', barn: 'A동-03', weight: '690 kg', grade: '1+', slaughterhouse: '남해축산물공판장', status: '정산완료' },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6 bg-gray-50/50">
      
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">출하 및 도축 관리</h2>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm">
          + 출하 예약 신청
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 font-bold text-gray-800 text-sm">
          출하 및 등급 판정 내역
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase border-b border-gray-200">
                <th className="px-4 py-3 font-semibold">출하 일자</th>
                <th className="px-4 py-3 font-semibold">이력번호</th>
                <th className="px-4 py-3 font-semibold text-center">축사 위치</th>
                <th className="px-4 py-3 font-semibold text-center">출하 체중</th>
                <th className="px-4 py-3 font-semibold text-center">도축장</th>
                <th className="px-4 py-3 font-semibold text-center">육질 등급</th>
                <th className="px-4 py-3 font-semibold text-center">진행 상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {shipments.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-gray-900">{item.date}</td>
                  <td className="px-4 py-3 font-medium text-blue-600">{item.id}</td>
                  <td className="px-4 py-3 text-center text-gray-500">{item.barn}</td>
                  <td className="px-4 py-3 text-center font-bold">{item.weight}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{item.slaughterhouse}</td>
                  <td className="px-4 py-3 text-center font-extrabold text-amber-600">{item.grade}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}