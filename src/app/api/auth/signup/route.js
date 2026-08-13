import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    // 1. 데이터베이스 연결
    await dbConnect();

    // 2. 프론트엔드에서 보낸 데이터 받아오기 (email 추가됨)
    const { username, password, name, email, phone, address } = await request.json();

    // 3. 빈 값 체크
    if (!username || !password || !name || !email || !phone || !address) {
      return NextResponse.json(
        { success: false, message: '모든 항목(이메일 포함)을 입력해주세요.' },
        { status: 400 }
      );
    }

    // 4. 아이디 중복 체크
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: '이미 존재하는 아이디입니다.' },
        { status: 400 }
      );
    }

    // 5. 비밀번호 안전하게 암호화 (해싱)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. MongoDB에 실제 사용자 정보 저장
    await User.create({
      username,
      password: hashedPassword, // 암호화된 비밀번호 저장
      name,
      email, // 추가된 이메일 저장
      phone,
      address,
    });

    console.log(`새로운 회원 가입 성공: ${username} (${name})`);

    // 7. 성공 응답
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