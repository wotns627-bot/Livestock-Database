'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface CattleItem {
  id: number;
  earTag: string;
  kpn: string;
  type: string;
  gender: string;
  birthDate: string;
  entryDate: string;
  previousFarm: string;
  meatGrade: {
    coldWeight: string;
    loinArea: string;
    fatThickness: string;
    marbling: string;
  };
  barnLocation: string;
  status: '사육중' | '출하완료';
}

export default function CattlePage() {
  const [activeTab, setActiveTab] = useState<'사육중' | '출하완료'>('사육중');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'ageDesc' | 'ageAsc' | 'earTag'>('latest');
  
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [excelText, setExcelText] = useState('');

  const [editingCattleId, setEditingCattleId] = useState<number | null>(null);

  const [cattleList, setCattleList] = useState<CattleItem[]>([]);
  const [allBarnLocations, setAllBarnLocations] = useState<string[]>([]);

  const loadBarnLocations = () => {
    try {
      const locations: Set<string> = new Set();
      const savedBarns = localStorage.getItem('barnsData');
      if (savedBarns) {
        const parsedBarns = JSON.parse(savedBarns);
        if (Array.isArray(parsedBarns)) {
          parsedBarns.forEach((barn: any) => {
            const barnName = barn.name || barn.barnName || '';
            const stallList = barn.stalls || barn.pens || barn.zones || barn.slots || barn.list;
            if (Array.isArray(stallList)) {
              stallList.forEach((stall: any) => {
                if (typeof stall === 'string' && stall.trim() !== '') {
                  locations.add(stall.includes(barnName) ? stall.trim() : `${barnName} ${stall.trim()}`.trim());
                } else if (stall && typeof stall === 'object') {
                  const stallName = stall.name || stall.title || stall.id || stall.label || '';
                  if (stallName) {
                    const fullName = stallName.includes(barnName) ? stallName : `${barnName} ${stallName}`;
                    locations.add(fullName.trim());
                  }
                }
              });
            }
            if (Array.isArray(barn.locations)) {
              barn.locations.forEach((loc: string) => {
                if (loc) locations.add(loc.trim());
              });
            }
          });
        }
      }

      ['barnZones', 'allBarnLocations', 'barnsList', 'barnList', 'barns', 'customBarnStructure'].forEach(key => {
        const saved = localStorage.getItem(key);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              parsed.forEach((item: any) => {
                if (typeof item === 'string' && item.trim()) locations.add(item.trim());
                else if (item && item.name) locations.add(item.name.trim());
              });
            }
          } catch (e) {}
        }
      });

      const finalLocations = Array.from(locations);
      if (finalLocations.length > 0) {
        setAllBarnLocations(finalLocations);
        return finalLocations;
      }
    } catch (e) {
      console.error('축사 칸 연동 오류:', e);
    }

    const defaultLocs = ['큰축사 좌1', '큰축사 우1', '작은축사 1'];
    setAllBarnLocations(defaultLocs);
    return defaultLocs;
  };

  const initialNewCattleState = {
    earTag: '',
    kpn: '',
    type: '비육우',
    gender: '거세',
    birthDate: '',
    entryDate: '',
    previousFarm: '',
    coldWeight: 'A',
    loinArea: 'A',
    fatThickness: 'B',
    marbling: 'A',
    barnLocation: '',
  };

  const [newCattle, setNewCattle] = useState(initialNewCattleState);
  const [editCattle, setEditCattle] = useState(initialNewCattleState);

  useEffect(() => {
    loadBarnLocations();
    const saved = localStorage.getItem('allCattleList');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const formatted = parsed.map((item: any) => ({
          ...item,
          meatGrade: typeof item.meatGrade === 'object' && item.meatGrade !== null
            ? item.meatGrade
            : { coldWeight: 'A', loinArea: 'A', fatThickness: 'B', marbling: 'A' }
        }));
        setCattleList(formatted);
      } catch (e) {
        initDefaultData();
      }
    } else {
      initDefaultData();
    }
  }, []);

  const initDefaultData = () => {
    const defaultData: CattleItem[] = [];
    setCattleList(defaultData);
    saveCattleList(defaultData);
  };

  const saveCattleList = (newList: CattleItem[]) => {
    setCattleList(newList);
    localStorage.setItem('allCattleList', JSON.stringify(newList));

    const barnMap: { [key: string]: string[] } = {};
    newList.forEach(c => {
      if (c.status === '사육중' && c.barnLocation) {
        if (!barnMap[c.barnLocation]) barnMap[c.barnLocation] = [];
        barnMap[c.barnLocation].push(c.earTag);
      }
    });
    localStorage.setItem('barnCattleMap', JSON.stringify(barnMap));
  };

  const handleRemoveDuplicates = () => {
    if (cattleList.length === 0) {
      alert('정리할 개체 데이터가 없습니다.');
      return;
    }
    const seenEarTags = new Set<string>();
    const uniqueList: CattleItem[] = [];
    let duplicateCount = 0;

    cattleList.forEach(item => {
      const cleanTag = item.earTag ? item.earTag.trim() : '';
      if (cleanTag && !seenEarTags.has(cleanTag)) {
        seenEarTags.add(cleanTag);
        uniqueList.push(item);
      } else {
        duplicateCount++;
      }
    });

    if (duplicateCount > 0) {
      saveCattleList(uniqueList);
      alert(`총 ${duplicateCount}개의 중복된 개체 데이터가 성공적으로 제거되었습니다!`);
    } else {
      alert('현재 중복 등록된 귀표번호가 없습니다.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCattle.earTag.trim()) {
      alert('귀표번호(개체번호)를 입력해주세요.');
      return;
    }

    const isDuplicate = cattleList.some(c => c.earTag.trim() === newCattle.earTag.trim());
    if (isDuplicate) {
      alert(`[귀표번호: ${newCattle.earTag.trim()}]는 이미 등록되어 있는 개체입니다.`);
      return;
    }

    const targetLocation = newCattle.barnLocation || allBarnLocations[0] || '';
    const item: CattleItem = {
      id: Date.now() + Math.random(),
      earTag: newCattle.earTag.trim(),
      kpn: newCattle.kpn.trim() || '-',
      type: newCattle.type,
      gender: newCattle.gender,
      birthDate: newCattle.birthDate || '2025-01-01',
      entryDate: newCattle.entryDate || new Date().toISOString().substring(0, 10),
      previousFarm: newCattle.previousFarm.trim() || '자가생산',
      meatGrade: {
        coldWeight: newCattle.coldWeight,
        loinArea: newCattle.loinArea,
        fatThickness: newCattle.fatThickness,
        marbling: newCattle.marbling,
      },
      barnLocation: targetLocation,
      status: '사육중',
    };

    saveCattleList([item, ...cattleList]);
    setNewCattle(initialNewCattleState);
    setIsRegisterModalOpen(false);
    alert('새 개체가 성공적으로 등록되었습니다!');
  };

  const handleExcelBulkRegister = () => {
    if (!excelText.trim()) {
      alert('등록할 데이터를 입력해주세요.');
      return;
    }

    const rows = excelText.trim().split('\n');
    let addedCount = 0;
    let skippedCount = 0;
    const newItems: CattleItem[] = [];
    const existingEarTags = new Set(cattleList.map(c => c.earTag.trim()));

    rows.forEach((row, idx) => {
      const cols = row.split(/\t|,/).map(col => col.trim());
      const firstCol = cols[0];
      if (!firstCol || firstCol.includes('사육칸') || firstCol.includes('개체번호')) return;

      const cleanEarTag = (cols[1] || cols[0] || '').trim();
      if (cleanEarTag && cleanEarTag.length >= 4) {
        if (existingEarTags.has(cleanEarTag)) {
          skippedCount++;
          return;
        }
        existingEarTags.add(cleanEarTag);

        newItems.push({
          id: Date.now() + idx + Math.random(),
          earTag: cleanEarTag,
          kpn: cols[4] || '-',
          type: '비육우',
          gender: '거세',
          birthDate: cols[3] || '2025-01-01',
          entryDate: cols[2] || new Date().toISOString().substring(0, 10),
          previousFarm: cols[9] || '자가생산',
          meatGrade: {
            coldWeight: cols[5] || 'A',
            loinArea: cols[6] || 'A',
            fatThickness: cols[7] || 'B',
            marbling: cols[8] || 'A',
          },
          barnLocation: cols[0] || allBarnLocations[0] || '',
          status: '사육중',
        });
        addedCount++;
      }
    });

    if (addedCount > 0) {
      saveCattleList([...newItems, ...cattleList]);
      setIsExcelModalOpen(false);
      setExcelText('');
      alert(`총 ${addedCount}마리가 일괄 등록되었습니다!`);
    } else {
      alert('등록할 수 있는 새로운 개체가 없습니다 (모두 중복).');
    }
  };

  const handleOpenEditModal = (cattle: CattleItem) => {
    const latestLocations = loadBarnLocations();
    setAllBarnLocations(latestLocations);
    setEditingCattleId(cattle.id);
    setEditCattle({
      earTag: cattle.earTag,
      kpn: cattle.kpn,
      type: cattle.type,
      gender: cattle.gender,
      birthDate: cattle.birthDate,
      entryDate: cattle.entryDate,
      previousFarm: cattle.previousFarm,
      coldWeight: cattle.meatGrade?.coldWeight || 'A',
      loinArea: cattle.meatGrade?.loinArea || 'A',
      fatThickness: cattle.meatGrade?.fatThickness || 'B',
      marbling: cattle.meatGrade?.marbling || 'A',
      barnLocation: cattle.barnLocation || latestLocations[0] || '',
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCattleId === null) return;

    const updated = cattleList.map(c => {
      if (c.id === editingCattleId) {
        return {
          ...c,
          earTag: editCattle.earTag.trim(),
          kpn: editCattle.kpn.trim(),
          type: editCattle.type,
          gender: editCattle.gender,
          birthDate: editCattle.birthDate,
          entryDate: editCattle.entryDate,
          previousFarm: editCattle.previousFarm.trim(),
          meatGrade: {
            coldWeight: editCattle.coldWeight,
            loinArea: editCattle.loinArea,
            fatThickness: editCattle.fatThickness,
            marbling: editCattle.marbling,
          },
          barnLocation: editCattle.barnLocation,
        };
      }
      return c;
    });

    saveCattleList(updated);
    setIsEditModalOpen(false);
    setEditingCattleId(null);
    alert('개체 정보가 수정되었습니다!');
  };

  const handleDelete = (id: number, earTag: string) => {
    if (confirm(`귀표번호 [${earTag}] 개체를 정말 삭제하시겠습니까?`)) {
      saveCattleList(cattleList.filter(c => c.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    const updated = cattleList.map(c => {
      if (c.id === id) {
        return { ...c, status: (c.status === '사육중' ? '출하완료' : '사육중') as '사육중' | '출하완료' };
      }
      return c;
    });
    saveCattleList(updated);
  };

  const calculateMonths = (birthStr: string) => {
    if (!birthStr) return 0;
    const birth = new Date(birthStr);
    const now = new Date();
    let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    return months < 0 ? 0 : months;
  };

  const calculateAge = (birthStr: string) => {
    const months = calculateMonths(birthStr);
    return `약 ${months}개월`;
  };

  // 정렬 및 필터 적용
  const filteredList = cattleList.filter(c => {
    const matchesTab = c.status === activeTab;
    const matchesSearch = c.earTag.includes(searchTerm) || c.kpn.includes(searchTerm) || (c.previousFarm && c.previousFarm.includes(searchTerm));
    return matchesTab && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'latest') {
      return b.id - a.id;
    } else if (sortBy === 'oldest') {
      return a.id - b.id;
    } else if (sortBy === 'ageDesc') {
      return calculateMonths(b.birthDate) - calculateMonths(a.birthDate);
    } else if (sortBy === 'ageAsc') {
      return calculateMonths(a.birthDate) - calculateMonths(b.birthDate);
    } else if (sortBy === 'earTag') {
      return a.earTag.localeCompare(b.earTag);
    }
    return 0;
  });

  const raisingCount = cattleList.filter(c => c.status === '사육중').length;
  const completedCount = cattleList.filter(c => c.status === '출하완료').length;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">🐄 사육 개체 관리</h1>
          <p className="text-sm text-slate-500 mt-1">축사 관리 페이지와 1:1 완벽 연동되며, 등록순 및 개월순 정렬 기능을 지원합니다.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleRemoveDuplicates}
            className="px-3.5 py-2.5 bg-amber-100 text-amber-800 rounded-xl font-bold text-xs shadow-sm hover:bg-amber-200 transition"
          >
            <span>🧹 중복 개체 정리</span>
          </button>
          <button
            onClick={() => setIsExcelModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm hover:bg-emerald-800 transition"
          >
            <span>📊 엑셀 일괄 등록</span>
          </button>
          <button
            onClick={() => {
              const latestLocations = loadBarnLocations();
              setAllBarnLocations(latestLocations);
              setNewCattle(prev => ({ ...initialNewCattleState, barnLocation: latestLocations[0] || '' }));
              setIsRegisterModalOpen(true);
            }}
            className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-sm hover:bg-emerald-700 transition"
          >
            <span>+ 새 개체 등록</span>
          </button>
          <Link href="/barn" className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200 transition">
            축사 관리로 이동 &gt;
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <button
            onClick={() => setActiveTab('사육중')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === '사육중'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            사육 중 ({raisingCount})
          </button>
          <button
            onClick={() => setActiveTab('출하완료')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === '출하완료'
                ? 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            출하 완료 ({completedCount})
          </button>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap">
          {/* 정렬 셀렉트박스 */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <span className="text-xs font-semibold text-slate-500">정렬:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="latest">최근 등록순</option>
              <option value="oldest">오래된 등록순</option>
              <option value="ageDesc">개월령 높은 순 (오래된 소)</option>
              <option value="ageAsc">개월령 낮은 순 (어린 소)</option>
              <option value="earTag">귀표번호순 (가나다)</option>
            </select>
          </div>

          <div className="w-full sm:w-72 relative">
            <input
              type="text"
              placeholder="귀표번호, KPN, 번식자 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 font-bold text-slate-800 text-sm">
          {activeTab === '사육중' ? '사육 중인 개체 목록' : '출하 완료된 개체 목록'} ({filteredList.length}두)
        </div>

        {filteredList.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            등록된 개체가 없습니다. 상단의 **+ 새 개체 등록** 또는 **📊 엑셀 일괄 등록** 버튼을 이용해 주세요.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredList.map((cattle) => (
              <div key={cattle.id} className="p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 hover:bg-slate-50/50 transition">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-base">{cattle.earTag}</span>
                    <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">KPN: {cattle.kpn}</span>
                    <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">{cattle.type} ({cattle.gender})</span>
                  </div>
                  
                  <div className="text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                    <span>생년: {cattle.birthDate} ({calculateAge(cattle.birthDate)})</span>
                    <span>입식일: {cattle.entryDate}</span>
                  </div>

                  <div className="text-xs font-medium text-emerald-700 bg-emerald-50/60 border border-emerald-100 px-2.5 py-1 rounded-lg inline-block">
                    📍 번식자: {cattle.previousFarm || '자가생산'} | 🏠 사육칸: <strong className="text-slate-900">{cattle.barnLocation || '미지정'}</strong>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                  <div className="text-xs text-slate-600 space-y-0.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="font-semibold text-slate-700">유전능력 등급:</div>
                    <div>
                      냉도체: <span className="font-bold text-emerald-600">{cattle.meatGrade?.coldWeight || 'A'}</span> |
                      배최장근: <span className="font-bold text-emerald-600">{cattle.meatGrade?.loinArea || 'A'}</span> |
                      등지방: <span className="font-bold text-emerald-600">{cattle.meatGrade?.fatThickness || 'B'}</span> |
                      근내지방: <span className="font-bold text-emerald-600">{cattle.meatGrade?.marbling || 'A'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(cattle.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        cattle.status === '사육중'
                          ? 'bg-amber-500 text-white hover:bg-amber-600'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {cattle.status === '사육중' ? '출하 처리' : '사육 복원'}
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(cattle)}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(cattle.id, cattle.earTag)}
                      className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isExcelModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">📊 엑셀 데이터 일괄 등록</h2>
              <button onClick={() => setIsExcelModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">×</button>
            </div>
            <textarea
              rows={8}
              placeholder="엑셀 표를 그대로 복사해서 붙여넣으세요"
              value={excelText}
              onChange={(e) => setExcelText(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-500"
            />
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button type="button" onClick={() => setIsExcelModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs">취소</button>
              <button type="button" onClick={handleExcelBulkRegister} className="px-4 py-2 bg-emerald-700 text-white rounded-xl font-bold text-xs">일괄 등록하기</button>
            </div>
          </div>
        </div>
      )}

      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">🐮 새로운 한우 개체 등록</h2>
              <button onClick={() => setIsRegisterModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">×</button>
            </div>
            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">개체번호(귀표번호)</label>
                <input
                  type="text"
                  value={newCattle.earTag}
                  onChange={(e) => setNewCattle({...newCattle, earTag: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">KPN 번호</label>
                <input
                  type="text"
                  value={newCattle.kpn}
                  onChange={(e) => setNewCattle({...newCattle, kpn: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">축종</label>
                  <select
                    value={newCattle.type}
                    onChange={(e) => setNewCattle({...newCattle, type: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="비육우">비육우</option>
                    <option value="번식암소">번식암소</option>
                    <option value="송아지">송아지</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">성별</label>
                  <select
                    value={newCattle.gender}
                    onChange={(e) => setNewCattle({...newCattle, gender: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="거세">거세</option>
                    <option value="암소">암소</option>
                    <option value="수소">수소</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">생년월일</label>
                  <input
                    type="date"
                    value={newCattle.birthDate}
                    onChange={(e) => setNewCattle({...newCattle, birthDate: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">입식일</label>
                  <input
                    type="date"
                    value={newCattle.entryDate}
                    onChange={(e) => setNewCattle({...newCattle, entryDate: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">번식자 / 이전 농장</label>
                <input
                  type="text"
                  value={newCattle.previousFarm}
                  onChange={(e) => setNewCattle({...newCattle, previousFarm: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="예: 자가생산 또는 농장명"
                />
              </div>
              <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200 space-y-1">
                <label className="block font-bold text-amber-900">🏠 사육칸 선택</label>
                <select
                  value={newCattle.barnLocation}
                  onChange={(e) => setNewCattle({...newCattle, barnLocation: e.target.value})}
                  className="w-full p-2.5 bg-white border border-amber-300 rounded-xl font-bold text-amber-900"
                >
                  <option value="">-- 사육칸을 선택하세요 --</option>
                  {allBarnLocations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* 유전능력 등급 입력 영역 유지 */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block font-semibold text-slate-700">유전능력 등급</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">냉도체중</span>
                    <input
                      type="text"
                      value={newCattle.coldWeight}
                      onChange={(e) => setNewCattle({...newCattle, coldWeight: e.target.value})}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">배최장근단면적</span>
                    <input
                      type="text"
                      value={newCattle.loinArea}
                      onChange={(e) => setNewCattle({...newCattle, loinArea: e.target.value})}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">등지방두께</span>
                    <input
                      type="text"
                      value={newCattle.fatThickness}
                      onChange={(e) => setNewCattle({...newCattle, fatThickness: e.target.value})}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">근내지방도</span>
                    <input
                      type="text"
                      value={newCattle.marbling}
                      onChange={(e) => setNewCattle({...newCattle, marbling: e.target.value})}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsRegisterModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold">취소</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold">등록 완료</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">✏️ 한우 개체 정보 수정</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">×</button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">개체번호(귀표번호)</label>
                <input
                  type="text"
                  value={editCattle.earTag}
                  onChange={(e) => setEditCattle({...editCattle, earTag: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">KPN 번호</label>
                <input
                  type="text"
                  value={editCattle.kpn}
                  onChange={(e) => setEditCattle({...editCattle, kpn: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">축종</label>
                  <select
                    value={editCattle.type}
                    onChange={(e) => setEditCattle({...editCattle, type: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="비육우">비육우</option>
                    <option value="번식암소">번식암소</option>
                    <option value="송아지">송아지</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">성별</label>
                  <select
                    value={editCattle.gender}
                    onChange={(e) => setEditCattle({...editCattle, gender: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="거세">거세</option>
                    <option value="암소">암소</option>
                    <option value="수소">수소</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">생년월일</label>
                  <input
                    type="date"
                    value={editCattle.birthDate}
                    onChange={(e) => setEditCattle({...editCattle, birthDate: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">입식일</label>
                  <input
                    type="date"
                    value={editCattle.entryDate}
                    onChange={(e) => setEditCattle({...editCattle, entryDate: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">번식자 / 이전 농장</label>
                <input
                  type="text"
                  value={editCattle.previousFarm}
                  onChange={(e) => setEditCattle({...editCattle, previousFarm: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200 space-y-1">
                <label className="block font-bold text-amber-900">🏠 사육칸 선택</label>
                <select
                  value={editCattle.barnLocation}
                  onChange={(e) => setEditCattle({...editCattle, barnLocation: e.target.value})}
                  className="w-full p-2.5 bg-white border border-amber-300 rounded-xl font-bold text-amber-900"
                >
                  <option value="">-- 사육칸을 선택하세요 --</option>
                  {allBarnLocations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* 유전능력 등급 수정 영역 유지 */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block font-semibold text-slate-700">유전능력 등급</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">냉도체중</span>
                    <input
                      type="text"
                      value={editCattle.coldWeight}
                      onChange={(e) => setEditCattle({...editCattle, coldWeight: e.target.value})}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">배최장근단면적</span>
                    <input
                      type="text"
                      value={editCattle.loinArea}
                      onChange={(e) => setEditCattle({...editCattle, loinArea: e.target.value})}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">등지방두께</span>
                    <input
                      type="text"
                      value={editCattle.fatThickness}
                      onChange={(e) => setEditCattle({...editCattle, fatThickness: e.target.value})}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">근내지방도</span>
                    <input
                      type="text"
                      value={editCattle.marbling}
                      onChange={(e) => setEditCattle({...editCattle, marbling: e.target.value})}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold">취소</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold">수정 완료</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}