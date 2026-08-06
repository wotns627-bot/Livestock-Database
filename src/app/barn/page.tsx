// src/app/barn/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface CattleItem {
  id: number;
  earTag: string;
  kpn?: string;
  type?: string;
  gender?: string;
  birthDate?: string;
  entryDate?: string;
  previousFarm?: string;
  memo?: string;
  meatGrade?: {
    coldWeight: string;
    loinArea: string;
    fatThickness: string;
    marbling: string;
  };
  barnLocation: string;
  status: '사육중' | '출하완료';
  [key: string]: any;
}

const INITIAL_BARNS = [
  { name: '큰축사', zones: [...Array.from({ length: 15 }, (_, i) => `큰축사 좌${i + 1}`), ...Array.from({ length: 15 }, (_, i) => `큰축사 우${i + 1}`)] },
  { name: '작은축사', zones: [...Array.from({ length: 8 }, (_, i) => `작은축사 우${i + 1}`)] }
];

export default function BarnPage() {
  const [cattleList, setCattleList] = useState<CattleItem[]>([]);
  const [barnCattleMap, setBarnCattleMap] = useState<{ [key: string]: CattleItem[] }>({});
  const [barns, setBarns] = useState<{ name: string; zones: string[] }[]>(INITIAL_BARNS);

  const [newBarnName, setNewBarnName] = useState('');
  const [selectedBarnForZone, setSelectedBarnForZone] = useState('큰축사');
  const [zonePrefix, setZonePrefix] = useState<'좌' | '우' | '일반'>('좌');
  const [zoneNumberInput, setZoneNumberInput] = useState('');

  const [selectedCellInfo, setSelectedCellInfo] = useState<{ zoneName: string; occupants: CattleItem[] } | null>(null);
  
  // 검색 및 설정/백업 모달
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 개체별 메모 편집 상태 관리
  const [editingMemoId, setEditingMemoId] = useState<number | null>(null);
  const [memoText, setMemoText] = useState('');

  // 🌙 다크 모드 상태 관리
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadData();
    const savedDarkMode = localStorage.getItem('smartFarmDarkMode');
    if (savedDarkMode === 'true') {
      setIsDarkMode(true);
    }
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const toggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    localStorage.setItem('smartFarmDarkMode', String(nextMode));
  };

  const loadData = () => {
    const savedBarns = localStorage.getItem('customBarnStructure');
    if (savedBarns) {
      try {
        const parsed = JSON.parse(savedBarns);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBarns(parsed);
          if (!parsed.some(b => b.name === selectedBarnForZone)) {
            setSelectedBarnForZone(parsed[0].name);
          }
        }
      } catch (e) {
        console.error('축사 구조 파싱 오류:', e);
      }
    } else {
      localStorage.setItem('customBarnStructure', JSON.stringify(INITIAL_BARNS));
    }

    const savedCattle = localStorage.getItem('allCattleList');
    if (savedCattle) {
      try {
        const parsed = JSON.parse(savedCattle);
        setCattleList(parsed);

        const map: { [key: string]: CattleItem[] } = {};
        parsed.forEach((c: CattleItem) => {
          if (c.status === '사육중' && c.barnLocation) {
            if (!map[c.barnLocation]) {
              map[c.barnLocation] = [];
            }
            map[c.barnLocation].push(c);
          }
        });
        setBarnCattleMap(map);

        if (selectedCellInfo) {
          const updatedOccupants = parsed.filter((c: CattleItem) => c.status === '사육중' && c.barnLocation === selectedCellInfo.zoneName);
          setSelectedCellInfo({ zoneName: selectedCellInfo.zoneName, occupants: updatedOccupants });
        }
      } catch (e) {
        console.error('개체 데이터 로드 오류:', e);
      }
    }
  };

  const saveBarnsToStorage = (updatedBarns: { name: string; zones: string[] }[]) => {
    setBarns(updatedBarns);
    localStorage.setItem('customBarnStructure', JSON.stringify(updatedBarns));

    const allZonesFlattened = updatedBarns.flatMap(b => b.zones);
    localStorage.setItem('barnZones', JSON.stringify(allZonesFlattened));
    localStorage.setItem('allBarnLocations', JSON.stringify(allZonesFlattened));
  };

  const calculateAgeMonths = (birthStr?: string) => {
    if (!birthStr) return 0;
    const birth = new Date(birthStr);
    const now = new Date();
    let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    if (months < 0) months = 0;
    return months;
  };

  const formatAgeText = (birthStr?: string) => {
    const months = calculateAgeMonths(birthStr);
    if (!birthStr) return '?개월';
    return `${months}개월`;
  };

  // 📊 대시보드 통계 계산
  const totalZonesCount = barns.reduce((acc, b) => acc + b.zones.length, 0);
  const activeCattleList = cattleList.filter(c => c.status === '사육중');
  const activeCattleCount = activeCattleList.length;
  const emptyZonesCount = totalZonesCount - Object.keys(barnCattleMap).filter(z => barnCattleMap[z]?.length > 0).length;

  // 📊 월령별 분포 통계 계산 (0~6, 6~12, 12~24, 24개월 이상)
  const ageDistribution = activeCattleList.reduce((acc, c) => {
    const m = calculateAgeMonths(c.birthDate);
    if (!c.birthDate) acc.unknown += 1;
    else if (m <= 6) acc.range0_6 += 1;
    else if (m <= 12) acc.range6_12 += 1;
    else if (m <= 24) acc.range12_24 += 1;
    else acc.range24_over += 1;
    return acc;
  }, { range0_6: 0, range6_12: 0, range12_24: 0, range24_over: 0, unknown: 0 });

  const handleAddBarn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBarnName.trim()) {
      alert('추가할 축사 이름을 입력해주세요.');
      return;
    }
    if (barns.some(b => b.name === newBarnName.trim())) {
      alert('이미 존재하는 축사 이름입니다.');
      return;
    }

    const updated = [...barns, { name: newBarnName.trim(), zones: [] }];
    saveBarnsToStorage(updated);
    setSelectedBarnForZone(newBarnName.trim());
    setNewBarnName('');
    alert(`[${newBarnName.trim()}] 축사가 생성되었습니다.`);
  };

  const handleDeleteBarn = (barnName: string) => {
    const targetBarn = barns.find(b => b.name === barnName);
    if (!targetBarn) return;

    const hasCattle = targetBarn.zones.some(z => barnCattleMap[z] && barnCattleMap[z].length > 0);
    if (hasCattle) {
      alert('이 축사 내에 사육 중인 개체가 있어 삭제할 수 없습니다.');
      return;
    }

    if (confirm(`[${barnName}] 축사를 삭제하시겠습니까?`)) {
      const updated = barns.filter(b => b.name !== barnName);
      saveBarnsToStorage(updated);
    }
  };

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoneNumberInput.trim()) {
      alert('칸 번호나 이름을 입력해주세요.');
      return;
    }

    const barnIndex = barns.findIndex(b => b.name === selectedBarnForZone);
    if (barnIndex === -1) return;

    const prefixStr = zonePrefix === '일반' ? '' : zonePrefix;
    const fullName = `${selectedBarnForZone} ${prefixStr}${zoneNumberInput.trim()}`;

    const allZones = barns.flatMap(b => b.zones);
    if (allZones.includes(fullName)) {
      alert('이미 존재하는 칸 이름입니다.');
      return;
    }

    const updatedBarns = [...barns];
    updatedBarns[barnIndex].zones.push(fullName);
    saveBarnsToStorage(updatedBarns);
    setZoneNumberInput('');
  };

  const handleDeleteZone = (barnName: string, zoneName: string) => {
    if (barnCattleMap[zoneName] && barnCattleMap[zoneName].length > 0) {
      alert('해당 칸에 사육 중인 개체가 있어 삭제할 수 없습니다.');
      return;
    }

    if (confirm(`[${zoneName}] 칸을 삭제하시겠습니까?`)) {
      const updatedBarns = barns.map(b => {
        if (b.name === barnName) {
          return { ...b, zones: b.zones.filter(z => z !== zoneName) };
        }
        return b;
      });
      saveBarnsToStorage(updatedBarns);
    }
  };

  const handleSaveMemo = (cattleId: number) => {
    const updatedList = cattleList.map(c => {
      if (c.id === cattleId) {
        return { ...c, memo: memoText };
      }
      return c;
    });

    setCattleList(updatedList);
    localStorage.setItem('allCattleList', JSON.stringify(updatedList));
    setEditingMemoId(null);
    setMemoText('');
    loadData();
    alert('메모가 저장되었습니다.');
  };

  const handleBackupData = () => {
    const backupData = {
      version: '1.2',
      date: new Date().toISOString(),
      customBarnStructure: localStorage.getItem('customBarnStructure'),
      allCattleList: localStorage.getItem('allCattleList'),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-barn-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestoreData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.customBarnStructure && parsed.allCattleList) {
          if (confirm('백업 파일을 불러오면 현재 입력된 데이터가 덮어씌워집니다. 진행하시겠습니까?')) {
            localStorage.setItem('customBarnStructure', parsed.customBarnStructure);
            localStorage.setItem('allCattleList', parsed.allCattleList);
            loadData();
            alert('데이터가 성공적으로 복원되었습니다.');
            setIsSettingsOpen(false);
          }
        } else {
          alert('올바른 백업 파일 형식이 아닙니다.');
        }
      } catch (err) {
        alert('파일을 읽는 중 오류가 발생했습니다.');
      }
    };
    reader.readAsText(file);
  };

  const handleExportCSV = () => {
    if (cattleList.length === 0) {
      alert('내보낼 개체 데이터가 없습니다.');
      return;
    }

    const headers = ['ID', '귀표번호', 'KPN', '종류', '성별', '생년월일', '입식일', '이전농장', '축사위치', '상태', '메모'];
    const rows = cattleList.map(c => [
      c.id,
      `"${c.earTag || ''}"`,
      `"${c.kpn || ''}"`,
      `"${c.type || ''}"`,
      `"${c.gender || ''}"`,
      `"${c.birthDate || ''}"`,
      `"${c.entryDate || ''}"`,
      `"${c.previousFarm || ''}"`,
      `"${c.barnLocation || ''}"`,
      `"${c.status || ''}"`,
      `"${(c.memo || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cattle-list-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderCell = (barnName: string, locationName: string) => {
    const occupants = barnCattleMap[locationName] || [];
    
    const filteredOccupants = searchQuery.trim() 
      ? occupants.filter(c => c.earTag.includes(searchQuery.trim()))
      : occupants;

    const isEmpty = occupants.length === 0;
    const isSearchMatched = searchQuery.trim() && filteredOccupants.length > 0;
    const displayName = locationName.replace(`${barnName} `, '');

    const openCellModal = () => {
      setSelectedCellInfo({ zoneName: locationName, occupants });
    };

    return (
      <div 
        key={locationName}
        onClick={openCellModal}
        onTouchEnd={(e) => {
          e.preventDefault();
          openCellModal();
        }}
        style={{ touchAction: 'manipulation' }}
        className={`flex flex-col p-3 rounded-2xl border transition-all h-full min-h-[140px] relative group cursor-pointer ${
          isEmpty 
            ? isDarkMode 
              ? 'bg-slate-800/40 border-slate-700 border-dashed hover:bg-slate-800' 
              : 'bg-slate-50 border-slate-200 border-dashed hover:bg-slate-100'
            : isSearchMatched 
              ? 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-400 shadow-md' 
              : isDarkMode 
                ? 'bg-slate-800 border-emerald-600/60 shadow-sm overflow-hidden hover:border-emerald-500' 
                : 'bg-white border-emerald-500 shadow-sm overflow-hidden hover:shadow-md'
        }`}
      >
        <div className={`text-xs font-bold mb-2 w-full flex justify-between items-center px-3 py-1.5 rounded-lg transition-colors ${
          isEmpty 
            ? isDarkMode ? 'text-slate-400 bg-slate-800 border border-slate-700' : 'text-slate-400 bg-white shadow-sm border border-slate-100' 
            : 'text-white bg-emerald-600'
        }`}>
          <span>{displayName}</span>
          <div className="flex items-center gap-2">
            {!isEmpty && <span className="bg-emerald-800 text-white text-[10px] px-1.5 py-0.5 rounded-full">{occupants.length}두</span>}
            {isEmpty && (
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); handleDeleteZone(barnName, locationName); }}
                onTouchEnd={(e) => { e.stopPropagation(); handleDeleteZone(barnName, locationName); }}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition"
                title="칸 삭제"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {isEmpty ? (
           <div className="flex flex-col items-center justify-center flex-1 space-y-1">
             <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>공실</span>
             <span className={`text-[10px] ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>비어있음</span>
           </div>
        ) : (
          <div className="space-y-1.5 w-full flex-1 flex flex-col justify-start">
            {occupants.map(cattle => {
              const matchesSearch = searchQuery.trim() && cattle.earTag.includes(searchQuery.trim());
              return (
                <div 
                  key={cattle.id} 
                  className={`flex justify-between items-center px-2 py-1 rounded-lg border transition ${
                    matchesSearch 
                      ? 'bg-amber-400 border-amber-500 text-slate-950 font-extrabold' 
                      : isDarkMode 
                        ? 'bg-slate-700/80 border-slate-600 text-slate-200' 
                        : 'bg-slate-50 border-slate-100 text-slate-900'
                  }`}
                >
                  <span className="text-xs tracking-tight flex items-center gap-1">
                    🏷️ {cattle.earTag}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    isDarkMode ? 'bg-slate-800 text-slate-300 border border-slate-600' : 'bg-white/80 text-slate-700 border border-slate-200/60'
                  }`}>
                    {formatAgeText(cattle.birthDate)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen p-8 space-y-8 max-w-7xl mx-auto w-full transition-colors duration-200 ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50/50 text-slate-900'}`} style={{ touchAction: 'manipulation' }}>
      
      {/* 상단 헤더 영역 */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl shadow-sm border gap-4 transition-colors ${
        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-1 rounded-md">OFFICIAL SMART FARM</span>
            <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>Ver 1.2</span>
          </div>
          <h1 className={`text-2xl font-black mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>🏠 스마트 축사 종합 관제 시스템</h1>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>실시간 사육 현황 모니터링 및 구역별 개체 관리</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* 다크 모드 토글 버튼 */}
          <button 
            type="button"
            onClick={toggleDarkMode}
            className={`px-3.5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 border ${
              isDarkMode 
                ? 'bg-slate-700 hover:bg-slate-600 text-amber-400 border-slate-600' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title="다크 모드 토글"
          >
            {isDarkMode ? '☀️ 주간 모드' : '🌙 야간 모드'}
          </button>

          <button 
            type="button"
            onClick={handleExportCSV}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 border ${
              isDarkMode 
                ? 'bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-300 border-emerald-700' 
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
            }`}
          >
            📊 엑셀 다운로드
          </button>
          
          <button 
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 border ${
              isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            ⚙️ 데이터 관리
          </button>
          
          <Link href="/cattle" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-emerald-700 transition">
            개체 관리 &gt;
          </Link>
        </div>
      </div>

      {/* 요약 카드 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-5 rounded-2xl shadow-sm border flex items-center gap-4 transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-black">🐄</div>
          <div>
            <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>현재 사육 두수</p>
            <p className={`text-xl font-extrabold mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activeCattleCount} <span className={`text-xs font-normal ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>두</span></p>
          </div>
        </div>

        <div className={`p-5 rounded-2xl shadow-sm border flex items-center gap-4 transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-black">🏠</div>
          <div>
            <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>총 축사 칸 수</p>
            <p className={`text-xl font-extrabold mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{totalZonesCount} <span className={`text-xs font-normal ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>칸</span></p>
          </div>
        </div>

        <div className={`p-5 rounded-2xl shadow-sm border flex items-center gap-4 transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-black">✨</div>
          <div>
            <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>비어있는 공실</p>
            <p className={`text-xl font-extrabold mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{emptyZonesCount} <span className={`text-xs font-normal ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>칸</span></p>
          </div>
        </div>

        <div className={`p-5 rounded-2xl shadow-sm border flex items-center gap-4 transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-black">📋</div>
          <div>
            <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>등록된 축사 건물</p>
            <p className={`text-xl font-extrabold mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{barns.length} <span className={`text-xs font-normal ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>동</span></p>
          </div>
        </div>
      </div>

      {/* 📊 월령별 분포 통계 위젯 */}
      <div className={`p-6 rounded-2xl shadow-sm border space-y-4 transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className="flex justify-between items-center">
          <h2 className={`text-sm font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <span>📊</span> 농장 내 사육 개체 월령(연령) 분포 통계
          </h2>
          <span className="text-xs text-emerald-600 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-md">실시간 분석</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[11px] text-slate-400 font-bold">🌱 0~6개월 (송아지)</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className={`text-xl font-black ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{ageDistribution.range0_6}</span>
              <span className="text-xs text-slate-400">두</span>
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[11px] text-slate-400 font-bold">🌿 7~12개월 (육성기)</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className={`text-xl font-black ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{ageDistribution.range6_12}</span>
              <span className="text-xs text-slate-400">두</span>
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[11px] text-slate-400 font-bold">🐂 13~24개월 (비육기)</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className={`text-xl font-black ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>{ageDistribution.range12_24}</span>
              <span className="text-xs text-slate-400">두</span>
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[11px] text-slate-400 font-bold">🏆 24개월 이상 (성축/출하대기)</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className={`text-xl font-black ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>{ageDistribution.range24_over}</span>
              <span className="text-xs text-slate-400">두</span>
            </div>
          </div>
        </div>
      </div>

      {/* 검색 바 */}
      <div className={`p-4 rounded-2xl shadow-sm border flex items-center gap-3 transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        <span className="text-slate-400 pl-2">🔍</span>
        <input 
          type="text" 
          placeholder="귀표번호로 축사 내 개체 실시간 찾기 (예: 1234)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`flex-1 bg-transparent text-sm focus:outline-none placeholder:text-slate-400 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
        />
        {searchQuery && (
          <button 
            type="button" 
            onClick={() => setSearchQuery('')}
            className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
          >
            검색 초기화
          </button>
        )}
      </div>

      {/* 빌드 및 칸 추가 입력폼 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-2xl shadow-sm border space-y-4 transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
          <h2 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>➕ 새로운 축사 건물 만들기</h2>
          <form onSubmit={handleAddBarn} className="flex gap-2">
            <input 
              type="text" 
              placeholder="축사 이름 (예: 육성사)"
              value={newBarnName}
              onChange={(e) => setNewBarnName(e.target.value)}
              className={`flex-1 p-2.5 border rounded-xl text-xs focus:outline-none focus:border-emerald-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
            />
            <button type="submit" className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition">
              건물 추가
            </button>
          </form>
        </div>

        <div className={`p-6 rounded-2xl shadow-sm border space-y-4 transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
          <h2 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>➕ 특정 축사에 칸 추가하기</h2>
          <form onSubmit={handleAddZone} className="flex flex-wrap gap-2">
            <select 
              value={selectedBarnForZone}
              onChange={(e) => setSelectedBarnForZone(e.target.value)}
              className={`p-2.5 border rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
            >
              {barns.map(b => (
                <option key={b.name} value={b.name}>{b.name}</option>
              ))}
            </select>

            <select 
              value={zonePrefix}
              onChange={(e: any) => setZonePrefix(e.target.value)}
              className={`p-2.5 border rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
            >
              <option value="좌">좌측</option>
              <option value="우">우측</option>
              <option value="일반">구분없음</option>
            </select>

            <input 
              type="text" 
              placeholder="번호 (예: 16)"
              value={zoneNumberInput}
              onChange={(e) => setZoneNumberInput(e.target.value)}
              className={`w-20 p-2.5 border rounded-xl text-xs focus:outline-none focus:border-emerald-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
            />

            <button type="submit" className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition">
              칸 추가
            </button>
          </form>
        </div>
      </div>

      {/* 축사 구역 리스트 */}
      <div className="space-y-6">
        {barns.map((barn) => (
          <div key={barn.name} className={`p-6 rounded-2xl shadow-sm border space-y-4 transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className={`flex justify-between items-center border-b pb-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
              <div>
                <h2 className={`text-xl font-extrabold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                  {barn.name}
                </h2>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>총 {barn.zones.length}칸 등록됨</p>
              </div>
              {barn.zones.length === 0 && (
                <button 
                  type="button"
                  onClick={() => handleDeleteBarn(barn.name)}
                  onTouchEnd={() => handleDeleteBarn(barn.name)}
                  className="text-xs text-rose-500 font-bold hover:underline bg-rose-500/10 px-3 py-1.5 rounded-lg"
                >
                  축사 건물 삭제
                </button>
              )}
            </div>

            {barn.zones.length === 0 ? (
              <div className={`py-12 text-center text-sm rounded-xl border border-dashed ${isDarkMode ? 'bg-slate-900/50 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                등록된 칸이 없습니다. 상단에서 칸을 추가해주세요.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {barn.zones.map((zoneName) => renderCell(barn.name, zoneName))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ⚙️ 설정 및 백업/복원 모달 */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl shadow-xl max-w-md w-full p-6 space-y-6 border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-100 text-slate-900'}`}>
            <div className={`flex justify-between items-center border-b pb-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
              <h2 className="text-base font-bold">⚙️ 데이터 백업 및 복원 관리</h2>
              <button 
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="text-slate-400 hover:text-slate-200 font-bold text-2xl px-2"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className={`p-4 rounded-xl border space-y-2 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className="text-xs font-bold">💾 데이터 파일로 백업하기 (내보내기)</h3>
                <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>현재 축사 구조와 모든 개체 정보를 파일로 안전하게 다운로드합니다.</p>
                <button 
                  type="button"
                  onClick={handleBackupData}
                  className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  백업 파일 다운로드 (.json)
                </button>
              </div>

              <div className={`p-4 rounded-xl border space-y-2 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className="text-xs font-bold">📂 데이터 파일 불러오기 (복원)</h3>
                <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>이전에 백업해 둔 JSON 파일을 선택하여 데이터를 복구합니다.</p>
                <label className="block w-full mt-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-center rounded-xl text-xs font-bold transition shadow-sm cursor-pointer border border-slate-700">
                  백업 파일 선택하여 복원하기
                  <input type="file" accept=".json" onChange={handleRestoreData} className="hidden" />
                </label>
              </div>
            </div>

            <div className={`flex justify-end pt-3 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
              <button 
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 칸 클릭 시 상세 모달 */}
      {selectedCellInfo && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-5 border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-100 text-slate-900'}`}>
            <div className={`flex justify-between items-center border-b pb-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
              <div>
                <h2 className="text-base font-bold">🏠 [{selectedCellInfo.zoneName}] 상세 현황</h2>
                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>현재 사육 두수: <strong className="text-emerald-500">{selectedCellInfo.occupants.length}두</strong></p>
              </div>
              <button 
                type="button"
                onClick={() => setSelectedCellInfo(null)}
                onTouchEnd={() => setSelectedCellInfo(null)}
                className="text-slate-400 hover:text-slate-200 font-bold text-2xl px-2"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {selectedCellInfo.occupants.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-sm">
                  현재 이 칸은 비어 있는 공실입니다.
                </div>
              ) : (
                selectedCellInfo.occupants.map((cattle) => {
                  const isEditing = editingMemoId === cattle.id;
                  return (
                    <div key={cattle.id} className={`p-4 rounded-xl border space-y-3 text-xs shadow-sm ${isDarkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-sm flex items-center gap-1">
                          <span className="text-lg">🐄</span> 귀표번호: {cattle.earTag}
                        </span>
                        <span className="bg-emerald-500/20 text-emerald-400 font-bold px-2 py-1 rounded-md">{cattle.type || '비육우'}({cattle.gender || '-'})</span>
                      </div>
                      
                      <div className={`grid grid-cols-2 gap-3 p-3 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-600'}`}>
                        <div>KPN: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{cattle.kpn || '-'}</strong></div>
                        <div>생년월일: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{cattle.birthDate || '-'} <span className="text-emerald-500">({formatAgeText(cattle.birthDate)})</span></strong></div>
                        <div>입식일: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{cattle.entryDate || '-'}</strong></div>
                        <div>이전농장: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{cattle.previousFarm || '자가생산'}</strong></div>
                      </div>

                      {/* 메모 영역 */}
                      <div className={`p-3 rounded-lg border space-y-2 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                        <div className="flex justify-between items-center">
                          <span className={`font-bold flex items-center gap-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>📌 특이사항 및 메모</span>
                          {!isEditing && (
                            <button 
                              type="button"
                              onClick={() => { setEditingMemoId(cattle.id); setMemoText(cattle.memo || ''); }}
                              className="text-[11px] text-emerald-500 font-bold hover:underline"
                            >
                              {cattle.memo ? '메모 수정' : '+ 메모 추가'}
                            </button>
                          )}
                        </div>

                        {isEditing ? (
                          <div className="space-y-2 pt-1">
                            <textarea 
                              rows={2}
                              value={memoText}
                              onChange={(e) => setMemoText(e.target.value)}
                              placeholder="예: 3월 백신 접종 완료, 발정 주기 관찰 필요 등"
                              className={`w-full p-2 border rounded-lg text-xs focus:outline-none focus:border-emerald-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                            />
                            <div className="flex justify-end gap-1.5">
                              <button 
                                type="button"
                                onClick={() => setEditingMemoId(null)}
                                className={`px-3 py-1 rounded-md font-bold text-[11px] ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                              >
                                취소
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleSaveMemo(cattle.id)}
                                className="px-3 py-1 bg-emerald-600 text-white rounded-md font-bold text-[11px]"
                              >
                                메모 저장
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className={`text-xs whitespace-pre-wrap ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            {cattle.memo ? cattle.memo : <span className="text-slate-500 italic">등록된 메모가 없습니다.</span>}
                          </p>
                        )}
                      </div>

                      {cattle.meatGrade && (cattle.meatGrade.coldWeight || cattle.meatGrade.marbling) && (
                        <div className={`pt-2 border-t grid grid-cols-4 gap-1 text-center p-2 rounded-lg ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                          <div className="flex flex-col"><span className="text-[9px] text-slate-400">도체중</span><span className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{cattle.meatGrade.coldWeight || '-'}</span></div>
                          <div className="flex flex-col"><span className="text-[9px] text-slate-400">배최장근</span><span className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{cattle.meatGrade.loinArea || '-'}</span></div>
                          <div className="flex flex-col"><span className="text-[9px] text-slate-400">등지방</span><span className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{cattle.meatGrade.fatThickness || '-'}</span></div>
                          <div className="flex flex-col"><span className="text-[9px] text-slate-400">근내지방</span><span className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{cattle.meatGrade.marbling || '-'}</span></div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className={`flex justify-end pt-3 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
              <button 
                type="button"
                onClick={() => setSelectedCellInfo(null)}
                onTouchEnd={() => setSelectedCellInfo(null)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition shadow-md border border-slate-700"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}