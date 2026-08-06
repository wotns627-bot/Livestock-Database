'use client';
import { useState } from 'react';

export default function CowForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    penNumber: '1-dong',
    cowNumber: '',
    entryDate: '',
    birthDate: '',
    kpn: '',
    fatness: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/cows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    
    if (res.ok) {
      alert('성공적으로 저장되었습니다!');
      setFormData({ penNumber: '1-dong', cowNumber: '', entryDate: '', birthDate: '', kpn: '', fatness: '' });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 p-6 bg-white shadow-md rounded-xl border">
      <select className="col-span-2 border p-2 rounded" onChange={(e) => setFormData({...formData, penNumber: e.target.value})}>
        <option value="1-dong">1동</option>
        <option value="2-dong">2동</option>
      </select>
      
      <input placeholder="개체 번호" className="border p-2 rounded" onChange={(e) => setFormData({...formData, cowNumber: e.target.value})} />
      <input placeholder="입식일" type="date" className="border p-2 rounded" onChange={(e) => setFormData({...formData, entryDate: e.target.value})} />
      <input placeholder="생년월일" type="date" className="border p-2 rounded" onChange={(e) => setFormData({...formData, birthDate: e.target.value})} />
      <input placeholder="KPN" className="border p-2 rounded" onChange={(e) => setFormData({...formData, kpn: e.target.value})} />
      
      <button type="submit" disabled={loading} className="col-span-2 bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
        {loading ? '저장 중...' : '저장하기'}
      </button>
    </form>
  );
}