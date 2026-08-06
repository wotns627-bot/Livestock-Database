import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // TODO: 여기에 실제 아이디/비밀번호 확인 로직을 넣으세요.
    // 예시: 아이디가 admin이고 비밀번호가 1234일 때 성공
    if (username === 'admin' && password === '1234') {
      const response = NextResponse.json({ success: true, message: '로그인 성공' });
      
      // 미들웨어가 체크할 수 있도록 쿠키에 'token'을 심어줍니다!
      response.cookies.set({
        name: 'token',
        value: 'dummy-auth-token', // 실제 토큰 값으로 변경 가능
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24, // 1일
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: '아이디나 비밀번호가 틀렸습니다.' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}