import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { username, password, name, phone, address } = await request.json();

    if (!username || !password || !name || !phone || !address) {
      return NextResponse.json(
        { success: false, message: '모든 항목을 입력해주세요.' },
        { status: 400 }
      );
    }

    // TODO: DB(MongoDB 등)에 사용자 정보(username, password, name, phone, address) 저장 로직 구현
    console.log('회원가입 데이터:', { username, name, phone, address });

    return NextResponse.json({
      success: true,
      message: '회원가입이 완료되었습니다.',
    });
  } catch (error) {
    console.error('Signup API Error:', error);
    return NextResponse.json(
      { success: false, message: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}