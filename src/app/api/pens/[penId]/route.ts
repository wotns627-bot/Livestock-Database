// src/app/api/pens/[penId]/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Pen from '@/models/Pen';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ penId: string }> }
) {
  try {
    await connectDB();
    const { penId } = await params;
    const { status, memo } = await request.json();

    const updatedPen = await Pen.findByIdAndUpdate(
      penId,
      { ...(status && { status }), ...(memo !== undefined && { memo }) },
      { new: true }
    );

    if (!updatedPen) {
      return NextResponse.json({ error: '칸을 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, pen: updatedPen });
  } catch (error) {
    console.error('Failed to update pen:', error);
    return NextResponse.json({ error: '칸 상태 변경 실패' }, { status: 500 });
  }
}