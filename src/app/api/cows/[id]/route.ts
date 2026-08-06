// src/app/api/cows/[id]/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET: 특정 소 상세 정보 조회
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "유효하지 않은 ID 형식입니다." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("소관리자");
    
    const cow = await db.collection("소").findOne({ _id: new ObjectId(id) });
    
    if (!cow) {
      return NextResponse.json({ error: "해당 소를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json(cow, { status: 200 });
  } catch (e) {
    console.error("소 상세 조회 에러:", e);
    return NextResponse.json({ error: "데이터를 불러오지 못했습니다." }, { status: 500 });
  }
}

// DELETE: 특정 소 삭제
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "유효하지 않은 ID 형식입니다." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("소관리자");

    const result = await db.collection("소").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "삭제할 소를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error("소 삭제 에러:", e);
    return NextResponse.json({ error: "삭제에 실패했습니다." }, { status: 500 });
  }
}// PATCH: 특정 소 정보 수정
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "유효하지 않은 ID 형식입니다." }, { status: 400 });
    }

    const body = await request.json();

    // 수정할 필드가 없는 빈 요청 방지
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "수정할 데이터가 없습니다." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("소관리자");

    const result = await db.collection("소").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "수정할 소를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ success: true, updatedCount: result.modifiedCount }, { status: 200 });
  } catch (e) {
    console.error("소 정보 수정 에러:", e);
    return NextResponse.json({ error: "수정 처리에 실패했습니다." }, { status: 500 });
  }
}