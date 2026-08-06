// src/app/test/page.tsx
'use client';

import React, { useState } from 'react';

export default function TestPage() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        ✨ 새롭게 만든 테스트 페이지
      </h1>
      <p style={{ fontSize: '16px', color: '#555', marginBottom: '30px' }}>
        현재 카운트: <b>{count}</b>
      </p>
      <button
        type="button"
        onClick={() => {
          setCount(prev => prev + 1);
          alert('버튼이 정상적으로 눌렸습니다!');
        }}
        style={{
          padding: '16px 32px',
          fontSize: '18px',
          fontWeight: 'bold',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        이 버튼을 눌러보세요 (+1)
      </button>
    </div>
  );
}