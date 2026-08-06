import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region') || 'Namhae';

  // 실제 운영 시 OpenWeatherMap 또는 기상청 API Key를 사용하여 호출합니다.
  // 여기서는 지역별 맞춤 예시 데이터를 반환하도록 구성했습니다.
  
  const weatherDataMap: Record<string, any> = {
    Namhae: { temp: 28, description: '맑음', humidity: 81 },
    Seoul: { temp: 31, description: '구름 많음', humidity: 65 },
    Jeonju: { temp: 30, description: '맑음', humidity: 70 },
  };

  const currentData = weatherDataMap[region] || { temp: 28, description: '맑음', humidity: 80 };

  return NextResponse.json(currentData);
}