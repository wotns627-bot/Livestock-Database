import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Pen from '@/models/Pen';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const barnId = searchParams.get('barnId');
    
    const query = barnId ? { barnId } : {};
    const pens = await Pen.find(query).sort({ zone: 1, penNumber: 1 });
    return NextResponse.json(pens);
  } catch (error) {
    console.error('Failed to fetch pens:', error);
    return NextResponse.json({ error: '칸 목록 조회 실패' }, { status: 500 });
  }
}