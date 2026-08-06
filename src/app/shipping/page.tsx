'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface ShippingItem {
  id: string | number;
  earTag?: string;
  number?: string;
  kpn?: string;
  type?: string;
  gender?: string;
  birthDate?: string;
  entryDate?: string;
  enterDate?: string;
  inDate?: string;
  previousFarm?: string;
  prevOwner?: string;
  previousOwner?: string;
  farm?: string;
  originFarm?: string;
  meatGrade?: {
    coldWeight?: string;
    loinArea?: string;
    fatThickness?: string;
    marbling?: string;
  };
  predictedCarcassWeight?: string;
  eyeMuscleArea?: string;
  backFatThickness?: string;
  marblingNumber?: string;
  carcassWeightGrade?: string;
  eyeMuscleAreaGrade?: string;
  backFatThicknessGrade?: string;
  marblingGrade?: string;
  barnLocation?: string;
  barn?: string;
  room?: string;
  side?: string;
  slot?: number;
  memo?: string;
  status?: '사육중' | '출하완료';
  [key: string]: any; 
}

interface CompletedShippingItem extends ShippingItem {
  shippingDate: string;
  slaughterhouse: string;
  carcassWeight: number;
  settlementAmount: number;
  meatQualityGrade: string;
  meatQuantityGrade: string;
  marblingScore: string;
}

