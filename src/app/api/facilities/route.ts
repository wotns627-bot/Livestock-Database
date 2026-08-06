import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// 1. 축사 관련 타입 정의
export type VentilationStatus = 'ON' | 'OFF';
export type WaterSystemStatus = '정상' | '점검필요' | '고장';

export interface FacilityInput {
  penName: string;
  temperature?: number;
  humidity?: number;
  ventilationStatus?: VentilationStatus;
  waterSystemStatus?: WaterSystemStatus;
}

export interface FacilityUpdateInput {
  id: string;
  penName?: string;
  temperature?: number;
  humidity?: number;
  ventilationStatus?: VentilationStatus;
  waterSystemStatus?: WaterSystemStatus;
}

// GET: 전체 축사/설비 현황 조회 (축사명순 정렬)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('소관리자');

    const facilities = await db
      .collection('facilities')
      .find({})
      .sort({ penName: 1 })
      .toArray();

    return NextResponse.json(facilities, { status: 200 });
  } catch (error) {
    console.error('Database Error (GET /api/facilities):', error);
    return NextResponse.json(
      { error: '축사 설비 목록을 불러오지 못했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 신규 축사/동 등록
export async function POST(request: Request) {
  try {
    const body: FacilityInput = await request.json();

    // 1) 필수 항목 검증 (축사명)
    if (!body.penName?.trim()) {
      return NextResponse.json(
        { error: '축사명(penName)은 필수 입력 항목입니다.' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('소관리자');

    // 2) 동일 축사명 중복 검사
    const existingPen = await db
      .collection('facilities')
      .findOne({ penName: body.penName.trim() });

    if (existingPen) {
      return NextResponse.json(
        { error: '이미 등록된 축사명입니다.' },
        { status: 409 }
      );
    }

    // 3) DB 저장 데이터 구성
    const newFacility = {
      penName: body.penName.trim(),
      temperature: Number(body.temperature ?? 22),
      humidity: Number(body.humidity ?? 65),
      ventilationStatus: body.ventilationStatus || 'OFF',
      waterSystemStatus: body.waterSystemStatus || '정상',
      lastChecked: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('facilities').insertOne(newFacility);

    return NextResponse.json(
      { success: true, insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Database Error (POST /api/facilities):', error);
    return NextResponse.json(
      { error: '축사 정보 등록에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 축사 제어 및 센서값(온도/습도/스위치) 업데이트
export async function PUT(request: Request) {
  try {
    const body: FacilityUpdateInput = await request.json();
    const { id, penName, temperature, humidity, ventilationStatus, waterSystemStatus } = body;

    // 1) ObjectId 유효성 검사
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: '유효하지 않은 ID 형식입니다.' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('소관리자');

    // 2) 업데이트할 필드 동적 생성
    const updateFields: Record<string, unknown> = {
      lastChecked: new Date(),
      updatedAt: new Date(),
    };

    if (penName !== undefined) updateFields.penName = penName;
    if (temperature !== undefined) updateFields.temperature = Number(temperature);
    if (humidity !== undefined) updateFields.humidity = Number(humidity);
    if (ventilationStatus !== undefined) updateFields.ventilationStatus = ventilationStatus;
    if (waterSystemStatus !== undefined) updateFields.waterSystemStatus = waterSystemStatus;

    const result = await db.collection('facilities').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    // 3) 업데이트 대상 존재 여부 확인
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: '해당 축사 설비를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, modifiedCount: result.modifiedCount },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database Error (PUT /api/facilities):', error);
    return NextResponse.json(
      { error: '축사 상태 업데이트에 실패했습니다.' },
      { status: 500 }
    );
  }
}