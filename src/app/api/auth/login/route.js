import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // 1. 이메일과 비밀번호 입력 확인
    if (!email || !password) {
      return NextResponse.json(
        { message: '이메일과 비밀번호를 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    // 2. 가입된 유저가 있는지 확인
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: '존재하지 않는 이메일이거나 비밀번호가 틀렸습니다.' },
        { status: 401 }
      );
    }

    // 3. 비밀번호 일치 여부 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: '존재하지 않는 이메일이거나 비밀번호가 틀렸습니다.' },
        { status: 401 }
      );
    }

    // 4. 로그인 성공 (세션이나 토큰 처리를 이어서 진행할 수 있습니다)
    return NextResponse.json(
      { 
        message: '로그인 성공!', 
        user: { id: user._id, email: user.email } 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}