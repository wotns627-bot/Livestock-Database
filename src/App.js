import React from 'react';

// 예시 데이터: 실제 나중에 DB에서 가져올 데이터
const mockCow = {
  id: '123456789',
  location: '1동 A열 01칸',
  status: '정상',
  entryDate: '2026-07-19',
  genetics: {
    '도체중': 'A',
    '등심단면적': 'A',
    '등지방두께': 'B',
    '근내지방도': 'A'
  }
};

function App() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">개체 상세 정보 조회 - {mockCow.id}</h1>
          <div className="space-x-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">정보 수정</button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-semibold mb-4">유전 능력 평가</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(mockCow.genetics).map(([key, value]) => (
              <div key={key} className="border p-4 rounded text-center bg-gray-50">
                <p className="text-sm text-gray-500">{key}</p>
                <p className="text-2xl font-bold text-blue-600">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;