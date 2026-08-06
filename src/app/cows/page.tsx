// src/app/cows/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface GeneticTraits {
  carcassWeight: string;
  loinArea: string;
  backfat: string;
  marbling: string;
}

interface Cow {
  _id?: string;
  cowNumber: string;
  breed: string;
  gender: string;
  birthDate: string;
  entryDate: string;
  kpn: string;
  previousOwner: string;
  geneticTraits: GeneticTraits;
  penName: string;
  status: string;
}

// 생년월일로부터 현재까지의 월령을 계산하는 헬퍼 함수
function calculateAgeInMonths(birthDateStr: string): number {
  if (!birthDateStr) return 0;
  const birthDate = new Date(birthDateStr);
  const today = new Date();
  
  let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
  months -= birthDate.getMonth();
  months += today.getMonth();
  
  if (today.getDate() < birthDate.getDate()) {
    months--;
  }
  
  return Math.max(0, months);
}

export default function CowsPage() {
  const [cows, setCows] = useState<Cow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Cow>({
    cowNumber: '',
    breed: '한우 (거세)',
    gender: '거세',
    birthDate: new Date().toISOString().split('T')[0],
    entryDate: new Date().toISOString().split('T')[0],
    kpn: '',
    previousOwner: '',
    geneticTraits: {
      carcassWeight: 'A',
      loinArea: 'A',
      backfat: 'A',
      marbling: 'A',
    },
    penName: '',
    status: '사육중',
  });

  const fetchCows = async () => {
    try {
      const res = await fetch('/api/cows');
      if (!res.ok) {
        throw new Error('API 응답이 올바르지 않습니다.');
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setCows(data);
      }
    } catch (error) {
      console.error('Failed to fetch cows', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCows();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/cows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          cowNumber: '',
          breed: '한우 (거세)',
          gender: '거세',
          birthDate: new Date().toISOString().split('T')[0],
          entryDate: new Date().toISOString().split('T')[0],
          kpn: '',
          previousOwner: '',
          geneticTraits: {
            carcassWeight: 'A',
            loinArea: 'A',
            backfat: 'A',
            marbling: 'A',
          },
          penName: '',
          status: '사육중',
        });
        fetchCows();
      }
    } catch (error) {
      console.error('Failed to create cow record', error);
    }
  };

  const previewAge = calculateAgeInMonths(formData.birthDate);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-gray-100 min-h-screen">
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">개체(한우) 마리별 관리</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
        >
          + 신규 개체 등록
        </button>
      </header>

      <main className="p-8">
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">개체번호 / 품종</th>
                <th className="px-6 py-4">월령 및 생년월일</th>
                <th className="px-6 py-4">KPN / 이전 농장주</th>
                <th className="px-6 py-4">유전능력 (냉도체/배최장근/등지방/근내지방)</th>
                <th className="px-6 py-4">축사 / 상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    개체 데이터를 불러오는 중입니다...
                  </td>
                </tr>
              ) : cows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    등록된 한우 개체가 없습니다. 상단 버튼을 눌러 등록해주세요.
                  </td>
                </tr>
              ) : (
                cows.map((item) => {
                  const ageMonths = calculateAgeInMonths(item.birthDate);
                  return (
                    <tr key={item._id || item.cowNumber} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{item.cowNumber}</div>
                        <div className="text-xs text-gray-500">{item.breed} ({item.gender})</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-emerald-600">{ageMonths} 개월령</div>
                        <div className="text-xs text-gray-500">생년: {item.birthDate} (입식: {item.entryDate})</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-800">KPN: {item.kpn || '미입력'}</div>
                        <div className="text-xs text-gray-500">전 농장주: {item.previousOwner || '없음'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1.5 font-semibold text-xs">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200" title="냉도체">냉:{item.geneticTraits?.carcassWeight}</span>
                          <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded border border-green-200" title="배최장근단면적">배:{item.geneticTraits?.loinArea}</span>
                          <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded border border-yellow-200" title="등지방두께">등:{item.geneticTraits?.backfat}</span>
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded border border-purple-200" title="근내지방도">근:{item.geneticTraits?.marbling}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-emerald-600">{item.penName}</div>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {item.status}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-10">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg my-auto">
            <h2 className="text-lg font-bold mb-4">신규 한우 개체 등록</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">개체 식별번호 (귀표번호 15자리)</label>
                <input
                  type="text"
                  required
                  value={formData.cowNumber}
                  onChange={(e) => setFormData({ ...formData, cowNumber: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="예: 002154879632"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">품종</label>
                  <input
                    type="text"
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="예: 한우 (거세)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">성별</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    <option value="거세">거세</option>
                    <option value="암소">암소</option>
                    <option value="수소">수소</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-gray-600">생년월일</label>
                    <span className="text-xs font-bold text-emerald-600">({previewAge} 개월령)</span>
                  </div>
                  <input
                    type="date"
                    required
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">입식일</label>
                  <input
                    type="date"
                    required
                    value={formData.entryDate}
                    onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">KPN 번호</label>
                  <input
                    type="text"
                    value={formData.kpn}
                    onChange={(e) => setFormData({ ...formData, kpn: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="예: KPN-1150"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">이전 농장주</label>
                  <input
                    type="text"
                    value={formData.previousOwner}
                    onChange={(e) => setFormData({ ...formData, previousOwner: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="예: 홍길동 농장"
                  />
                </div>
              </div>

              <div className="border p-3 rounded-lg bg-gray-50 space-y-3">
                <label className="block text-xs font-bold text-gray-700">유전능력 등급 평가 (A/B/C/D)</label>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="block font-medium text-gray-600 mb-1">냉도체중</span>
                    <select
                      value={formData.geneticTraits.carcassWeight}
                      onChange={(e) => setFormData({
                        ...formData,
                        geneticTraits: { ...formData.geneticTraits, carcassWeight: e.target.value }
                      })}
                      className="w-full border rounded-lg px-2 py-1.5 bg-white font-semibold"
                    >
                      <option value="A">A 등급</option>
                      <option value="B">B 등급</option>
                      <option value="C">C 등급</option>
                      <option value="D">D 등급</option>
                    </select>
                  </div>
                  <div>
                    <span className="block font-medium text-gray-600 mb-1">배최장근단면적</span>
                    <select
                      value={formData.geneticTraits.loinArea}
                      onChange={(e) => setFormData({
                        ...formData,
                        geneticTraits: { ...formData.geneticTraits, loinArea: e.target.value }
                      })}
                      className="w-full border rounded-lg px-2 py-1.5 bg-white font-semibold"
                    >
                      <option value="A">A 등급</option>
                      <option value="B">B 등급</option>
                      <option value="C">C 등급</option>
                      <option value="D">D 등급</option>
                    </select>
                  </div>
                  <div>
                    <span className="block font-medium text-gray-600 mb-1">등지방두께</span>
                    <select
                      value={formData.geneticTraits.backfat}
                      onChange={(e) => setFormData({
                        ...formData,
                        geneticTraits: { ...formData.geneticTraits, backfat: e.target.value }
                      })}
                      className="w-full border rounded-lg px-2 py-1.5 bg-white font-semibold"
                    >
                      <option value="A">A 등급</option>
                      <option value="B">B 등급</option>
                      <option value="C">C 등급</option>
                      <option value="D">D 등급</option>
                    </select>
                  </div>
                  <div>
                    <span className="block font-medium text-gray-600 mb-1">근내지방도 (마블링)</span>
                    <select
                      value={formData.geneticTraits.marbling}
                      onChange={(e) => setFormData({
                        ...formData,
                        geneticTraits: { ...formData.geneticTraits, marbling: e.target.value }
                      })}
                      className="w-full border rounded-lg px-2 py-1.5 bg-white font-semibold"
                    >
                      <option value="A">A 등급</option>
                      <option value="B">B 등급</option>
                      <option value="C">C 등급</option>
                      <option value="D">D 등급</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">소속 축사</label>
                <input
                  type="text"
                  required
                  value={formData.penName}
                  onChange={(e) => setFormData({ ...formData, penName: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="예: A동 1번사"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
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