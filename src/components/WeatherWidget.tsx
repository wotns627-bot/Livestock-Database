'use client';

import { useState, useEffect } from 'react';

export default function WeatherWidget() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [todayString, setTodayString] = useState('');

  useEffect(() => {
    // 접속한 기기의 실시간 오늘 날짜를 강제로 가져옴
    const today = new Date();
    const formattedDate = today.toLocaleDateString('ko-KR', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric', 
      weekday: 'short' 
    });
    setTodayString(formattedDate);

    async function fetchWeather() {
      try {
        const settingsRes = await fetch('/api/settings');
        const settings = await settingsRes.json();
        const region = settings?.region || 'Namhae';
        const displayName = settings?.regionDisplayName || '경상남도 남해군';

        const res = await fetch(`/api/weather?region=${region}`);
        const data = await res.json();
        
        setWeather({ ...data, displayName });
      } catch (error) {
        console.error('날씨 정보를 불러오는 데 실패했습니다.', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  if (loading) {
    return <div className="p-4 bg-white rounded-lg shadow-sm border animate-pulse">날씨 정보를 불러오는 중...</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-gray-500">📍 {weather?.displayName || '농장 지역'} 실시간 날씨</h3>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-2xl font-bold text-gray-800">{weather?.temp ?? 28}°C</span>
          <span className="text-gray-600">{weather?.description || '맑음'}</span>
        </div>
      </div>
      <div className="text-right text-xs text-gray-400">
        <p>습도: {weather?.humidity ?? 81}%</p>
        {/* 브라우저가 직접 계산한 오늘 날짜 표시 */}
        <p className="font-semibold text-gray-600">기준일: {todayString || '오늘'}</p>
      </div>
    </div>
  );
}