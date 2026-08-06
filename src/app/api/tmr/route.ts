import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// 1. TMR 레시피 관련 타입 정의
export type TargetStage = '육성우' | '비육전기' | '비육후기' | '번식우' | '송아지' | '기타';

export interface TmrIngredient {
  rawMaterialId?: string;  // 원료재고(raw_materials) 컬렉션 연동 ID
  name: string;            // 원료명 (예: 이탈리안라이글라스, 옥수수, 대두박 등)
  ratioPercentage?: number;// 배합 비율 (%)
  amountKg: number;        // 실제 투입량 (kg)
  costPerKg?: number;      // kg당 단가 (원)
}

export interface TmrRecipeInput {
  recipeName: string;            // 배합비 명칭 (예: 비육후기 고영양 TMR A형)
  targetStage?: TargetStage;     // 대상 사육 단계
  targetWeightKg?: number;       // 1회 배합 목표 총 중량 (kg)
  ingredients: TmrIngredient[];  // 투입 원료 목록
  totalCost?: number;            // 총 원료비 (원)
  dryMatterPercentage?: number;  // 건물 함량 (DM, %)
  crudeProteinPercentage?: number;// 조단백질 함량 (CP, %)
  tdnPercentage?: number;        // 가가용성 총양분 (TDN, %)
  memo?: string;                 // 비고 / 사육 가이드
}

// GET: TMR 배합비 레시피 목록 조회 (최신 등록순)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('소관리자');

    const recipes = await db
      .collection('tmr_recipes')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    console.error('Database Error (GET /api/tmr):', error);
    return NextResponse.json(
      { error: 'TMR 배합비 목록을 불러오지 못했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 신규 TMR 배합비 레시피 등록
export async function POST(request: Request) {
  try {
    const body: TmrRecipeInput = await request.json();

    // 1) 필수 항목 검증 (배합비 명칭)
    if (!body.recipeName?.trim()) {
      return NextResponse.json(
        { error: '배합비 명칭(recipeName)은 필수 입력 항목입니다.' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('소관리자');

    // 2) 명칭 중복 검사
    const existingRecipe = await db
      .collection('tmr_recipes')
      .findOne({ recipeName: body.recipeName.trim() });

    if (existingRecipe) {
      return NextResponse.json(
        { error: '이미 존재하는 TMR 배합비 명칭입니다.' },
        { status: 409 }
      );
    }

    // 3) 원료 배열 및 총 비용/중량 자동 계산
    const ingredients = Array.isArray(body.ingredients) ? body.ingredients : [];

    const calculatedWeight = ingredients.reduce(
      (sum, item) => sum + (Number(item.amountKg) || 0),
      0
    );

    const calculatedCost = ingredients.reduce(
      (sum, item) => sum + (Number(item.amountKg) || 0) * (Number(item.costPerKg) || 0),
      0
    );

    const totalWeightKg = Number(body.targetWeightKg) || calculatedWeight;
    const totalCost = Number(body.totalCost) || calculatedCost;
    const costPerKg = totalWeightKg > 0 ? Math.round(totalCost / totalWeightKg) : 0;

    // 4) DB 저장 데이터 구성
    const newRecipe = {
      recipeName: body.recipeName.trim(),
      targetStage: body.targetStage || '기타',
      targetWeightKg: totalWeightKg,
      totalCost: totalCost,
      costPerKg: costPerKg,
      ingredients: ingredients.map((ing) => ({
        rawMaterialId:
          ing.rawMaterialId && ObjectId.isValid(ing.rawMaterialId)
            ? new ObjectId(ing.rawMaterialId)
            : null,
        name: ing.name.trim(),
        ratioPercentage: Number(ing.ratioPercentage) || 0,
        amountKg: Number(ing.amountKg) || 0,
        costPerKg: Number(ing.costPerKg) || 0,
      })),
      dryMatterPercentage: Number(body.dryMatterPercentage) || 0,
      crudeProteinPercentage: Number(body.crudeProteinPercentage) || 0,
      tdnPercentage: Number(body.tdnPercentage) || 0,
      memo: body.memo?.trim() || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('tmr_recipes').insertOne(newRecipe);

    return NextResponse.json(
      { success: true, insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Database Error (POST /api/tmr):', error);
    return NextResponse.json(
      { error: 'TMR 배합비 레시피 저장에 실패했습니다.' },
      { status: 500 }
    );
  }
}