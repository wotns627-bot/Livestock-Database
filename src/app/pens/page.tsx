'use client';

import { useState, useEffect } from 'react';

interface Pen {
  _id?: string;
  penName: string;
  penType: string;
  capacity: number;
  currentCount: number;
  status: string;
}

export default function PensPage() {
  const [pens, setPens] = useState<Pen[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Pen>({
    penName: '',
    penType: '비육사',
    capacity: 20,
    currentCount: 0,
    status: '정상',
  });

  const fetchPens = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/pens');
      if (!res.ok) {
        throw new Error('API 응답이 올바르지 않습니다.');
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setPens(data);
      } else if (data && Array.isArray(data.pens)) {
        setPens(data.pens);
      } else {
        setPens([]);
      }
    } catch (error) {
      console.error('Failed to fetch pens', error);
      setPens([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPens();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/pens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          penName: '',
          penType: '비육사',
          capacity: 20,
          currentCount: 0,
          status: '정상',
        });
        fetchPens();
      }
    } catch (error) {
      console.error('Failed to create pen record', error);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-gray-100 min-h-screen">
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">축사 시설 관리</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
        >
          + 신규 축사 등록
        </button>
      </header>

      <main className="p-8">
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">축사명</th>
                <th className="px-6 py-4">사육 용도</th>
                <th className="px-6 py-4">현재 입식 두수 / 최대 수용력</th>
                <th className="px-6 py-4">가동 상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                    축사 데이터를 불러오는 중입니다...
                  </td>
                </tr>
              ) : pens.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                    등록된 축사 시설이 없습니다. 상단 버튼을 눌러 등록해주세요.
                  </td>
                </tr>
              ) : (
                pens.map((item, index) => {
                  const currentCount = Number(item?.currentCount) || 0;
                  const capacity = Number(item?.capacity) || 0;

                  return (
                    <tr key={item._id || item.penName || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold text-gray-900">{item.penName || '-'}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {item.penType || '비육사'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {currentCount.toLocaleString()} 마리 /{' '}
                        <span className="text-gray-500">{capacity.toLocaleString()} 마리</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                          {item.status || '정상'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">신규 축사 시설 등록</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">축사명</label>
                <input
                  type="text"
                  required
                  value={formData.penName}
                  onChange={(e) => setFormData({ ...formData, penName: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="예: A동 1번사"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">사육 용도</label>
                <select
                  value={formData.penType}
                  onChange={(e) => setFormData({ ...formData, penType: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value="비육사">비육사</option>
                  <option value="번식사">번식사</option>
                  <option value="송아지방">송아지방</option>
                  <option value="분만사">분만사</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">현재 입식 두수</label>
                  <input
                    type="number"
                    required
                    value={formData.currentCount}
                    onChange={(e) =>
                      setFormData({ ...formData, currentCount: Number(e.target.value) || 0 })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">최대 수용 두수</label>
                  <input
                    type="number"
                    required
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: Number(e.target.value) || 0 })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
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