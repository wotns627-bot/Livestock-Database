'use client';

import React, { useState, useEffect } from 'react';

interface SettlementItem {
  id: number;
  date: string;
  type: '수입' | '지출';
  category: '출하대금' | '사료비' | '약품/방역' | '자재/기타';
  title: string;
  client: string;
  amount: number;
}

export default function SettlementPage() {
  const [items, setItems] = useState<SettlementItem[]>([]);
  
  // 수동 등록 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<'수입' | '지출'>('수입');
  const [category, setCategory] = useState<'출하대금' | '사료비' | '약품/방역' | '자재/기타'>('출하대금');
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [amount, setAmount] = useState<number | ''>('');

  useEffect(() => {
    const saved = localStorage.getItem('settlementList');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      // 초기 기본 샘플 데이터
      const initialData: SettlementItem[] = [
        { id: 1, date: '2026-07-18', type: '수입', category: '출하대금', title: '거세우 3두 출하 정산 (1++등급)', client: '남해축협 가축시장', amount: 28400000 },
        { id: 2, date: '2026-07-15', type: '지출', category: '사료비', title: 'TMR 배합사료 5톤 구입', client: '남해사료 상사', amount: 4200000 },
        { id: 3, date: '2026-07-10', type: '지출', category: '약품/방역', title: '구제역 및 백신 일괄 구입', client: '가람 동물병원', amount: 850000 },
      ];
      setItems(initialData);
      localStorage.setItem('settlementList', JSON.stringify(initialData));
    }
  }, []);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !client || amount === '') {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const newItem: SettlementItem = {
      id: Date.now(),
      date,
      type,
      category,
      title,
      client,
      amount: Number(amount),
    };

    const updated = [newItem, ...items];
    setItems(updated);
    localStorage.setItem('settlementList', JSON.stringify(updated));

    // 폼 초기화 및 닫기
    setTitle('');
    setClient('');
    setAmount('');
    setIsModalOpen(false);
  };

  // 자동 정산 계산
  const totalRevenue = items.filter(i => i.type === '수입').reduce((acc, cur) => acc + cur.amount, 0);
  const totalExpense = items.filter(i => i.type === '지출').reduce((acc, cur) => acc + cur.amount, 0);
  const netProfit = totalRevenue - totalExpense;

  const totalFeedExpense = items.filter(i => i.category === '사료비').reduce((acc, cur) => acc + cur.amount, 0);
  const totalMedicineExpense = items.filter(i => i.category === '약품/방역').reduce((acc, cur) => acc + cur.amount, 0);
  const totalMaterialExpense = items.filter(i => i.category === '자재/기타').reduce((acc, cur) => acc + cur.amount, 0);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">💰 경영 및 정산 통합 관리</h1>
          <p className="text-sm text-slate-500 mt-1">출하 판매 대금, 사료비, 약품 재고 및 자재 지출을 통합 산정하여 순수익을 자동 계산합니다.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition shadow-sm"
          >
            + 수입/지출 직접 등록
          </button>
          <div className="text-right">
            <span className="text-xs text-slate-400">금년도 총 순수익</span>
            <div className="text-xl font-bold text-emerald-600">₩ {netProfit.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <span className="text-xs text-slate-400">총 매출 (출하 대금 등)</span>
          <p className="text-xl font-bold text-slate-800 mt-1">₩ {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <span className="text-xs text-slate-400">사료비 지출 합계</span>
          <p className="text-xl font-bold text-red-600 mt-1">₩ {totalFeedExpense.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <span className="text-xs text-slate-400">약품 및 방역 지출 합계</span>
          <p className="text-xl font-bold text-orange-600 mt-1">₩ {totalMedicineExpense.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <span className="text-xs text-slate-400">자재 및 기타 지출 합계</span>
          <p className="text-xl font-bold text-blue-600 mt-1">₩ {totalMaterialExpense.toLocaleString()}</p>
        </div>
      </div>

      {/* 전체 내역 테이블 */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-base font-bold text-slate-800 mb-4">📋 전체 수입 및 지출 연동 내역</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-slate-400 text-xs uppercase">
                <th className="pb-3">날짜</th>
                <th className="pb-3">구분</th>
                <th className="pb-3">항목 분류</th>
                <th className="pb-3">내용</th>
                <th className="pb-3">거래처</th>
                <th className="pb-3 text-right">금액</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-700">
              {items.length > 0 ? (
                items.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 text-slate-500">{item.date}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        item.type === '수입' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-semibold">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-slate-900">{item.title}</td>
                    <td className="py-3 text-slate-500">{item.client}</td>
                    <td className={`py-3 text-right font-bold ${item.type === '수입' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {item.type === '수입' ? '+ ' : '- '}₩ {item.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">등록된 내역이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 수입/지출 직접 등록 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleAddItem} className="bg-white p-6 rounded-2xl max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">📝 수입 및 지출 등록</h3>
            
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">거래 일자</label>
                  <input 
                    type="date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">구분</label>
                  <select 
                    value={type} 
                    onChange={e => {
                      const newType = e.target.value as '수입' | '지출';
                      setType(newType);
                      setCategory(newType === '수입' ? '출하대금' : '사료비');
                    }}
                    className="w-full p-2.5 border rounded-xl font-bold"
                  >
                    <option value="수입">수입</option>
                    <option value="지출">지출</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">항목 분류</label>
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full p-2.5 border rounded-xl font-bold"
                >
                  {type === '수입' ? (
                    <option value="출하대금">출하대금</option>
                  ) : (
                    <>
                      <option value="사료비">사료비</option>
                      <option value="약품/방역">약품/방역</option>
                      <option value="자재/기타">자재/기타</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">내용 (예: TMR 사료 2톤 구매, 백신 구입)</label>
                <input 
                  type="text" 
                  placeholder="내용을 입력하세요" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">거래처</label>
                <input 
                  type="text" 
                  placeholder="거래처를 입력하세요" 
                  value={client} 
                  onChange={e => setClient(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">금액 (원)</label>
                <input 
                  type="number" 
                  placeholder="숫자만 입력하세요" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full p-2.5 border rounded-xl font-bold text-sm"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-200 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-300"
              >
                취소
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
              >
                저장하기
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}