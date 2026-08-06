'use client';

import { useState, useEffect } from 'react';

export default function CurrentDate() {
  const [todayString, setTodayString] = useState('');

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
    });
    setTodayString(formattedDate);
  }, []);

  return <span className="font-medium ml-2">{todayString || '날짜 로딩 중...'}</span>;
}