// src/app/settings/page.tsx
'use client';

import React, { useState, useEffect } from 'react';

export default function SettingsPage() {
  // 기존 농장 정보 상태
  const [farmName, setFarmName] = useState('한우 스마트 농장');
  const [ownerName, setOwnerName] = useState('홍길동');
  const [phone, setPhone] = useState('010-1234-5678');
  const [address, setAddress] = useState('경상남도 남해군...');

  // 다크 모드 상태
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  // 설정 불러오기
  useEffect(() => {
    // 다크모드 불러오기
    const savedDark = localStorage.getItem('smartFarmDarkMode');
    if (savedDark === 'true') {
      setIsDarkMode(true);
    }

    // 기존 농장 정보 불러오기 (로컬스토리지 연동)
    const savedFarmName = localStorage.getItem('smartFarmName');
    const savedOwnerName = localStorage.getItem('smartFarmOwner');
    const savedPhone = localStorage.getItem('smartFarmPhone');
    const savedAddress = localStorage.getItem('smartFarmAddress');

    if (savedFarmName) setFarmName(savedFarmName);
    if (savedOwnerName) setOwnerName(savedOwnerName);
    if (savedPhone) setPhone(savedPhone);
    if (savedAddress) setAddress(savedAddress);
  }, []);

  // 전체 설정 저장 핸들러
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    // 다크모드 저장
    localStorage.setItem('smartFarmDarkMode', String(isDarkMode));
    window.dispatchEvent(new Event('storage'));

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // 농장 정보 저장
    localStorage.setItem('smartFarmName', farmName);
    localStorage.setItem('smartFarmOwner', ownerName);
    localStorage.setItem('smartFarmPhone', phone);
    localStorage.setItem('smartFarmAddress', address);

    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 🏷️ 상단 타이틀 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">시스템 설정</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            농장 정보 및 화면 테마 환경 설정을 관리합니다.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* ⚙️ 화면 모드 설정 카드 */}
        <div className={`p-6 rounded-2xl border shadow-sm transition-colors ${
          isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <h2 className="text-base font-semibold mb-4">화면 및 테마 설정</h2>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-sm">주간 / 야간 모드 (다크 모드)</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                야간 축사 작업이나 눈부심 방지를 위해 어두운 화면 테마로 전환합니다.
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                isDarkMode ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 📋 기존 농장 기본 정보 설정 카드 */}
        <div className={`p-6 rounded-2xl border shadow-sm transition-colors ${
          isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <h2 className="text-base font-semibold mb-4">농장 기본 정보 관리</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300">축사(농장) 명칭</label>
              <input
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
                placeholder="농장 이름을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300">대표자 성명</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
                placeholder="대표자 성함을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300">연락처 (전화번호)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
                placeholder="연락처를 입력하세요"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300">농장 주소</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
                placeholder="농장 주소를 입력하세요"
              />
            </div>
          </div>
        </div>

        {/* 💾 하단 저장 버튼 및 상태 안내 */}
        <div className="flex items-center justify-end gap-3">
          {savedMessage && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-pulse">
              모든 설정이 성공적으로 저장되었습니다! ✨
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-xs transition shadow-sm cursor-pointer"
          >
            설정 저장하기
          </button>
        </div>
      </form>
    </div>
  );
}