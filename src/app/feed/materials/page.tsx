// src/app/feed/materials/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface RawMaterial {
  _id?: string;
  name: string;
  category: string;
  stock: number;
  unitPrice: number;
  safetyStock: number;
}

export default function RawMaterialsPage() {
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<RawMaterial>({
    name: '',
    category: '농후사료',
    stock: 1000,
    unitPrice: 500,
    safetyStock: 200,
  });

  const fetchMaterials = async () => {
    try {
      const res = await fetch('/api/raw-materials');
      if (!res.ok) throw new Error('API 응답 오류');
      const data = await res.json();
      
      // 데이터가 확실한 배열일 때만 상태에 반영
      if (Array.isArray(data)) {
        setMaterials(data);
      } else {
        setMaterials([]);
      }
    } catch (error) {
      console.error('Failed to fetch raw materials', error);
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/raw-materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          name: '',
          category: '농후사료',
          stock: 1000,
          unitPrice: 500,
          safetyStock: 200,
        });
        fetchMaterials();
      }
    } catch (error) {
      console.error('Failed to create raw material', error);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-gray-100 min-h-screen">
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800">사료 원료 재고 관리</h1>
          <p className="text-xs text-gray-500 mt-0.5">TMR 배합에 사용되는 원료의 재고 및 안전 재고를 관리합니다.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
        >
          + 신규 원료 등록
        </button>
      </header>

      <main className="p-8">
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">원료명</th>
                <th className="px-6 py-4">분류</th>
                <th className="px-6 py-4">현재 재고</th>
                <th className="px-6 py-4">단가 (원/kg)</th>
                <th className="px-6 py-4">안전 재고 기준</th>
                <th className="px-6 py-4">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    원료 데이터를 불러오는 중입니다...
                  </td>
                </tr>
              ) : !Array.isArray(materials) || materials.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    등록된 사료 원료가 없습니다. 상단 버튼을 눌러 등록해주세요.
                  </td>
                </tr>
              ) : (
                materials.map((item, index) => {
                  if (!item) return null;

                  const currentStock = Number(item.stock ?? 0) || 0;
                  const unitPrice = Number(item.unitPrice ?? 0) || 0;
                  const safetyStock = Number(item.safetyStock ?? 0) || 0;
                  const isLow = currentStock <= safetyStock;

                  return (
                    <tr key={item._id ? String(item._id) : index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {item.name ? String(item.name) : '이름 없음'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {item.category ? String(item.category) : '미분류'}
                      </td>
                      <td className={`px-6 py-4 font-semibold ${isLow ? 'text-red-600' : 'text-gray-900'}`}>
                        {currentStock.toLocaleString()} kg
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {unitPrice.toLocaleString()} 원
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {safetyStock.toLocaleString()} kg
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isLow ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {isLow ? '⚠️ 재고 부족' : '정상 재고'}
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
            <h2 className="text-lg font-bold mb-4">신규 사료 원료 등록</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">원료명</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="예: 옥수수 가공품"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">분류</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value="농후사료">농후사료</option>
                  <option value="조사료">조사료</option>
                  <option value="부산물사료">부산물사료</option>
                  <option value="광물/첨가제">광물/첨가제</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">초기 재고 (kg)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">단가 (원/kg)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">안전 재고 기준 (kg)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.safetyStock}
                  onChange={(e) => setFormData({ ...formData, safetyStock: Number(e.target.value) })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
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