export default function ShippingManagementPage() {
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [selectedCattle, setSelectedCattle] = useState<ShippingItem | null>(null);
  const [editingCompletedId, setEditingCompletedId] = useState<string | number | null>(null);

  // 검색 및 펼치기 상태
  const [waitingSearch, setWaitingSearch] = useState('');
  const [completedSearch, setCompletedSearch] = useState('');
  const [isWaitingExpanded, setIsWaitingExpanded] = useState(true);
  const [isCompletedExpanded, setIsCompletedExpanded] = useState(true);

  const [shippingForm, setShippingForm] = useState({
    shippingDate: new Date().toISOString().split('T')[0],
    slaughterhouse: '농협음성축산물공판장',
    carcassWeight: 450,
    settlementAmount: 9000000,
    meatQualityGrade: '1++',
    meatQuantityGrade: 'A',
    marblingScore: '7',
    memo: '',
  });

  const [waitingList, setWaitingList] = useState<ShippingItem[]>([]);
  const [completedList, setCompletedList] = useState<CompletedShippingItem[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const keysToCrawl = ['allCattleList', 'cows', 'cattleList', 'cattleData'];
    let merged: ShippingItem[] = [];

    keysToCrawl.forEach(k => {
      const saved = localStorage.getItem(k);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            merged = [...merged, ...parsed];
          }
        } catch (e) {
          console.error(`Error parsing ${k}:`, e);
        }
      }
    });

    const uniqueMap = new Map();
    merged.forEach(item => {
      if (item.id) {
        uniqueMap.set(String(item.id), item);
      }
    });
    const currentList = Array.from(uniqueMap.values());

    const savedCompleted = localStorage.getItem('completedShippingDetails');
    const currentCompleted: CompletedShippingItem[] = savedCompleted ? JSON.parse(savedCompleted) : [];

    setWaitingList(currentList.filter(c => !c.status || c.status === '사육중'));
    setCompletedList(currentCompleted);
  };

  const calculateMonths = (birthDateStr?: string) => {
    if (!birthDateStr) return 0;
    const birth = new Date(birthDateStr);
    const now = new Date();
    let months = (now.getFullYear() - birth.getFullYear()) * 12;
    months -= birth.getMonth();
    months += now.getMonth();
    return Math.max(0, months);
  };

  const handleOpenModal = (item: ShippingItem) => {
    setEditingCompletedId(null);
    setSelectedCattle(item);
    setShippingForm({
      shippingDate: new Date().toISOString().split('T')[0],
      slaughterhouse: '농협음성축산물공판장',
      carcassWeight: 450,
      settlementAmount: 9000000,
      meatQualityGrade: '1++',
      meatQuantityGrade: 'A',
      marblingScore: '7',
      memo: item.memo || '',
    });
    setIsShippingModalOpen(true);
  };

  const handleOpenEditModal = (item: CompletedShippingItem) => {
    setEditingCompletedId(item.id);
    setSelectedCattle(item);
    setShippingForm({
      shippingDate: item.shippingDate,
      slaughterhouse: item.slaughterhouse,
      carcassWeight: item.carcassWeight,
      settlementAmount: item.settlementAmount,
      meatQualityGrade: item.meatQualityGrade,
      meatQuantityGrade: item.meatQuantityGrade,
      marblingScore: item.marblingScore,
      memo: item.memo || '',
    });
    setIsShippingModalOpen(true);
  };

  const handleDeleteWaiting = (id: string | number, identifier: string) => {
    if (confirm(`귀표번호 [${identifier}] 출하 대기 개체를 시스템에서 완전히 삭제하시겠습니까?`)) {
      const keysToUpdate = ['allCattleList', 'cows', 'cattleList', 'cattleData'];
      keysToUpdate.forEach(key => {
        const savedCattle = localStorage.getItem(key);
        if (savedCattle) {
          try {
            const parsed: ShippingItem[] = JSON.parse(savedCattle);
            const filtered = parsed.filter(c => String(c.id) !== String(id));
            localStorage.setItem(key, JSON.stringify(filtered));
          } catch (e) {
            console.error(e);
          }
        }
      });
      loadData();
      alert('개체가 완전히 삭제되었습니다.');
    }
  };

  const handleDeleteCompleted = (id: string | number, identifier: string) => {
    if (confirm(`귀표번호 [${identifier}] 출하 완료 정산 내역을 시스템에서 완전히 삭제하시겠습니까?`)) {
      const updatedCompleted = completedList.filter(c => String(c.id) !== String(id));
      setCompletedList(updatedCompleted);
      localStorage.setItem('completedShippingDetails', JSON.stringify(updatedCompleted));

      const keysToUpdate = ['allCattleList', 'cows', 'cattleList', 'cattleData'];
      keysToUpdate.forEach(key => {
        const savedCattle = localStorage.getItem(key);
        if (savedCattle) {
          try {
            const parsed: ShippingItem[] = JSON.parse(savedCattle);
            const filtered = parsed.filter(c => String(c.id) !== String(id));
            localStorage.setItem(key, JSON.stringify(filtered));
          } catch (e) {
            console.error(e);
          }
        }
      });

      loadData();
      alert('출하 정산 내역 및 개체 데이터가 완전히 삭제되었습니다.');
    }
  };

  const handleCompleteShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCattle) return;

    const identifier = selectedCattle.earTag || selectedCattle.number || '';

    if (editingCompletedId) {
      const updatedList = completedList.map(c => c.id === editingCompletedId ? {
        ...c,
        shippingDate: shippingForm.shippingDate,
        slaughterhouse: shippingForm.slaughterhouse,
        carcassWeight: Number(shippingForm.carcassWeight),
        settlementAmount: Number(shippingForm.settlementAmount),
        meatQualityGrade: shippingForm.meatQualityGrade,
        meatQuantityGrade: shippingForm.meatQuantityGrade,
        marblingScore: shippingForm.marblingScore,
        memo: shippingForm.memo,
      } : c);

      setCompletedList(updatedList);
      localStorage.setItem('completedShippingDetails', JSON.stringify(updatedList));
      alert('출하 정산 내역이 수정되었습니다.');
    } else {
      const completedItem: CompletedShippingItem = {
        ...selectedCattle,
        status: '출하완료',
        shippingDate: shippingForm.shippingDate,
        slaughterhouse: shippingForm.slaughterhouse,
        carcassWeight: Number(shippingForm.carcassWeight),
        settlementAmount: Number(shippingForm.settlementAmount),
        meatQualityGrade: shippingForm.meatQualityGrade,
        meatQuantityGrade: shippingForm.meatQuantityGrade,
        marblingScore: shippingForm.marblingScore,
        memo: shippingForm.memo,
      };

      const keysToUpdate = ['allCattleList', 'cows', 'cattleList', 'cattleData'];
      keysToUpdate.forEach(key => {
        const savedCattle = localStorage.getItem(key);
        if (savedCattle) {
          try {
            const parsed: ShippingItem[] = JSON.parse(savedCattle);
            const updatedCattleList = parsed.map(c => c.id === selectedCattle.id ? { ...c, status: '출하완료' as const } : c);
            localStorage.setItem(key, JSON.stringify(updatedCattleList));
          } catch (e) {
            console.error(e);
          }
        }
      });

      const newCompletedList = [completedItem, ...completedList];
      setCompletedList(newCompletedList);
      localStorage.setItem('completedShippingDetails', JSON.stringify(newCompletedList));

      const settlementSaved = localStorage.getItem('settlementList');
      const settlementList = settlementSaved ? JSON.parse(settlementSaved) : [];
      const newSettlement = {
        id: Date.now(),
        date: shippingForm.shippingDate,
        type: '수입' as const,
        category: '출하대금' as const,
        title: `한우 출하 정산 (귀표: ${identifier})`,
        client: shippingForm.slaughterhouse,
        amount: Number(shippingForm.settlementAmount),
      };
      localStorage.setItem('settlementList', JSON.stringify([newSettlement, ...settlementList]));

      loadData();
      alert('출하 등록 및 정산 연동이 완료되었습니다.');
    }

    setIsShippingModalOpen(false);
    setSelectedCattle(null);
    setEditingCompletedId(null);
  };

  // 필터링 로직
  const filteredWaitingList = waitingList.filter(item => {
    const identifier = String(item.earTag || item.number || '');
    const kpn = String(item.kpn || '');
    const farm = String(item.previousFarm || item.previousOwner || item.prevOwner || item.farm || '');
    const query = waitingSearch.trim().toLowerCase();
    return identifier.toLowerCase().includes(query) || kpn.toLowerCase().includes(query) || farm.toLowerCase().includes(query);
  });

  const filteredCompletedList = completedList.filter(item => {
    const identifier = String(item.earTag || item.number || '');
    const kpn = String(item.kpn || '');
    const slaughterhouse = String(item.slaughterhouse || '');
    const query = completedSearch.trim().toLowerCase();
    return identifier.toLowerCase().includes(query) || kpn.toLowerCase().includes(query) || slaughterhouse.toLowerCase().includes(query);
  });

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">📦 출하 관리 및 정산 목록</h1>
          <p className="text-sm text-slate-500 mt-1">개체 등록 시 입력한 상세 정보가 출하 대기 및 정산 목록에 그대로 표시됩니다.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/cattle" className="bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition">
            개체 관리로 이동
          </Link>
          <Link href="/barn" className="bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition">
            축사 관리로 이동
          </Link>
        </div>
      </div>

      {/* 출하 대기 개체 목록 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-wrap justify-between items-center bg-slate-50/50 gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-800">
              출하 대기 개체 (사육 중) - <span className="text-amber-600">{filteredWaitingList.length}</span> / {waitingList.length}두
            </span>
            <button 
              onClick={() => setIsWaitingExpanded(!isWaitingExpanded)}
              className="text-xs font-semibold px-2.5 py-1 bg-white border rounded-lg text-slate-600 hover:bg-slate-100 transition shadow-xs"
            >
              {isWaitingExpanded ? '▲ 목록 접기' : '▼ 목록 펼치기'}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="text"
              placeholder="🔍 귀표번호, KPN, 번식자 검색..."
              value={waitingSearch}
              onChange={(e) => setWaitingSearch(e.target.value)}
              className="px-3 py-1.5 text-xs border rounded-xl bg-white w-60 outline-none focus:border-amber-500 shadow-xs"
            />
          </div>
        </div>

        {isWaitingExpanded && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="text-slate-500 text-xs border-b border-slate-100 bg-slate-50">
                  <th className="p-4 font-semibold">구분 / 귀표번호 / KPN</th>
                  <th className="p-4 font-semibold">기본정보 (생년월일 / 월령 / 입식일 / 성별)</th>
                  <th className="p-4 font-semibold">번식자 / 메모</th>
                  <th className="p-4 font-semibold">유전능력 등급</th>
                  <th className="p-4 font-semibold">사육칸 위치</th>
                  <th className="p-4 font-semibold text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredWaitingList.map(item => {
                  const identifier = item.earTag || item.number || '-';
                  const autoMonths = calculateMonths(item.birthDate);
                  
                  const enterDateVal = item.entryDate || item.enterDate || item.inDate || '-';
                  const farmVal = item.previousFarm || item.previousOwner || item.prevOwner || item.farm || '자가생산';

                  const gradeObj = item.meatGrade || {};
                  const valCarcass = gradeObj.coldWeight || item.predictedCarcassWeight || item.carcassWeightGrade || '-';
                  const valEye = gradeObj.loinArea || item.eyeMuscleArea || item.eyeMuscleAreaGrade || '-';
                  const valFat = gradeObj.fatThickness || item.backFatThickness || item.backFatThicknessGrade || '-';
                  const valMarbling = gradeObj.marbling || item.marblingNumber || item.marblingGrade || '-';

                  const barnLoc = item.barnLocation || (item.barn ? `${item.barn} ${item.room || ''}`.trim() : '미지정');

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-bold text-slate-900">
                        <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded mr-1.5">{item.type || '비육우'}</span>
                        🏷️ {identifier}
                        <div className="text-[11px] font-normal text-slate-500 mt-0.5">KPN: {item.kpn || '-'}</div>
                      </td>
                      <td className="p-4 text-xs">
                        <div>생년: <span className="font-semibold">{item.birthDate || '-'} ({autoMonths > 0 ? `약 ${autoMonths}개월` : '-'})</span></div>
                        <div>입식일: <span className="text-slate-500">{enterDateVal}</span></div>
                        <div>성별: <span className="font-bold text-slate-800">{item.gender || '거세'}</span></div>
                      </td>
                      <td className="p-4 text-xs">
                        <div>번식자: <span className="font-semibold text-slate-800">{farmVal}</span></div>
                        <div className="text-slate-500 mt-0.5">메모: {item.memo || '-'}</div>
                      </td>
                      <td className="p-4 text-xs text-slate-600 bg-slate-50/50 rounded-lg">
                        <div className="font-bold text-slate-800 mb-1">유전능력 등급:</div>
                        <div>냉도체: <span className="font-bold text-emerald-700">{valCarcass}</span> | 배최장근: <span className="font-bold text-emerald-700">{valEye}</span></div>
                        <div>등지방: <span className="font-bold text-emerald-700">{valFat}</span> | 근내지방: <span className="font-bold text-emerald-700">{valMarbling}</span></div>
                      </td>
                      <td className="p-4 text-xs font-semibold text-emerald-700">
                        📍 {barnLoc}
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <button 
                          onClick={() => handleOpenModal(item)}
                          className="px-3 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition shadow-sm"
                        >
                          출하 등록
                        </button>
                        <button 
                          onClick={() => handleDeleteWaiting(item.id, identifier)}
                          className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition shadow-sm"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredWaitingList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-slate-400">조건에 일치하는 출하 대기 개체가 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 개체별 출하 정산 목록 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-wrap justify-between items-center bg-slate-50/50 gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-800">
              개체별 출하 정산 목록 (공판장 정산 완료) - <span className="text-blue-600">{filteredCompletedList.length}</span> / {completedList.length}두
            </span>
            <button 
              onClick={() => setIsCompletedExpanded(!isCompletedExpanded)}
              className="text-xs font-semibold px-2.5 py-1 bg-white border rounded-lg text-slate-600 hover:bg-slate-100 transition shadow-xs"
            >
              {isCompletedExpanded ? '▲ 목록 접기' : '▼ 목록 펼치기'}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="text"
              placeholder="🔍 귀표번호, KPN, 공판장 검색..."
              value={completedSearch}
              onChange={(e) => setCompletedSearch(e.target.value)}
              className="px-3 py-1.5 text-xs border rounded-xl bg-white w-60 outline-none focus:border-amber-500 shadow-xs"
            />
          </div>
        </div>

        {isCompletedExpanded && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="text-slate-500 text-xs border-b border-slate-100 bg-slate-50">
                  <th className="p-4 font-semibold">구분 / 귀표번호 / KPN</th>
                  <th className="p-4 font-semibold">기본정보 (생년월일 / 월령 / 입식일 / 성별)</th>
                  <th className="p-4 font-semibold">번식자 / 메모</th>
                  <th className="p-4 font-semibold">유전능력 등급</th>
                  <th className="p-4 font-semibold">출하일자 / 공판장 / 정산금액</th>
                  <th className="p-4 font-semibold">판정 등급 정보</th>
                  <th className="p-4 font-semibold text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCompletedList.map(item => {
                  const identifier = item.earTag || item.number || '-';
                  const autoMonths = calculateMonths(item.birthDate);
                  
                  const enterDateVal = item.entryDate || item.enterDate || item.inDate || '-';
                  const farmVal = item.previousFarm || item.previousOwner || item.prevOwner || item.farm || '자가생산';

                  const gradeObj = item.meatGrade || {};
                  const valCarcass = gradeObj.coldWeight || item.predictedCarcassWeight || item.carcassWeightGrade || '-';
                  const valEye = gradeObj.loinArea || item.eyeMuscleArea || item.eyeMuscleAreaGrade || '-';
                  const valFat = gradeObj.fatThickness || item.backFatThickness || item.backFatThicknessGrade || '-';
                  const valMarbling = gradeObj.marbling || item.marblingNumber || item.marblingGrade || '-';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-bold text-slate-900">
                        <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded mr-1.5">출하완료</span>
                        🏷️ {identifier}
                        <div className="text-[11px] font-normal text-slate-500 mt-0.5">KPN: {item.kpn || '-'}</div>
                      </td>
                      <td className="p-4 text-xs">
                        <div>생년: <span className="font-semibold">{item.birthDate || '-'} ({autoMonths > 0 ? `약 ${autoMonths}개월` : '-'})</span></div>
                        <div>입식일: <span className="text-slate-500">{enterDateVal}</span></div>
                        <div>성별: <span className="font-bold text-slate-800">{item.gender || '거세'}</span></div>
                      </td>
                      <td className="p-4 text-xs">
                        <div>번식자: <span className="font-semibold text-slate-800">{farmVal}</span></div>
                        <div className="text-slate-500 mt-0.5">메모: {item.memo || '-'}</div>
                      </td>
                      <td className="p-4 text-xs text-slate-600 bg-slate-50/50 rounded-lg">
                        <div className="font-bold text-slate-800 mb-1">유전능력 등급:</div>
                        <div>냉도체: <span className="font-bold text-emerald-700">{valCarcass}</span> | 배최장근: <span className="font-bold text-emerald-700">{valEye}</span></div>
                        <div>등지방: <span className="font-bold text-emerald-700">{valFat}</span> | 근내지방: <span className="font-bold text-emerald-700">{valMarbling}</span></div>
                      </td>
                      <td className="p-4 text-xs">
                        <div className="font-semibold text-amber-700">📅 {item.shippingDate}</div>
                        <div className="text-slate-500">🏢 {item.slaughterhouse}</div>
                        <div className="font-bold text-blue-600 mt-0.5">💰 {Number(item.settlementAmount).toLocaleString()}원 (도체중: {item.carcassWeight}kg)</div>
                      </td>
                      <td className="p-4 text-xs font-semibold text-indigo-700 bg-slate-50/50 rounded-lg">
                        <div>육질등급: <span className="font-bold">{item.meatQualityGrade}</span></div>
                        <div>육량등급: <span className="font-bold">{item.meatQuantityGrade}</span></div>
                        <div>근내지방도: <span className="font-bold">{item.marblingScore}</span></div>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <button 
                          onClick={() => handleOpenEditModal(item)}
                          className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition"
                        >
                          수정
                        </button>
                        <button 
                          onClick={() => handleDeleteCompleted(item.id, identifier)}
                          className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-100 transition"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredCompletedList.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-slate-400">조건에 일치하는 출하 정산 내역이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 출하 등록/수정 모달 */}
      {isShippingModalOpen && selectedCattle && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl max-w-lg w-full space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingCompletedId ? '✏️ 출하 정산 수정' : '📦 출하 및 정산 정보 등록'} ({selectedCattle.earTag || selectedCattle.number})
              </h3>
              <button onClick={() => setIsShippingModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            
            <form onSubmit={handleCompleteShipping} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">출하일자 *</label>
                  <input 
                    type="date" 
                    value={shippingForm.shippingDate}
                    onChange={(e) => setShippingForm({...shippingForm, shippingDate: e.target.value})}
                    className="w-full p-2.5 border rounded-xl text-sm outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">거래 공판장 *</label>
                  <input 
                    type="text" 
                    value={shippingForm.slaughterhouse}
                    onChange={(e) => setShippingForm({...shippingForm, slaughterhouse: e.target.value})}
                    className="w-full p-2.5 border rounded-xl text-sm outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">도체중 (kg) *</label>
                  <input 
                    type="number" 
                    value={shippingForm.carcassWeight}
                    onChange={(e) => setShippingForm({...shippingForm, carcassWeight: Number(e.target.value)})}
                    className="w-full p-2.5 border rounded-xl text-sm outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">정산 금액 (원) *</label>
                  <input 
                    type="number" 
                    value={shippingForm.settlementAmount}
                    onChange={(e) => setShippingForm({...shippingForm, settlementAmount: Number(e.target.value)})}
                    className="w-full p-2.5 border rounded-xl text-sm outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border space-y-3">
                <span className="text-xs font-bold text-slate-800">🎖️ 출하 등급 판정 결과 입력</span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">육질등급</label>
                    <select 
                      value={shippingForm.meatQualityGrade}
                      onChange={(e) => setShippingForm({...shippingForm, meatQualityGrade: e.target.value})}
                      className="w-full p-2 border rounded-lg text-xs outline-none bg-white font-bold text-slate-800"
                    >
                      <option value="1++">1++</option>
                      <option value="1+">1+</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">육량등급</label>
                    <select 
                      value={shippingForm.meatQuantityGrade}
                      onChange={(e) => setShippingForm({...shippingForm, meatQuantityGrade: e.target.value})}
                      className="w-full p-2 border rounded-lg text-xs outline-none bg-white font-bold text-slate-800"
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">근내지방도</label>
                    <select 
                      value={shippingForm.marblingScore}
                      onChange={(e) => setShippingForm({...shippingForm, marblingScore: e.target.value})}
                      className="w-full p-2 border rounded-lg text-xs outline-none bg-white font-bold text-slate-800"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <option key={num} value={String(num)}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">특이사항 메모</label>
                <input 
                  type="text" 
                  value={shippingForm.memo}
                  onChange={(e) => setShippingForm({...shippingForm, memo: e.target.value})}
                  className="w-full p-2.5 border rounded-xl text-sm outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button 
                  type="button" 
                  onClick={() => setIsShippingModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  취소
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition"
                >
                  {editingCompletedId ? '수정 완료' : '출하 정산 완료'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}