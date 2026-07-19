"use client";
import React, { useState, useEffect } from 'react';

export default function UltimateFarmSystem() {
  const [cows, setCows] = useState([]);
  const [selectedCow, setSelectedCow] = useState(null);
  const [newCowId, setNewCowId] = useState('');
  const [notification, setNotification] = useState('');

  // 1. 데이터 로드 및 알림 설정 (예: 30일 뒤 백신)
  useEffect(() => {
    const saved = localStorage.getItem('my-farm-cows');
    const data = saved ? JSON.parse(saved) : [];
    setCows(data);
    setNotification('현재 진행 중인 백신 접종 대상: 2026-001, 2026-003');
  }, []);

  // 2. 개체 추가
  const handleAdd = () => {
    if (!newCowId) return;
    const newCow = { 
      id: newCowId, status: '정상', 
      genetics: { 도체중: '?', 등심: '?', 등지방: '?', 근내지방: '?' },
      lastUpdate: new Date().toLocaleDateString()
    };
    const updated = [...cows, newCow];
    setCows(updated);
    localStorage.setItem('my-farm-cows', JSON.stringify(updated));
    setNewCowId('');
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">🐂 스마트 농장 관리 시스템</h1>
      
      {/* 알림 배너 */}
      <div className="bg-yellow-100 p-3 rounded-lg mb-4 text-sm font-bold text-yellow-800">
        🔔 알림: {notification}
      </div>

      {/* 3. 모바일용 간편 입력 */}
      <div className="flex gap-2 mb-6">
        <input 
          value={newCowId} onChange={(e) => setNewCowId(e.target.value)}
          placeholder="새 개체 번호 입력" className="flex-1 p-3 border rounded-lg"
        />
        <button onClick={handleAdd} className="bg-blue-600 text-white px-6 rounded-lg font-bold">추가</button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 목록 */}
        <div className="bg-white p-4 rounded-xl shadow h-80 overflow-auto">
          <h2 className="font-bold mb-2">개체 목록</h2>
          {cows.map(cow => (
            <div key={cow.id} onClick={() => setSelectedCow(cow)} 
              className="p-3 border-b cursor-pointer hover:bg-blue-50 flex justify-between">
              <span>{cow.id}</span>
              <span className="text-xs text-gray-400">수정일: {cow.lastUpdate}</span>
            </div>
          ))}
        </div>

        {/* 상세정보 */}
        <div className="bg-white p-6 rounded-xl shadow">
          {selectedCow ? (
            <div>
              <h2 className="text-xl font-bold mb-4">{selectedCow.id} 상세 기록</h2>
              <div className="space-y-2">
                <p>상태: <span className="font-bold">{selectedCow.status}</span></p>
                <div className="grid grid-cols-2 gap-2 text-sm mt-4">
                  {Object.entries(selectedCow.genetics).map(([k, v]) => (
                    <div key={k} className="p-2 border rounded">{k}: {v}</div>
                  ))}
                </div>
              </div>
            </div>
          ) : <p className="text-gray-400 mt-20 text-center">개체를 선택하세요</p>}
        </div>
      </div>
    </div>
  );
}