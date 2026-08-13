import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    // 1. 데이터베이스 연결
    await dbConnect();

    const body = await request.json();
    const { username, password, autoLogin } = body;

    // 빈 값 체크
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: '아이디와 비밀번호를 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    // 2. DB에서 사용자 찾기
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 3. 비밀번호 검증 (암호화된 비밀번호 비교)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 4. JWT 토큰 생성
    const secret = process.env.JWT_SECRET || 'fallback_secret_key_for_smartfarm';
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      secret,
      { expiresIn: autoLogin ? '30d' : '1d' } // 자동 로그인이면 30일, 아니면 1일
    );

    // 5. 성공 응답 생성 및 쿠키(세션) 설정
    const response = NextResponse.json({ success: true, message: '로그인 성공' });
    
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: autoLogin ? 60 * 60 * 24 * 30 : 60 * 60 * 24, // 자동 로그인 시 30일(초 단위), 아니면 1일
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
    
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}