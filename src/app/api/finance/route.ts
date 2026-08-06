import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// 1. 재무/입출금 관련 타입 정의
export type FinanceType = '수입' | '지출';

export interface FinanceTransactionInput {
  type: FinanceType;       // 거래 구분 ('수입' | '지출')
  category: string;       // 항목 (출하매출, 사료구입, 약품비, 시설유지, 기타 등)
  amount: number;         // 금액 (원)
  description?: string;   // 상세 설명 / 비고
  date?: string;          // 거래 일자 (YYYY-MM-DD)
  relatedCowNumber?: string; // (선택) 연관된 소 귀표번호
}

// GET: 전체 거래 내역 조회 (최신 거래일자 순 정렬)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('소관리자');

    // 거래 일자(date) 내림차순, 동일 일자 내에서는 생성일시(createdAt) 내림차순 정렬
    const transactions = await db
      .collection('finance_transactions')
      .find({})
      .sort({ date: -1, createdAt: -1 })
      .toArray();

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error('Database Error (GET /api/finance):', error);
    return NextResponse.json(
      { error: '재무 거래 내역을 불러오지 못했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 신규 거래 내역(수입/지출) 등록
export async function POST(request: Request) {
  try {
    const body: FinanceTransactionInput = await request.json();

    // 1) 필수 항목 검증 (거래 구분, 항목, 금액)
    if (!body.type || !['수입', '지출'].includes(body.type)) {
      return NextResponse.json(
        { error: '거래 구분(type)은 "수입" 또는 "지출"이어야 합니다.' },
        { status: 400 }
      );
    }

    if (!body.category?.trim()) {
      return NextResponse.json(
        { error: '거래 항목(category)은 필수 입력 항목입니다.' },
        { status: 400 }
      );
    }

    const amount = Number(body.amount);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: '금액(amount)은 0보다 큰 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('소관리자');

    // 2) 신규 저장 데이터 구성
    const newTransaction = {
      type: body.type,
      category: body.category.trim(),
      amount: amount,
      description: body.description?.trim() || '',
      relatedCowNumber: body.relatedCowNumber?.trim() || null,
      date: body.date || new Date().toISOString().split('T')[0],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection('finance_transactions')
      .insertOne(newTransaction);

    return NextResponse.json(
      { success: true, insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Database Error (POST /api/finance):', error);
    return NextResponse.json(
      { error: '거래 내역 저장에 실패했습니다.' },
      { status: 500 }
    );
  }
}