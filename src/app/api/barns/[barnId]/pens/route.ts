import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Pen from '@/models/Pen';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ barnId: string }> }
) {
  try {
    await connectDB();
    const { barnId } = await params;

    // 해당 축사에 속한 모든 칸을 구역 및 번호 순으로 조회
    const pens = await Pen.find({ barn: barnId }).sort({ zone: 1, penNumber: 1 });

    return NextResponse.json(pens);
  } catch (error) {
    console.error('Failed to fetch pens:', error);
    return NextResponse.json({ error: '칸 목록 조회 실패' }, { status: 500 });
  }
}