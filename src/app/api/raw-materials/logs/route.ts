// src/app/api/raw-materials/logs/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import RawMaterial from '@/models/RawMaterial';
import StockLog from '@/models/StockLog';

// 1. 입출고 히스토리 목록 조회 (GET)
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const materialId = searchParams.get('materialId');

    // Record<string, any> 타입을 사용하여 Mongoose find() 오버로드 에러(TS2345) 방지
    const query: Record<string, any> = {};
    if (materialId) {
      query.materialId = materialId;
    }

    const logs = await StockLog.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Failed to fetch stock logs:', error);
    return NextResponse.json({ error: '히스토리 조회에 실패했습니다.' }, { status: 500 });
  }
}

// 2. 재고 조정 및 히스토리 기록 (POST)
export async function POST(request: Request) {
  try {
    await connectDB();
    const { materialId, type, amount, memo } = await request.json();

    if (!materialId || !type || !amount || amount <= 0) {
      return NextResponse.json({ error: '올바른 입력값이 아닙니다.' }, { status: 400 });
    }

    const material = await RawMaterial.findById(materialId);
    if (!material) {
      return NextResponse.json({ error: '해당 원료를 찾을 수 없습니다.' }, { status: 404 });
    }

    const currentStock = material.stock ?? 0;
    const changeAmount = type === 'IN' ? Number(amount) : -Number(amount);
    const newStock = currentStock + changeAmount;

    if (newStock < 0) {
      return NextResponse.json(
        { error: `재고가 부족합니다. (현재 재고: ${currentStock.toLocaleString()}kg)` },
        { status: 400 }
      );
    }

    material.stock = newStock;
    material.updatedAt = new Date();
    await material.save();

    const log = await StockLog.create({
      materialId: material._id,
      materialName: material.name,
      type,
      amount: Number(amount),
      beforeStock: currentStock,
      afterStock: newStock,
      memo: memo || (type === 'IN' ? '신규 입고' : '사료 배합 사용'),
    });

    return NextResponse.json({ success: true, material, log }, { status: 201 });
  } catch (error) {
    console.error('Failed to process stock adjustment:', error);
    return NextResponse.json({ error: '재고 조정 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}