// src/app/api/barns/[barnId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Barn from '@/models/Barn';
import Pen from '@/models/Pen';

type RouteContext = {
  params: Promise<{ barnId: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    const { barnId } = await context.params;
    const barn = await Barn.findById(barnId);
    
    if (!barn) {
      return NextResponse.json({ error: '축사를 찾을 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json(barn);
  } catch (error) {
    console.error('Failed to fetch barn:', error);
    return NextResponse.json({ error: '축사 조회 실패' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    const { barnId } = await context.params;

    await Pen.deleteMany({ barnId });
    const deletedBarn = await Barn.findByIdAndDelete(barnId);

    if (!deletedBarn) {
      return NextResponse.json({ error: '축사를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: '축사가 삭제되었습니다.' });
  } catch (error) {
    console.error('Failed to delete barn:', error);
    return NextResponse.json({ error: '축사 삭제 실패' }, { status: 500 });
  }
}