'use client';

import React, { useState, useEffect } from 'react';

interface ScheduleItem {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: string; // 방역, 번식, 사료 등
  target: string; // 대상 개체/축사
  content: string;
  status: '예정' | '완료';
}

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    time: '09:00',
    type: '방역/백신',
    target: '전체 축사',
    content: '',
    status: '예정' as '예정' | '완료',
  });

  useEffect(() => {
    const saved = localStorage.getItem('farmSchedulesCustom');
    if (saved) {
      try {
        setSchedules(JSON.parse(saved));
      } catch (e) {
        initDefaultSchedules();
      }
    } else {
      initDefaultSchedules();
    }
  }, []);

  const initDefaultSchedules = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const defaults: ScheduleItem[] = [
      {
        id: '1',
        date: todayStr,
        time: '10:00',
        type: '방역/백신',
        target: '1축사 비육우',
        content: '구제역 백신 접종 예정',
        status: '예정',
      },
    ];
    setSchedules(defaults);
    localStorage.setItem('farmSchedulesCustom', JSON.stringify(defaults));
  };

  const saveSchedules = (newItems: ScheduleItem[]) => {
    setSchedules(newItems);
    localStorage.setItem('farmSchedulesCustom', JSON.stringify(newItems));
  };

  // 달력 월 변경 함수
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // 일정 등록/수정 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.content) {
      alert('일정 내용을 입력해주세요.');
      return;
    }

    if (editingId) {
      const updated = schedules.map(item =>
        item.id === editingId ? { ...item, ...form } : item
      );
      saveSchedules(updated);
      alert('일정이 수정되었습니다.');
    } else {
      const newItem: ScheduleItem = {
        id: Date.now().toString(),
        ...form,
      };
      saveSchedules([newItem, ...schedules]);
      alert('새 일정이 등록되었습니다.');
    }

    setIsModalOpen(false);
    setEditingId(null);
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      date: selectedDate,
      time: '09:00',
      type: '방역/백신',
      target: '전체 축사',
      content: '',
      status: '예정',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: ScheduleItem) => {
    setEditingId(item.id);
    setForm({
      date: item.date,
      time: item.time,
      type: item.type,
      target: item.target,
      content: item.content,
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('이 일정을 삭제하시겠습니까?')) {
      saveSchedules(schedules.filter(item => item.id !== id));
    }
  };

  // 달력 날짜 계산
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= lastDay; d++) {
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    calendarDays.push(`${year}-${mStr}-${dStr}`);
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const selectedSchedules = schedules.filter(item => item.date === selectedDate);

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-extrabold text-gray-900">📅 농장 일정 및 캘린더 관리</h2>
        <button
          onClick={openAddModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm"
        >
          + 일정 등록
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 좌측 캘린더 */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-extrabold text-gray-800 text-base">
              {year}년 {month + 1}월
            </h3>
            <div className="flex gap-1">
              <button
                onClick={handlePrevMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg border hover:bg-gray-50 text-gray-600 font-bold"
              >
                &lt;
              </button>
              <button
                onClick={handleNextMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg border hover:bg-gray-50 text-gray-600 font-bold"
              >
                &gt;
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 mb-2">
            <span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {calendarDays.map((dateStr, idx) => {
              if (!dateStr) return <div key={idx} />;

              const dayNum = Number(dateStr.split('-')[2]);
              const isSelected = selectedDate === dateStr;
              const isToday = todayStr === dateStr;
              const hasEvents = schedules.some(s => s.date === dateStr);

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-10 rounded-xl flex flex-col items-center justify-center relative transition font-semibold ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isToday
                      ? 'border-2 border-emerald-500 text-emerald-700 bg-emerald-50/50'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span>{dayNum}</span>
                  {hasEvents && !isSelected && (
                    <span className="w-1 h-1 bg-emerald-500 rounded-full mt-0.5"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 우측 선택된 날짜별 일정 목록 */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b pb-3">
            <h3 className="font-extrabold text-gray-800 text-base">
              농장 주요 일정 목록 (<span className="text-emerald-600">{selectedDate}</span> 기준)
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto">
            {selectedSchedules.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-xs">
                등록된 일정이 없습니다.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {selectedSchedules.map(item => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-4 bg-gray-50/60 rounded-xl border border-gray-100"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[11px] font-bold">
                          {item.type}
                        </span>
                        <span className="text-xs font-bold text-gray-800">{item.target}</span>
                        <span className="text-xs text-gray-400">{item.time}</span>
                      </div>
                      <p className="text-xs text-gray-700 font-medium">{item.content}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          item.status === '완료' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {item.status}
                      </span>
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-blue-600 text-xs font-bold hover:underline"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 text-xs font-bold hover:underline"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 일정 등록/수정 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-800">{editingId ? '✏️ 일정 수정' : '📅 일정 등록'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 font-bold text-lg">×</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-600 mb-1">날짜</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">시간</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">구분</label>
                  <select
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold"
                  >
                    <option value="방역/백신">방역/백신</option>
                    <option value="번식/인공수정">번식/인공수정</option>
                    <option value="사료/급여">사료/급여</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">대상</label>
                <input
                  type="text"
                  placeholder="예: 1축사 비육우 또는 특정 개체번호"
                  value={form.target}
                  onChange={e => setForm({ ...form, target: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">내용</label>
                <textarea
                  rows={3}
                  placeholder="상세 일정 내용을 입력하세요."
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">상태</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value as '예정' | '완료' })}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold"
                >
                  <option value="예정">예정</option>
                  <option value="완료">완료</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold">취소</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold">저장</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}