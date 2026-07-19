// src/types/cow.ts
export interface Cow {
  id: string;
  farmId: number;         // 사육칸번호
  cowNumber: string;      // 개체번호
  entryDate: string;      // 입식일
  birthDate: string;      // 생년월일
  kpn: string;            // KPN
  grade: {                // 유전 능력 (직관적인 객체 구조)
    meat: 'A' | 'B' | 'C' | 'D';
    breeding: 'A' | 'B' | 'C' | 'D';
    fat: 'A' | 'B' | 'C' | 'D';
    growth: 'A' | 'B' | 'C' | 'D';
  };
  owner: string;
}