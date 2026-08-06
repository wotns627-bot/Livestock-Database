import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: '아이디와 비밀번호를 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    // TODO: 실제 프로젝트에서는 여기서 MongoDB 등 DB에 회원 정보를 저장합니다.
    // 현재는 회원가입 성공 응답을 내려줍니다.
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