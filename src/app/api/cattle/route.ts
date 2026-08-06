// src/app/api/cattle/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cattle from '@/models/Cattle';
import Pen from '@/models/Pen';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const barnId = searchParams.get('barnId');

    let query = Cattle.find();
    if (barnId) {
      query = query.where('barnId').equals(barnId);
    }
    
    const cattleList = await query.sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: cattleList });
  } catch (error) {
    console.error('Failed to fetch cattle:', error);
    return NextResponse.json({ success: false, error: '개체 목록 조회 실패' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { earTag, gender, birthDate, weight, barnId, penId, memo, kpn, type, entryDate, previousFarm, meatGrade, barnLocation, status } = body;

    // 1. 개체 생성 (status를 프론트엔드 탭과 일치하도록 '사육중'으로 기본 설정)
    const newCattle = await Cattle.create({
      earTag,
      kpn: kpn || '-',
      type: type || '비육우',
      gender: gender || '거세',
      birthDate: birthDate || '2025-01-01',
      entryDate: entryDate || new Date().toISOString().substring(0, 10),
      previousFarm: previousFarm || '자가생산',
      meatGrade: meatGrade || { coldWeight: 'A', loinArea: 'A', fatThickness: 'B', marbling: 'A' },
      barnLocation: barnLocation || '',
      barnId,
      penId,
      memo,
      status: status || '사육중', // 👈 핵심: 프론트엔드 탭(사육중/출하완료)과 일치시킴
    });

    // 2. 해당 칸(Pen)의 상태를 OCCUPIED로 변경
    if (penId) {
      await Pen.findByIdAndUpdate(penId, {
        status: 'OCCUPIED',
        memo: `귀표: ${earTag}`,
      });
    }

    return NextResponse.json({ success: true, data: newCattle }, { status: 201 });
  } catch (error) {
    console.error('Failed to create cattle:', error);
    return NextResponse.json({ success: false, error: '개체 등록 실패 (중복된 귀표번호 확인)' }, { status: 500 });
  }
}