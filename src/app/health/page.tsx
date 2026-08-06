'use client';

import React, { useState, useEffect } from 'react';

interface HealthRecord {
  id: string;
  earTag: string;
  type: '백신접종' | '질병치료' | '구충/발굽' | '종합검진';
  date: string;
  item: string;
  veterinarian: string;
  status: string;
  note?: string;
}

export default function HealthPage() {
  const [activeTab, setActiveTab] = useState<'백신접종' | '질병치료' | '구충/발굽' | '종합검진'>('백신접종');
  const [targetCattle, setTargetCattle] = useState('0012');
  const [workDate, setWorkDate] = useState('2026-07-22');
  const [itemName, setItemName] = useState('');
  const [veterinarian, setVeterinarian] = useState('자체 관리');
  const [note, setNote] = useState('');

  const [searchCategory, setSearchCategory] = useState('구분 (전체)');
  const [startDate, setStartDate] = useState('2026-07-01');
  const [endDate, setEndDate] = useState('2026-07-22');

  const [healthList, setHealthList] = useState<HealthRecord[]>([]);

  // 수정 모달 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    earTag: '',
    type: '백신접종' as '백신접종' | '질병치료' | '구충/발굽' | '종합검진',
    date: '',
    item: '',
    veterinarian: '',
    status: '',
    note: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('healthRecords');
    if (saved) {
      try {
        setHealthList(JSON.parse(saved));
      } catch (e) {
        initDefaultRecords();
      }
    } else {
      initDefaultRecords();
    }
  }, []);

  const initDefaultRecords = () => {
    const defaultData: HealthRecord[] = [
      { id: '1', earTag: '0012', type: '백신접종', date: '2026-07-10', item: '구제역 백신 (FMD)', veterinarian: '김수의사', status: '접종 완료' },
      { id: '2', earTag: '0025', type: '질병치료', date: '2026-07-15', item: '설사 및 소화기 치료', veterinarian: '박원장', status: '완치됨' },
      { id: '3', earTag: '0038', type: '구충/발굽', date: '2026-07-18', item: '외부 기생충 구충', veterinarian: '자체 관리', status: '처치 완료' },
    ];
    setHealthList(defaultData);
    localStorage.setItem('healthRecords', JSON.stringify(defaultData));
  };

  const saveRecords = (newList: HealthRecord[]) => {
    setHealthList(newList);
    localStorage.setItem('healthRecords', JSON.stringify(newList));
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!itemName) {
      alert('항목/약품명을 입력해주세요.');
      return;
    }

    const newRecord: HealthRecord = {
      id: Date.now().toString(),
      earTag: targetCattle,
      type: activeTab,
      date: workDate,
      item: itemName,
      veterinarian: veterinarian,
      status: '처리 완료',
      note,
    };

    const updated = [newRecord, ...healthList];
    saveRecords(updated);
    setItemName('');
    setNote('');
    alert('건강 및 방역 기록이 성공적으로 등록되었습니다!');
  };

  const handleDelete = (id: string, tag: string) => {
    if (confirm(`개체 [${tag}]의 건강 기록을 삭제하시겠습니까?`)) {
      const updated = healthList.filter(item => item.id !== id);
      saveRecords(updated);
    }
  };

  const handleOpenEdit = (record: HealthRecord) => {
    setEditingId(record.id);
    setEditForm({
      earTag: record.earTag,
      type: record.type,
      date: record.date,
      item: record.item,
      veterinarian: record.veterinarian,
      status: record.status,
      note: record.note || '',
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingId) return;

    const updated = healthList.map(item => {
      if (item.id === editingId) {
        return {
          ...item,
          earTag: editForm.earTag,
          type: editForm.type,
          date: editForm.date,
          item: editForm.item,
          veterinarian: editForm.veterinarian,
          status: editForm.status,
          note: editForm.note,
        };
      }
      return item;
    });

    saveRecords(updated);
    setIsEditModalOpen(false);
    setEditingId(null);
    alert('건강 기록이 수정되었습니다.');
  };

  const filteredList = healthList.filter(item => {
    if (searchCategory !== '구분 (전체)' && item.type !== searchCategory) return false;
    if (item.date < startDate || item.date > endDate) return false;
    return true;
  });

  const vaccineCount = healthList.filter(item => item.type === '백신접종').length;
  const treatCount = healthList.filter(item => item.type === '질병치료').length;

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6">
      <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          건강 및 방역 관리
        </h2>
        
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <input 
              type="text" 
              placeholder="개체번호, 약품명, 수의사 검색..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-full pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <svg className="w-5 h-5 text-gray-400 absolute right-3 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200 text-emerald-600 font-bold text-xs">N</div>
          <span className="text-gray-800 font-bold text-xs">관리자님</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-xs font-semibold mb-1">금월 백신 접종 건수</div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-gray-900">{vaccineCount}</span><span className="text-sm text-gray-600 font-medium">건</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl">💉</div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-xs font-semibold mb-1">현재 질병 치료 중</div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-gray-900">{treatCount}</span><span className="text-sm text-gray-600 font-medium">두</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">🩺</div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-xs font-semibold mb-1">정기 방역 예정일</div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-gray-900">2026-08-05</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">🛡️</div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-xs font-semibold mb-1">폐사 및 도태 두수</div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-gray-900">0</span><span className="text-sm text-gray-600 font-medium">두</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">⚠️</div>
        </div>
      </div>

      <div className="flex gap-6 flex-1 h-full">
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50 flex-wrap">
            <select 
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-emerald-500"
            >
              <option>구분 (전체)</option>
              <option value="백신접종">백신접종</option>
              <option value="질병치료">질병치료</option>
              <option value="구충/발굽">구충/발굽</option>
              <option value="종합검진">종합검진</option>
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
                  <th className="px-3 py-3 font-semibold w-24">구분</th>
                  <th className="px-3 py-3 font-semibold w-28">처치일자</th>
                  <th className="px-3 py-3 font-semibold">항목 및 약품명</th>
                  <th className="px-3 py-3 font-semibold w-28">담당자/수의사</th>
                  <th className="px-3 py-3 font-semibold text-center w-28">상태</th>
                  <th className="px-3 py-3 font-semibold text-right w-32">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="px-3 py-3 font-extrabold text-gray-900 text-xs">{item.earTag}</td>
                    <td className="px-3 py-3 text-xs">
                      <span className="px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-600">{item.type}</span>
                    </td>
                    <td className="px-3 py-3 text-gray-600 text-xs">{item.date}</td>
                    <td className="px-3 py-3 text-gray-800 text-xs font-medium">{item.item}</td>
                    <td className="px-3 py-3 text-gray-600 text-xs">{item.veterinarian}</td>
                    <td className="px-3 py-3 text-center text-xs">
                      <span className="px-2 py-0.5 rounded font-bold bg-blue-50 text-blue-700">{item.status}</span>
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
            <h3 className="font-bold text-gray-800">건강 기록 등록</h3>
            <p className="text-xs text-gray-400 mt-0.5">백신 접종, 질병 치료 내역을 추가합니다.</p>
          </div>
          
          <form onSubmit={handleRegister} className="p-5 flex-1 overflow-y-auto space-y-4 text-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 font-semibold mb-1 text-xs">처치 구분</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['백신접종', '질병치료', '구충/발굽', '종합검진'] as const).map((tab) => (
                    <button
                      type="button"
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-2 rounded-lg font-bold border transition text-xs ${
                        activeTab === tab 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
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
                  placeholder="예: 0012" 
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus:outline-none focus:border-emerald-500 text-xs" 
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1 text-xs">처치 일자</label>
                <input 
                  type="date" 
                  value={workDate} 
                  onChange={(e) => setWorkDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus:outline-none focus:border-emerald-500 text-xs" 
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1 text-xs">항목 및 약품명</label>
                <input 
                  type="text" 
                  placeholder="예: 구제역 백신 / 소화제" 
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus:outline-none focus:border-emerald-500 font-medium text-xs" 
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1 text-xs">담당자 / 수의사</label>
                <input 
                  type="text" 
                  placeholder="예: 김수의사 또는 자체 관리" 
                  value={veterinarian}
                  onChange={(e) => setVeterinarian(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus:outline-none focus:border-emerald-500 text-xs" 
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1 text-xs">비고 (특이사항)</label>
                <textarea 
                  rows={2} 
                  placeholder="치료 경과나 투약 용량..." 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:border-emerald-500 resize-none text-xs"
                />
              </div>
            </div>
            
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition shadow-sm text-xs">
              건강 기록 저장하기
            </button>
          </form>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-800">✏️ 건강 기록 수정</h3>
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
                  <label className="block font-semibold text-gray-600 mb-1">구분</label>
                  <select 
                    value={editForm.type}
                    onChange={(e) => setEditForm({...editForm, type: e.target.value as any})}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl"
                  >
                    <option value="백신접종">백신접종</option>
                    <option value="질병치료">질병치료</option>
                    <option value="구충/발굽">구충/발굽</option>
                    <option value="종합검진">종합검진</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">처치일자</label>
                  <input 
                    type="date" 
                    value={editForm.date}
                    onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl"
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
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">항목 및 약품명</label>
                <input 
                  type="text" 
                  value={editForm.item}
                  onChange={(e) => setEditForm({...editForm, item: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">담당자/수의사</label>
                <input 
                  type="text" 
                  value={editForm.veterinarian}
                  onChange={(e) => setEditForm({...editForm, veterinarian: e.target.value})}
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
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition"
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