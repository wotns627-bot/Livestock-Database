'use client';
import { useState } from 'react';

export default function NewCowPage() {
  const [formData, setFormData] = useState({
    cowId: '', pen: '', birthDate: '', kpn: '', grade: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/cows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert('소 정보가 등록되었습니다!');
      setFormData({ cowId: '', pen: '', birthDate: '', kpn: '', grade: '' });
    } else {
      alert('등록 실패');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-lg mx-auto border rounded shadow-md">
      <h1 className="text-xl font-bold mb-4">소 정보 등록</h1>
      <input className="block w-full mb-2 p-2 border" placeholder="관리번호" onChange={(e) => setFormData({...formData, cowId: e.target.value})} />
      <input className="block w-full mb-2 p-2 border" placeholder="펜 번호 (1-dong/2-dong)" onChange={(e) => setFormData({...formData, pen: e.target.value})} />
      <input className="block w-full mb-2 p-2 border" placeholder="생년월일" type="date" onChange={(e) => setFormData({...formData, birthDate: e.target.value})} />
      <input className="block w-full mb-2 p-2 border" placeholder="KPN" onChange={(e) => setFormData({...formData, kpn: e.target.value})} />
      <input className="block w-full mb-4 p-2 border" placeholder="등급" onChange={(e) => setFormData({...formData, grade: e.target.value})} />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">등록하기</button>
    </form>
  );
}