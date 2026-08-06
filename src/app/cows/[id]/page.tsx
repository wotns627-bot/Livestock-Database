// src/app/cows/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Cow {
  _id: string;
  tagNumber: string;
  gender: string;
  birthDate: string;
  weight: number;
  pen: string;
  healthStatus: string;
}

export default function CowsPage() {
  const [cows, setCows] = useState<Cow[]>([]);
  const [loading, setLoading] = useState(true);

  // 등록 폼 상태
  const [tagNumber, setTagNumber] = useState("");
  const [gender, setGender] = useState("암컷");
  const [birthDate, setBirthDate] = useState("");
  const [weight, setWeight] = useState("");
  const [pen, setPen] = useState("1번 펜");
  const [healthStatus, setHealthStatus] = useState("건강");

  const fetchCows = async () => {
    try {
      const res = await fetch("/api/cows");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCows(data);
      }
    } catch (error) {
      console.error("소 데이터 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCows();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagNumber) {
      alert("개체번호(이력번호)를 입력해주세요.");
      return;
    }

    try {
      const res = await fetch("/api/cows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tagNumber,
          gender,
          birthDate,
          weight: Number(weight) || 0,
          pen,
          healthStatus,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("개체가 성공적으로 등록되었습니다.");
        setTagNumber("");
        setBirthDate("");
        setWeight("");
        fetchCows();
      } else {
        alert(data.error || "등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("등록 에러:", error);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">🐂 개별 소 관리 (Hanwoo Tracking)</h1>

      {/* 등록 폼 */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">신규 개체 등록</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">개체/이력번호</label>
            <input
              type="text"
              value={tagNumber}
              onChange={(e) => setTagNumber(e.target.value)}
              placeholder="예: KR12345678"
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">성별</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="암컷">암컷</option>
              <option value="수컷">수컷</option>
              <option value="거세우">거세우</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">생년월일</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">체중 (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="0"
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">배정 펜</label>
            <input
              type="text"
              value={pen}
              onChange={(e) => setPen(e.target.value)}
              placeholder="예: A동 1번펜"
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition text-sm"
            >
              개체 등록
            </button>
          </div>
        </form>
      </div>

      {/* 목록 테이블 */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700">목장 개체 현황 목록</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">목록을 불러오는 중...</div>
        ) : cows.length === 0 ? (
          <div className="p-8 text-center text-gray-500">등록된 소 데이터가 없습니다.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                <th className="p-4 font-semibold">이력번호</th>
                <th className="p-4 font-semibold">성별</th>
                <th className="p-4 font-semibold">생년월일</th>
                <th className="p-4 font-semibold">체중</th>
                <th className="p-4 font-semibold">소속 펜</th>
                <th className="p-4 font-semibold">건강상태</th>
                <th className="p-4 font-semibold text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {cows.map((cow) => (
                <tr key={cow._id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-blue-600 underline">
                    <Link href={`/cows/${cow._id}`}>{cow.tagNumber}</Link>
                  </td>
                  <td className="p-4">{cow.gender}</td>
                  <td className="p-4">{cow.birthDate || "정보 없음"}</td>
                  <td className="p-4 font-semibold">{cow.weight} kg</td>
                  <td className="p-4">{cow.pen}</td>
                  <td className="p-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {cow.healthStatus}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <Link
                      href={`/cows/${cow._id}`}
                      className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs hover:bg-gray-200 transition"
                    >
                      상세보기
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}