'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface InventoryItem {
  id: number;
  name: string;
  category: '사료' | '약품/백신' | '기타기자재';
  totalStock: number;
  unit: string;
  minStock: number;
  cost: number;
  supplier: string;
  memo: string;
  lastUpdated: string;
}

export default function InventoryManagementPage() {
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<'사료' | '약품/백신' | '기타기자재'>('사료');
  const [totalStock, setTotalStock] = useState<number>(10);
  const [unit, setUnit] = useState('포');
  const [minStock, setMinStock] = useState<number>(3);
  const [cost, setCost] = useState<number>(350000);
  const [supplier, setSupplier] = useState('남해사료');
  const [memo, setMemo] = useState('정기 입고');

  useEffect(() => {
    const saved = localStorage.getItem('inventoryList');
    if (saved) {
      setInventoryList(JSON.parse(saved));
    } else {
      const defaultData: InventoryItem[] = [
        {
          id: 1,
          name: 'TMR 고급사료',
          category: '사료',
          totalStock: 50,
          unit: '포',
          minStock: 10,
          cost: 1200000,
          supplier: '남해사료',
          memo: '육성우 급여용',
          lastUpdated: '2026-07-20',
        },
        {
          id: 2,
          name: '구제역 백신',
          category: '약품/백신',
          totalStock: 150,
          unit: '두분',
          minStock: 30,
          cost: 450000,
          supplier: '동방동물약품',
          memo: '정기 접종용',
          lastUpdated: '2026-07-22',
        },
      ];
      setInventoryList(defaultData);
      localStorage.setItem('inventoryList', JSON.stringify(defaultData));
    }
  }, []);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setName('');
    setCategory('사료');
    setTotalStock(10);
    setUnit('포');
    setMinStock(3);
    setCost(350000);
    setSupplier('남해사료');
    setMemo('정기 입고');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: InventoryItem) => {
    setEditingId(item.id);
    setName(item.name);
    setCategory(item.category);
    setTotalStock(item.totalStock);
    setUnit(item.unit);
    setMinStock(item.minStock);
    setCost(item.cost);
    setSupplier(item.supplier);
    setMemo(item.memo);
    setIsModalOpen(true);
  };

  const handleSaveInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const todayStr = new Date().toISOString().split('T')[0];

    if (editingId !== null) {
      // 기존 항목 수정
      const updatedList = inventoryList.map(item => {
        if (item.id === editingId) {
          return {
            ...item,
            name,
            category,
            totalStock: Number(totalStock),
            unit,
            minStock: Number(minStock),
            cost: Number(cost),
            supplier,
            memo,
            lastUpdated: todayStr,
          };
        }
        return item;
      });

      setInventoryList(updatedList);
      localStorage.setItem('inventoryList', JSON.stringify(updatedList));
      alert('물품 정보가 성공적으로 수정되었습니다.');
    } else {
      // 신규 등록
      const newItem: InventoryItem = {
        id: Date.now(),
        name,
        category,
        totalStock: Number(totalStock),
        unit,
        minStock: Number(minStock),
        cost: Number(cost),
        supplier,
        memo,
        lastUpdated: todayStr,
      };

      const updatedList = [newItem, ...inventoryList];
      setInventoryList(updatedList);
      localStorage.setItem('inventoryList', JSON.stringify(updatedList));

      // 경영/정산(settlementList) 자동 연동 로직
      const settlementSaved = localStorage.getItem('settlementList');
      const settlementList = settlementSaved ? JSON.parse(settlementSaved) : [];
      const newSettlement = {
        id: Date.now(),
        date: todayStr,
        type: '지출',
        category: category === '약품/백신' ? '약품/방역' : '사료비',
        title: `${name} (${totalStock}${unit}) 구입`,
        client: supplier,
        amount: Number(cost),
      };
      localStorage.setItem('settlementList', JSON.stringify([newSettlement, ...settlementList]));
      alert('새 물품이 등록되고 경영/정산 지출에 반영되었습니다.');
    }

    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const filtered = inventoryList.filter(item => item.id !== id);
      setInventoryList(filtered);
      localStorage.setItem('inventoryList', JSON.stringify(filtered));
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">🌾 사료 및 자재/약품 관리</h1>
          <p className="text-sm text-slate-500 mt-1">농장에서 보유 중인 사료, 백신, 기자재 재고와 구입 내역을 관리합니다.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/settlement" className="bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition">
            경영/정산 가기
          </Link>
          <button 
            onClick={handleOpenAddModal}
            className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition shadow-sm"
          >
            + 물품 등록 / 구입
          </button>
        </div>
      </div>

      {/* 재고 현황 목록 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 font-bold text-slate-800 bg-slate-50/50">
          <span>보유 재고 및 구입 목록</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="text-slate-500 text-xs border-b border-slate-100 bg-slate-50">
                <th className="p-4 font-semibold">구분 / 품명</th>
                <th className="p-4 font-semibold">현재 재고</th>
                <th className="p-4 font-semibold">안전 재고</th>
                <th className="p-4 font-semibold">구입 비용</th>
                <th className="p-4 font-semibold">거래처</th>
                <th className="p-4 font-semibold">메모 / 최종일자</th>
                <th className="p-4 font-semibold text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {inventoryList.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-medium mr-2">{item.category}</span>
                    <span className="font-bold text-slate-900">{item.name}</span>
                  </td>
                  <td className="p-4">
                    <span className={`font-bold ${item.totalStock <= item.minStock ? 'text-rose-600' : 'text-slate-900'}`}>
                      {item.totalStock} {item.unit}
                    </span>
                    {item.totalStock <= item.minStock && (
                      <span className="ml-2 px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-bold rounded">재고 부족</span>
                    )}
                  </td>
                  <td className="p-4 text-xs text-slate-500">{item.minStock} {item.unit}</td>
                  <td className="p-4 font-bold text-slate-800">{item.cost.toLocaleString()}원</td>
                  <td className="p-4 text-xs text-slate-600">{item.supplier}</td>
                  <td className="p-4 text-xs">
                    <div className="text-slate-600">{item.memo}</div>
                    <div className="text-slate-400">{item.lastUpdated}</div>
                  </td>
                  <td className="p-4 text-right space-x-1.5">
                    <button 
                      onClick={() => handleOpenEditModal(item)}
                      className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition"
                    >
                      수정
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-100 transition"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
              {inventoryList.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-slate-400">등록된 재고 내역이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 물품 등록 / 수정 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingId !== null ? '✏️ 물품 정보 수정' : '📦 새 물품 / 사료 / 약품 등록'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            
            <form onSubmit={handleSaveInventory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">구분 *</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 border rounded-xl text-sm outline-none bg-white font-bold text-slate-800"
                >
                  <option value="사료">사료</option>
                  <option value="약품/백신">약품/백신</option>
                  <option value="기타기자재">기타기자재</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">물품명 *</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: TMR 사료, 구제역 백신 등"
                  className="w-full p-2.5 border rounded-xl text-sm outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">현재 재고 수량 *</label>
                  <input 
                    type="number" 
                    value={totalStock}
                    onChange={(e) => setTotalStock(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl text-sm outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">단위 *</label>
                  <input 
                    type="text" 
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="포, 두분, 베일 등"
                    className="w-full p-2.5 border rounded-xl text-sm outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">구입 비용 (원) *</label>
                  <input 
                    type="number" 
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl text-sm outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">거래처 *</label>
                  <input 
                    type="text" 
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    className="w-full p-2.5 border rounded-xl text-sm outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">메모</label>
                <input 
                  type="text" 
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  취소
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
                >
                  {editingId !== null ? '수정 완료' : '등록 및 정산 반영'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}