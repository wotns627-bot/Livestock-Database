'use client';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// 임시 출하 데이터
const data = [
  { name: '1월', score: 85 },
  { name: '2월', score: 88 },
  { name: '3월', score: 82 },
  { name: '4월', score: 90 },
  { name: '5월', score: 95 },
  { name: '6월', score: 92 },
];

export default function HomePage() {
  const menuItems = [
    { title: '전체 개체 현황', desc: '전체 두수 및 상세 관리', link: '/cows', color: 'border-blue-500' },
    { title: '축사 현황', desc: '1동 / 2동 구분 모니터링', link: '/pens', color: 'border-green-500' },
    { title: '원료 재고', desc: 'TMR 배합 및 재고 관리', link: '/inventory', color: 'border-yellow-500' },
    { title: '출하 현황', desc: '등급, 도체중, 근내지방 관리', link: '/shipping', color: 'border-purple-500' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">스마트팜 통합 관리 시스템</h1>
      <p className="text-gray-500 mb-10">오늘의 농장 상태를 한눈에 확인하세요.</p>

      {/* 메뉴 카드 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {menuItems.map((item, index) => (
          <Link href={item.link} key={index} className={`bg-white p-6 rounded-xl shadow-md border-t-4 ${item.color} hover:shadow-xl transition-all`}>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h2>
            <p className="text-gray-500">{item.desc}</p>
          </Link>
        ))}
      </div>

      {/* 출하 성적 그래프 영역 */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-10">
        <h3 className="text-lg font-bold text-gray-800 mb-6">📈 최근 6개월 출하 성적 변화</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[70, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 작업 알림 영역 */}
      <div className="bg-gray-800 text-white p-6 rounded-xl">
        <h3 className="font-bold mb-3 border-b border-gray-600 pb-2">📋 오늘의 작업 알림</h3>
        <ul className="list-disc ml-5 space-y-1 text-gray-300">
          <li>사육 칸 점검 (2동) 확인하기</li>
          <li>원료 입고 예정 (옥수수 외 2종) 확인하기</li>
        </ul>
      </div>
    </div>
  );
}