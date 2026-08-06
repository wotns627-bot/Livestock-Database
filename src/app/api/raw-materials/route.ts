import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// 1. 사료 원료 관련 타입 정의
export type RawMaterialCategory = '농후사료' | '조사료' | 'TMR/TMF' | '첨가제' | '기타';

export interface RawMaterialInput {
  name: string;                 // 원료명 (예: 옥수수 가루, 볏짚, 대두박 등)
  category?: RawMaterialCategory; // 원료 카테고리
  stock?: number;                // 현재 재고량 (kg)
  unitPrice?: number;            // kg당 단가 (원)
  safetyStock?: number;          // 안전/적정 재고량 (kg)
  unit?: string;                 // 단위 (기본값: kg)
  supplier?: string;             // 공급처/구매처
}

// GET: 사료 원료 재고 목록 조회 (원료명순 정렬)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('소관리자');

    const rawMaterials = await db
      .collection('raw_materials')
      .find({})
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json(rawMaterials, { status: 200 });
  } catch (error) {
    console.error('Database Error (GET /api/raw-materials):', error);
    return NextResponse.json(
      { error: '사료 원료 목록을 불러오지 못했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 신규 사료 원료 등록
export async function POST(request: Request) {
  try {
    const body: RawMaterialInput = await request.json();

    // 1) 필수 항목 검증 (원료명)
    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: '원료명(name)은 필수 입력 항목입니다.' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('소관리자');

    // 2) 원료명 중복 검사
    const existingMaterial = await db
      .collection('raw_materials')
      .findOne({ name: body.name.trim() });

    if (existingMaterial) {
      return NextResponse.json(
        { error: '이미 등록된 사료 원료명입니다.' },
        { status: 409 }
      );
    }

    // 3) DB 저장 데이터 구성
    const newRawMaterial = {
      name: body.name.trim(),
      category: body.category || '농후사료',
      stock: Number(body.stock) || 0,
      unitPrice: Number(body.unitPrice) || 0,
      safetyStock: Number(body.safetyStock) || 0,
      unit: body.unit?.trim() || 'kg',
      supplier: body.supplier?.trim() || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('raw_materials').insertOne(newRawMaterial);

    return NextResponse.json(
      { success: true, insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Database Error (POST /api/raw-materials):', error);
    return NextResponse.json(
      { error: '사료 원료 저장에 실패했습니다.' },
      { status: 500 }
    );
  }
}