import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Shipment from '@/models/Shipment';
import Cattle from '@/models/Cattle';
import Pen from '@/models/Pen';

// [GET] 출하 내역 전체 조회
export async function GET() {
  try {
    await connectDB();
    // (Shipment as any)를 사용하여 TypeScript의 억지 에러를 강제로 무시합니다.
    const shipments = await (Shipment as any).find()
      .populate('cattleId', 'earTag gender')
      .sort({ shipmentDate: -1 });

    return NextResponse.json(shipments);
  } catch (error) {
    console.error('Failed to fetch shipments:', error);
    return NextResponse.json({ error: '출하 내역 조회 실패' }, { status: 500 });
  }
}

// [POST] 새 출하 내역 등록
export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();

    // 1. 출하 데이터 저장
    const newShipment = await (Shipment as any).create(data);

    // 2. (Cattle as any)로 강제 형변환하여 타입 에러 원천 차단
    const cattle = await (Cattle as any).findById(data.cattleId);
    
    if (cattle) {
      cattle.status = 'SHIPPED';
      await cattle.save();

      // 3. (Pen as any)로 강제 형변환하여 에러 차단 후 빈 칸 처리
      if (cattle.penId) {
        const pen = await (Pen as any).findById(cattle.penId);
        if (pen) {
          pen.status = 'EMPTY';
          pen.memo = '';
          await pen.save();
        }
      }
    }

    return NextResponse.json({ success: true, shipment: newShipment }, { status: 201 });
  } catch (error) {
    console.error('Failed to create shipment:', error);
    return NextResponse.json({ error: '출하 등록 실패' }, { status: 500 });
  }
}