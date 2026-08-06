// src/app/facilities/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Facility {
  _id?: string;
  penName: string;
  temperature: number;
  humidity: number;
  ventilationStatus: 'ON' | 'OFF';
  waterSystemStatus: '정상' | '점검필요';
  lastChecked: string;
}

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Facility>({
    penName: '',
    temperature: 23,
    humidity: 60,
    ventilationStatus: 'ON',
    waterSystemStatus: '정상',
    lastChecked: new Date().toISOString().split('T')[0],
  });

  const fetchFacilities = async () => {
    try {
      const res = await fetch('/api/facilities');
      if (!res.ok) throw new Error('API 응답 오류');
      const data = await res.json();
      if (Array.isArray(data)) setFacilities(data);
    } catch (error) {
      console.error('Failed to fetch facilities', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/facilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          penName: '',
          temperature: 23,
      humidity: 60,
          ventilationStatus: 'ON',
          waterSystemStatus: '정상',
          lastChecked: new Date().toISOString().split('T')[0],
        });
        fetchFacilities();
      }
    } catch (error) {
      console.error('Failed to create facility', error);
    }
  };

  // 환기팬 상태 토글 핸들러
  const toggleVentilation = async (facility: Facility) => {
    if (!facility._id) return;
    const nextStatus = facility.ventilationStatus === 'ON' ? 'OFF' : 'ON';

    try {
      const res = await fetch('/api/facilities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: facility._id, ventilationStatus: nextStatus }),
      });

      if (res.ok) {
        fetchFacilities();
      }
    } catch (error) {
      console.error('Failed to toggle ventilation', error);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-gray-100 min-h-screen">
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800">축사 환경 및 시설 관리</h1>
          <p className="text-xs text-gray-500 mt-0.5">축사별 실시간 온습도 모니터링 및 환기팬·급수기 설비 상태를 제어합니다.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
        >
          + 신규 축사 등록
        </button>
      </header>

      <main className="p-8">
        {loading ? (
          <div className="text-center py-12 text-gray-400">축사 시설 데이터를 불러오는 중입니다...</div>
        ) : facilities.length === 0 ? (
          <div className="bg-white rounded-xl border p-12 text-center text-gray-400 shadow-sm">
            등록된 축사 시설이 없습니다. 우측 상단 버튼을 눌러 등록해주세요.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((fac) => {
              const isHot = fac.temperature > 28;
              const isCold = fac.temperature < 10;
              return (
                <div key={fac._id} className="bg-white rounded-xl border shadow-sm p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="font-bold text-gray-900 text-lg">{fac.penName}</h2>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        fac.waterSystemStatus === '정상' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
                      }`}>
                        급수기: {fac.waterSystemStatus}
                      </span>
                    </div>

                    {/* 온습도 카드 */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-gray-50 border rounded-lg p-3 text-center">
                        <span className="text-xs text-gray-500 block mb-1">현재 온도</span>
                        <span className={`text-xl font-bold ${isHot ? 'text-red-600' : isCold ? 'text-blue-600' : 'text-gray-800'}`}>
                          {fac.temperature}°C
                        </span>
                        {isHot && <span className="block text-[10px] text-red-500 font-semibold mt-0.5">⚠️ 고온 주의</span>}
                      </div>
                      <div className="bg-gray-50 border rounded-lg p-3 text-center">
                        <span className="text-xs text-gray-500 block mb-1">현재 습도</span>
                        <span className="text-xl font-bold text-gray-800">{fac.humidity}%</span>
                        <span className="block text-[10px] text-gray-400 mt-0.5">적정 습도 유지</span>
                      </div>
                    </div>

                    {/* 환기팬 제어 컨트롤 */}
                    <div className="flex justify-between items-center border-t pt-4">
                      <div>
                        <span className="text-xs font-bold text-gray-700 block">환기팬 제어</span>
                        <span className="text-[11px] text-gray-400">자동/수동 환기 시스템</span>
                      </div>
                      <button
                        onClick={() => toggleVentilation(fac)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
                          fac.ventilationStatus === 'ON' 
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        환기팬 {fac.ventilationStatus}
                      </button>
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-gray-400 border-t mt-4 pt-2">
                    최종 점검일: {fac.lastChecked}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 신규 축사 등록 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">신규 축사 시설 등록</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">축사 명칭</label>
                <input
                  type="text"
                  required
                  value={formData.penName}
                  onChange={(e) => setFormData({ ...formData, penName: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="예: B동 2번사"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">초기 온도 (°C)</label>
                  <input
                    type="number"
                    required
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">초기 습도 (%)</label>
                  <input
                    type="number"
                    required
                    value={formData.humidity}
                    onChange={(e) => setFormData({ ...formData, humidity: Number(e.target.value) })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">급수기 상태</label>
                <select
                  value={formData.waterSystemStatus}
                  onChange={(e) => setFormData({ ...formData, waterSystemStatus: e.target.value as any })}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value="정상">정상</option>
                  <option value="점검필요">점검필요</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
                >
                  등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}