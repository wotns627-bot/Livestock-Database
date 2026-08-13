import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    await dbConnect();
    const { action, name, email } = await request.json();

    // 아이디 찾기 로직
    if (action === 'findId') {
      // 이름과 이메일이 모두 일치하는 사용자 검색
      const user = await User.findOne({ name, email });
      
      if (!user) {
        return NextResponse.json(
          { success: false, message: '입력하신 정보와 일치하는 계정이 없습니다.' },
          { status: 404 }
        );
      }
      
      // 보안을 위해 아이디의 일부만 가리거나 전체를 보여줄 수 있습니다. (여기서는 전체 제공)
      return NextResponse.json({ 
        success: true, 
        message: `고객님의 아이디는 [ ${user.username} ] 입니다.` 
      });
    }
    
    return NextResponse.json(
      { success: false, message: '잘못된 요청입니다.' }, 
      { status: 400 }
    );

  } catch (error) {
    console.error('Find Account Error:', error);
    return NextResponse.json(
      { success: false, message: '서버 내부 오류가 발생했습니다.' }, 
      { status: 500 }
    );
  }
}