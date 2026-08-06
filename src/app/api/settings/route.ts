import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db'; // 프로젝트의 DB 연결 유틸리티 경로에 맞춰주세요
import FarmSettings from '../../../models/FarmSettings';

// 설정 정보 불러오기 (GET)
export async function GET() {
  try {
    await dbConnect();
    
    // 설정이 없으면 기본값(남해)으로 자동 생성
    let settings = await FarmSettings.findOne();
    if (!settings) {
      settings = await FarmSettings.create({
        farmName: '우리 한우 농장',
        region: 'Namhae',
        regionDisplayName: '경상남도 남해군',
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('설정 조회 실패:', error);
    // DB 연결 에러 등의 경우 기본값 반환
    return NextResponse.json({
      farmName: '우리 한우 농장',
      region: 'Namhae',
      regionDisplayName: '경상남도 남해군',
    });
  }
}

// 설정 정보 수정하기 (PUT 또는 POST)
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { farmName, region, regionDisplayName } = body;

    let settings = await FarmSettings.findOne();
    if (!settings) {
      settings = new FarmSettings();
    }

    if (farmName) settings.farmName = farmName;
    if (region) settings.region = region;
    if (regionDisplayName) settings.regionDisplayName = regionDisplayName;

    await settings.save();

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('설정 저장 실패:', error);
    return NextResponse.json({ success: false, error: '설정 저장에 실패했습니다.' }, { status: 500 });
  }
}