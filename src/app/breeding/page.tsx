'use client';

import React, { useState, useEffect } from 'react';

interface BreedingRecord {
  id: string;
  earTag: string;
  stage: '인공수정' | '임신감정' | '분만예정' | '분만완료';
  date: string;
  semenNo: string;
  expectedDate: string;
  status: string;
  note?: string;
}

export default function BreedingPage() {
  const [activeTab, setActiveTab] = useState<'인공수정' | '임신감정' | '분만완료'>('인공수정');
  const [targetCattle, setTargetCattle] = useState('0015');
  const [workDate, setWorkDate] = useState('2026-07-22');
  const [semenNo, setSemenNo] = useState('');
  const [note, setNote] = useState('');

  const [searchCategory, setSearchCategory] = useState('구분 (전체)');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');

  const [breedingList, setBreedingList] = useState<BreedingRecord[]>([]);

  // 수정 모달 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    earTag: '',
    stage: '인공수정' as '인공수정' | '임신감정' | '분만예정' | '분만완료',
    date: '',
    semenNo: '',
    expectedDate: '',
    status: '',
    note: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('breedingRecords');
    
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setBreedingList(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      // 최초 실행 시에만 기본 더미데이터 세팅
      const defaultData: BreedingRecord[] = [
        { id: '1', earTag: '0015', stage: '인공수정', date: '2026-05-10', semenNo: 'KPN-1122', expectedDate: '2027-02-15', status: '임신 감정 대기' },
        { id: '2', earTag: '0032', stage: '임신감정', date: '2026-04-15', semenNo: 'KPN-9988', expectedDate: '2027-01-20', status: '임신 확정 (1진단)' },
        { id: '3', earTag: '0041', stage: '분만완료', date: '2026-07-01', semenNo: 'KPN-5544', expectedDate: '2026-07-01', status: '건강한 암컷 출산' },
      ];
      setBreedingList(defaultData);
      localStorage.setItem('breedingRecords', JSON.stringify(defaultData));
    }
  }, []);

  const saveRecords = (newList: BreedingRecord[]) => {
    setBreedingList(newList);
    localStorage.setItem('breedingRecords', JSON.stringify(newList));
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!semenNo && activeTab === '인공수정') {
      alert('정액번호를 입력해주세요.');
      return;
    }

    const newRecord: BreedingRecord = {
      id: Date.now().toString(),
      earTag: targetCattle,
      stage: activeTab,
      date: workDate,
      semenNo: semenNo || '-',
      expectedDate: '2027-04-25',
      status: activeTab === '인공수정' ? '임신 감정 대기' : activeTab === '임신감정' ? '임신 확정' : '분만 완료',
      note,
    };

    const updated = [newRecord, ...breedingList];
    saveRecords(updated);
    setSemenNo('');
    setNote('');
    alert('번식 기록이 성공적으로 등록되었습니다!');
  };

  const handleDelete = (id: string, tag: string) => {
    if (confirm(`개체 [${tag}]의 번식 기록을 삭제하시겠습니까?`)) {
      const updated = breedingList.filter(item => item.id !== id);
      saveRecords(updated);
    }
  };

  const handleOpenEdit = (record: BreedingRecord) => {
    setEditingId(record.id);
    setEditForm({
      earTag: record.earTag,
      stage: record.stage,
      date: record.date,
      semenNo: record.semenNo,
      expectedDate: record.expectedDate,
      status: record.status,
      note: record.note || '',
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingId) return;

    const updated = breedingList.map(item => {
      if (item.id === editingId) {
        return {
          ...item,
          earTag: editForm.earTag,
          stage: editForm.stage,
          date: editForm.date,
          semenNo: editForm.semenNo,
          expectedDate: editForm.expectedDate,
          status: editForm.status,
          note: editForm.note,
        };
      }
      return item;
    });

    saveRecords(updated);
    setIsEditModalOpen(false);
    setEditingId(null);
    alert('번식 기록이 수정되었습니다.');
  };

  const filteredList = breedingList.filter(item => {
    if (searchCategory !== '구분 (전체)' && item.stage !== searchCategory) return false;
    if (item.date && (item.date < startDate || item.date > endDate)) return false;
    return true;
  });

  const waitingCount = breedingList.filter(item => item.stage === '인공수정').length;
  const pregnantCount = breedingList.filter(item => item.status.includes('확정') || item.status.includes('임신') || item.stage === '임신감정').length;
  
  const urgentBirthCount = breedingList.filter(item => {
    if (!item.expectedDate) return false;
    const today = new Date('2026-07-22');
    const expDate = new Date(item.expectedDate);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  }).length;

  const totalCompletedBirths = breedingList.filter(item => item.stage === '분만완료' || item.status.includes('분만') || item.status.includes('출산')).length;

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6">
      <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <svg className="w-6 h-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          번식 및 인공수정 관리
        </h2>
        
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <input 
              type="text" 
              placeholder="개체번호, 정액번호 검색..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-full pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-pink-500 transition-colors"
            />
            <svg className="w-5 h-5 text-gray-400 absolute right-3 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
          <div className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center border border-pink-200 text-pink-600 font-bold text-xs">N</div>
          <span className="text-gray-800 font-bold text-xs">관리자님</span>
        </div>
      </header>

      {/* 상단 카드 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-xs font-semibold mb-1">인공수정 진행 (대기)</div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-gray-900">{waitingCount}</span><span className="text-sm text-gray-600 font-medium">두</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center text-xl">🧬</div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-xs font-semibold mb-1">임신 확정 개체</div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-gray-900">{pregnantCount}</span><span className="text-sm text-gray-600 font-medium">두</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">🐄</div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-xs font-semibold mb-1">분만 임박 개체 (30일 이내)</div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-gray-900">{urgentBirthCount}</span><span className="text-sm text-gray-600 font-medium">두</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">⏳</div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-xs font-semibold mb-1">금년 총 분만 두수</div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-gray-900">{totalCompletedBirths}</span><span className="text-sm text-gray-600 font-medium">두</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">🎉</div>
        </div>
      </div>

      <div className="flex gap-6 flex-1 h-full">
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50 flex-wrap">
            <select 
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-pink-500"
            >
              <option>구분 (전체)</option>
              <option value="인공수정">인공수정</option>
              <option value="임신감정">임신감정</option>
              <option value="분만완료">분만완료</option>
            </select>
            
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">기간</span>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border rounded-lg px-2 py-1.5 bg-white" />
              <span>~</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border rounded-lg px-2 py-1.5 bg-white" />
            </div>

            <span className="ml-auto text-xs font-bold text-gray-400">총 {filteredList.length}건</span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-200">
                  <th className="px-3 py-3 font-semibold w-24">개체번호</th>
                  <th className="px-3 py-3 font-semibold w-24">단계</th>
                  <th className="px-3 py-3 font-semibold w-28">작업일자</th>
                  <th className="px-3 py-3 font-semibold">정액번호</th>
                  <th className="px-3 py-3 font-semibold">분만예정일</th>
                  <th className="px-3 py-3 font-semibold text-center w-28">상태</th>
                  <th className="px-3 py-3 font-semibold text-right w-32">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-pink-50/30 transition-colors">
                    <td className="px-3 py-3 font-extrabold text-gray-900 text-xs">{item.earTag}</td>
                    <td className="px-3 py-3 text-xs">
                      <span className="px-2 py-0.5 rounded font-bold bg-pink-50 text-pink-600">{item.stage}</span>
                    </td>
                    <td className="px-3 py-3 text-gray-600 text-xs">{item.date}</td>
                    <td className="px-3 py-3 text-gray-800 text-xs font-medium">{item.semenNo}</td>
                    <td className="px-3 py-3 text-emerald-600 font-bold text-xs">{item.expectedDate}</td>
                    <td className="px-3 py-3 text-center text-xs">
                      <span className="px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-700">{item.status}</span>
                    </td>
                    <td className="px-3 py-3 text-right space-x-1 whitespace-nowrap">
                      <button 
                        onClick={() => handleOpenEdit(item)}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition inline-block"
                      >
                        수정
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id, item.earTag)}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition inline-block"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-96 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-800">번식 기록 등록</h3>
            <p className="text-xs text-gray-400 mt-0.5">인공수정 및 임신·분만 이력을 추가합니다.</p>
          </div>
          
          <form onSubmit={handleRegister} className="p-5 flex-1 overflow-y-auto space-y-4 text-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 font-semibold mb-1 text-xs">진행 단계</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['인공수정', '임신감정', '분만완료'] as const).map((tab) => (
                    <button
                      type="button"
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-2 rounded-lg font-bold border transition text-xs ${
                        activeTab === tab 
                          ? 'border-pink-500 bg-pink-50 text-pink-700' 
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1 text-xs">대상 개체번호</label>
                <input 
                  type="text" 
                  value={targetCattle}
                  onChange={(e) => setTargetCattle(e.target.value)}
                  placeholder="예: 0015" 
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus:outline-none focus:border-pink-500 text-xs" 
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1 text-xs">작업 일자</label>
                <input 
                  type="date" 
                  value={workDate} 
                  onChange={(e) => setWorkDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus:outline-none focus:border-pink-500 text-xs" 
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1 text-xs">정액 번호</label>
                <input 
                  type="text" 
                  placeholder="예: KPN-1122" 
                  value={semenNo}
                  onChange={(e) => setSemenNo(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus:outline-none focus:border-pink-500 font-medium text-xs" 
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1 text-xs">비고 (특이사항)</label>
                <textarea 
                  rows={2} 
                  placeholder="특이사항이나 진단 결과..." 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:border-pink-500 resize-none text-xs"
                />
              </div>
            </div>
            
            <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl transition shadow-sm text-xs">
              기록 저장하기
            </button>
          </form>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-800">✏️ 번식 기록 수정</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">×</button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">개체번호</label>
                  <input 
                    type="text" 
                    value={editForm.earTag}
                    onChange={(e) => setEditForm({...editForm, earTag: e.target.value})}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">단계</label>
                  <select 
                    value={editForm.stage}
                    onChange={(e) => setEditForm({...editForm, stage: e.target.value as any})}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl"
                  >
                    <option value="인공수정">인공수정</option>
                    <option value="임신감정">임신감정</option>
                    <option value="분만예정">분만예정</option>
                    <option value="분만완료">분만완료</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">작업일자</label>
                  <input 
                    type="date" 
                    value={editForm.date}
                    onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">분만예정일</label>
                  <input 
                    type="date" 
                    value={editForm.expectedDate}
                    onChange={(e) => setEditForm({...editForm, expectedDate: e.target.value})}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">정액 번호</label>
                <input 
                  type="text" 
                  value={editForm.semenNo}
                  onChange={(e) => setEditForm({...editForm, semenNo: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">상태</label>
                <input 
                  type="text" 
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition"
                >
                  수정 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}