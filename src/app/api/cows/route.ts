import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// 1. 유전능력 등급 타입
export type TraitGrade = 'A' | 'B' | 'C' | 'D';

export interface GeneticTraits {
  carcassWeight: TraitGrade; // 도체중
  loinArea: TraitGrade;      // 배최장근단면적
  backfat: TraitGrade;       // 등지방두께
  marbling: TraitGrade;      // 근내지방도
}

// 2. Request Body 타입 정의
export interface CowInput {
  cowNumber: string;
  breed?: string;
  gender: '암' | '수' | '거세';
  birthDate: string;
  entryDate?: string;
  kpn?: string;
  previousOwner?: string;
  geneticTraits?: Partial<GeneticTraits>;
  penName?: string;
  status?: '사육중' | '출하' | '폐사' | '매각';
}

// GET: 전체 소 목록 조회 (최신 등록순)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('소관리자');

    const cows = await db
      .collection('cows')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(cows, { status: 200 });
  } catch (error) {
    console.error('Database Error (GET /api/cows):', error);
    return NextResponse.json(
      { error: '소 목록을 불러오지 못했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 신규 소 등록
export async function POST(request: Request) {
  try {
    const body: CowInput = await request.json();

    // 1) 필수 항목 검증 (귀표번호)
    if (!body.cowNumber?.trim()) {
      return NextResponse.json(
        { error: '개체 식별번호(cowNumber)는 필수 입력 항목입니다.' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('소관리자');

    // 2) 개체 식별번호 중복 검사
    const existingCow = await db.collection('cows').findOne({ cowNumber: body.cowNumber.trim() });
    if (existingCow) {
      return NextResponse.json(
        { error: '이미 등록된 개체 식별번호입니다.' },
        { status: 409 }
      );
    }

    // 3) DB 저장 데이터 구성
    const newCow = {
      cowNumber: body.cowNumber.trim(),
      breed: body.breed || '한우',
      gender: body.gender || '미정',
      birthDate: body.birthDate || '',
      entryDate: body.entryDate || '',
      kpn: body.kpn || null,
      previousOwner: body.previousOwner || '',
      geneticTraits: {
        carcassWeight: body.geneticTraits?.carcassWeight || 'A',
        loinArea: body.geneticTraits?.loinArea || 'A',
        backfat: body.geneticTraits?.backfat || 'A',
        marbling: body.geneticTraits?.marbling || 'A',
      },
      penName: body.penName || '미지정',
      status: body.status || '사육중',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('cows').insertOne(newCow);

    return NextResponse.json(
      { success: true, insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Database Error (POST /api/cows):', error);
    return NextResponse.json(
      { error: '소 정보 등록에 실패했습니다.' },
      { status: 500 }
    );
  }
}