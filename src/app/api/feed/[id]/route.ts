import { NextResponse, NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Next.js 15 Route Context 타입 정의
interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET: 특정 사료 배합 기록 단일 조회
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // 1) ObjectId 유효성 검사
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: '유효하지 않은 ID 형식입니다.' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('소관리자');
    const record = await db
      .collection('feed_mix_records')
      .findOne({ _id: new ObjectId(id) });

    // 2) 데이터 존재 여부 확인
    if (!record) {
      return NextResponse.json(
        { error: '해당 사료 배합 기록을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    console.error('Database Error (GET /api/feed/[id]):', error);
    return NextResponse.json(
      { error: '사료 배합 기록 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 특정 사료 배합 기록 상세 수정
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: '유효하지 않은 ID 형식입니다.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('소관리자');

    // 동적 업데이트 필드 구성
    const updateFields: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (body.title !== undefined) updateFields.title = body.title;
    if (body.targetGroup !== undefined) updateFields.targetGroup = body.targetGroup;
    if (body.totalWeight !== undefined) updateFields.totalWeight = Number(body.totalWeight) || 0;
    if (body.totalCost !== undefined) updateFields.totalCost = Number(body.totalCost) || 0;
    if (body.ingredients !== undefined) updateFields.ingredients = body.ingredients;
    if (body.storageBins !== undefined) updateFields.storageBins = body.storageBins;
    if (body.status !== undefined) updateFields.status = body.status;
    if (body.feedStartDate !== undefined) updateFields.feedStartDate = body.feedStartDate;
    if (body.endDate !== undefined) updateFields.endDate = body.endDate;

    const result = await db.collection('feed_mix_records').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    // 대상 문서가 없을 경우 404 반환
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: '수정할 사료 배합 기록을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, modifiedCount: result.modifiedCount },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database Error (PUT /api/feed/[id]):', error);
    return NextResponse.json(
      { error: '사료 배합 기록 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 특정 사료 배합 기록 삭제
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: '유효하지 않은 ID 형식입니다.' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('소관리자');
    const result = await db
      .collection('feed_mix_records')
      .deleteOne({ _id: new ObjectId(id) });

    // 삭제 대상이 없을 경우 404 반환
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: '삭제할 사료 배합 기록을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, deletedCount: result.deletedCount },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database Error (DELETE /api/feed/[id]):', error);
    return NextResponse.json(
      { error: '사료 배합 기록 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}