'use client';

import React, { useState, useEffect } from 'react';

interface FeedItem {
  id: string;
  name: string;
  category: string;
  unitType: '톤백' | '10톤차' | '포대' | '풀둥치' | '사각풀';
  quantity: number;    // 수량 (톤백 수, 차량 대수, 포 개수 등)
  unitWeight: number;  // 1개당 무게 (kg) 또는 차량당 무게
  stock: number;       // 총 재고량 (quantity * unitWeight)
  pricePerKg: number;  // kg당 단가
  lastDate: string;
}

export default function FeedPage() {
  const [feedList, setFeedList] = useState<FeedItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    category: '배합사료',
    unitType: '톤백' as FeedItem['unitType'],
    quantity: '',
    unitWeight: '500', // 단위별 기본값 설정 (직접 변경 가능)
    pricePerKg: '',
    lastDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const saved = localStorage.getItem('feedRecordsMultiUnitCustom');
    if (saved) {
      try {
        setFeedList(JSON.parse(saved));
      } catch (e) {
        initDefaultData();
      }
    } else {
      initDefaultData();
    }
  }, []);

  const initDefaultData = () => {
    const defaultData: FeedItem[] = [
      { id: '1', name: '황우2호', category: '배합사료', unitType: '10톤차', quantity: 1, unitWeight: 10000, stock: 10000, pricePerKg: 620, lastDate: '2026-07-18' },
      { id: '2', name: '비지(빵박)', category: '부산물', unitType: '톤백', quantity: 9, unitWeight: 1000, stock: 9000, pricePerKg: 165, lastDate: '2026-07-17' },
      { id: '3', name: '라이(풀둥치)', category: '조사료', unitType: '풀둥치', quantity: 600, unitWeight: 320, stock: 192000, pricePerKg: 312.5, lastDate: '2026-07-16' },
      { id: '4', name: '클라인(사각풀)', category: '조사료', unitType: '사각풀', quantity: 240, unitWeight: 20, stock: 4800, pricePerKg: 590, lastDate: '2026-07-16' },
    ];
    setFeedList(defaultData);
    localStorage.setItem('feedRecordsMultiUnitCustom', JSON.stringify(defaultData));
  };

  const saveFeedList = (newList: FeedItem[]) => {
    setFeedList(newList);
    localStorage.setItem('feedRecordsMultiUnitCustom', JSON.stringify(newList));
  };

  // 단위 변경 시 적절한 기본 무게 제안 (자유롭게 수정 가능)
  const handleUnitChange = (type: FeedItem['unitType']) => {
    let defaultW = '500';
    if (type === '10톤차') defaultW = '10000'; // 기본 10톤(10,000kg)으로 설정하되 직접 수정 가능
    else if (type === '포대') defaultW = '25';
    else if (type === '풀둥치') defaultW = '350';
    else if (type === '사각풀') defaultW = '400';

    setForm({ ...form, unitType: type, unitWeight: defaultW });
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name || !form.quantity || !form.unitWeight || !form.pricePerKg) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const qtyNum = Number(form.quantity);
    const weightNum = Number(form.unitWeight);
    const totalStockKg = qtyNum * weightNum;

    if (editingId) {
      const updated = feedList.map(item => {
        if (item.id === editingId) {
          return {
            ...item,
            name: form.name,
            category: form.category,
            unitType: form.unitType,
            quantity: qtyNum,
            unitWeight: weightNum,
            stock: totalStockKg,
            pricePerKg: Number(form.pricePerKg),
            lastDate: form.lastDate,
          };
        }
        return item;
      });
      saveFeedList(updated);
      alert('수정되었습니다!');
    } else {
      const newItem: FeedItem = {
        id: Date.now().toString(),
        name: form.name,
        category: form.category,
        unitType: form.unitType,
        quantity: qtyNum,
        unitWeight: weightNum,
        stock: totalStockKg,
        pricePerKg: Number(form.pricePerKg),
        lastDate: form.lastDate,
      };
      saveFeedList([newItem, ...feedList]);
      alert('등록되었습니다!');
    }

    setIsAddModalOpen(false);
    setEditingId(null);
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      name: '',
      category: '배합사료',
      unitType: '톤백',
      quantity: '',
      unitWeight: '500',
      pricePerKg: '',
      lastDate: new Date().toISOString().split('T')[0],
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (item: FeedItem) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      unitType: item.unitType,
      quantity: item.quantity.toString(),
      unitWeight: item.unitWeight.toString(),
      pricePerKg: item.pricePerKg.toString(),
      lastDate: item.lastDate,
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`[${name}] 원료를 삭제하시겠습니까?`)) {
      saveFeedList(feedList.filter(item => item.id !== id));
    }
  };

  const totalKinds = feedList.length;
  const totalStockTon = (feedList.reduce((acc, cur) => acc + cur.stock, 0) / 1000).toFixed(1);
  const avgPrice = totalKinds > 0 ? Math.round(feedList.reduce((acc, cur) => acc + cur.pricePerKg, 0) / totalKinds) : 0;

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-xs font-semibold mb-1">전체 원료 종류</div>
            <div className="text-2xl font-extrabold text-gray-900">{totalKinds} 종</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl">🌾</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-xs font-semibold mb-1">총 재고량</div>
            <div className="text-2xl font-extrabold text-gray-900">{totalStockTon} 톤</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xl">📦</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-xs font-semibold mb-1">평균 KG 단가</div>
            <div className="text-2xl font-extrabold text-gray-900">{avgPrice.toLocaleString()} 원/kg</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-xl">💰</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden flex-1">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="font-bold text-gray-800 text-base">원료 및 조사료 재고 현황</h3>
          <button 
            onClick={openAddModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm"
          >
            + 원료 추가
          </button>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-200">
                <th className="px-4 py-3 font-semibold">원료명</th>
                <th className="px-4 py-3 font-semibold">분류</th>
                <th className="px-4 py-3 font-semibold">입고 방식</th>
                <th className="px-4 py-3 font-semibold">수량</th>
                <th className="px-4 py-3 font-semibold">단위 무게</th>
                <th className="px-4 py-3 font-semibold">총 재고량(KG)</th>
                <th className="px-4 py-3 font-semibold">KG당 단가</th>
                <th className="px-4 py-3 font-semibold">입고일자</th>
                <th className="px-4 py-3 font-semibold text-right w-28">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {feedList.map((item) => (
                <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="px-4 py-3 font-extrabold text-gray-900 text-xs">{item.name}</td>
                  <td className="px-4 py-3 text-xs">
                    <span className="px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-600">{item.category}</span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span className="px-2 py-0.5 rounded font-bold bg-blue-50 text-blue-600">{item.unitType}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-900 text-xs font-bold">{item.quantity.toLocaleString()} 개/대</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{item.unitWeight.toLocaleString()} kg</td>
                  <td className="px-4 py-3 text-blue-600 text-xs font-extrabold">{item.stock.toLocaleString()} kg</td>
                  <td className="px-4 py-3 text-gray-800 text-xs font-medium">{item.pricePerKg.toLocaleString()} 원</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{item.lastDate}</td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap text-xs">
                    <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-800 font-bold">수정</button>
                    <button onClick={() => handleDelete(item.id, item.name)} className="text-red-500 hover:text-red-700 font-bold">삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-800">{editingId ? '✏️ 원료 수정' : '🌾 신규 원료 등록'}</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 font-bold text-lg">×</button>
            </div>

            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-600 mb-1">원료명</label>
                <input 
                  type="text" 
                  placeholder="예: 빵박, 황우2호, 라이 등" 
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">분류</label>
                  <select 
                    value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl"
                  >
                    <option value="배합사료">배합사료</option>
                    <option value="부산물">부산물</option>
                    <option value="조사료">조사료</option>
                    <option value="곡물류">곡물류</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">입고 방식 (단위)</label>
                  <select 
                    value={form.unitType}
                    onChange={(e) => handleUnitChange(e.target.value as FeedItem['unitType'])}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold text-blue-600"
                  >
                    <option value="톤백">톤백</option>
                    <option value="10톤차">10톤차 (벌크)</option>
                    <option value="포대">포대 (소포장)</option>
                    <option value="풀둥치">풀둥치 (원형곤포)</option>
                    <option value="사각풀">사각곤포</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">
                    {form.unitType === '10톤차' ? '차량 대수' : '수량 (개/포/대)'}
                  </label>
                  <input 
                    type="number" 
                    placeholder="예: 1 또는 5" 
                    value={form.quantity}
                    onChange={(e) => setForm({...form, quantity: e.target.value})}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">
                    {form.unitType === '10톤차' ? '차량당 무게 (kg)' : '1개당 무게 (kg)'}
                  </label>
                  <input 
                    type="number" 
                    value={form.unitWeight}
                    onChange={(e) => setForm({...form, unitWeight: e.target.value})}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">KG당 단가 (원)</label>
                <input 
                  type="number" 
                  placeholder="예: 350" 
                  value={form.pricePerKg}
                  onChange={(e) => setForm({...form, pricePerKg: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl"
                />
                {form.quantity && form.unitWeight && (
                  <p className="text-[11px] text-emerald-600 mt-1 font-semibold">
                    💡 총 재고량 자동계산: {(Number(form.quantity) * Number(form.unitWeight)).toLocaleString()} kg
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">입고일자</label>
                <input 
                  type="date" 
                  value={form.lastDate}
                  onChange={(e) => setForm({...form, lastDate: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold">취소</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold">저장</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}