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

    // 쿼리 조건도 barnId로 일치시킴
    const pens = await Pen.find({ barnId: barnId }).sort({ zone: 1, penNumber: 1 });
    return NextResponse.json(pens);
  } catch (error) {
    console.error('Failed to fetch pens:', error);
    return NextResponse.json({ error: '칸 목록 조회 실패' }, { status: 500 });
  }
}