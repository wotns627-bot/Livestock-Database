import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 로그인 페이지나 API, 정적 파일들은 인증 체크에서 제외합니다.
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 로그인 여부를 확인하는 쿠키나 토큰 이름을 확인합니다 (예: 'token' 또는 'isLoggedIn')
  // 만약 다른 이름으로 쿠키를 저장하셨다면 그 이름으로 바꿔주시면 됩니다.
  const token = request.cookies.get('token')?.value;

  // 토큰이 없다면 로그인 페이지로 강제로 이동시킵니다.
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: ['/:path*'],
};