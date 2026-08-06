import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Feed from '@/models/Feed';

export async function GET() {
  try {
    await connectDB();
    const feeds = await Feed.find().sort({ createdAt: -1 });
    return NextResponse.json(feeds);
  } catch (error) {
    console.error('Failed to fetch feed:', error);
    return NextResponse.json({ error: '사료 목록 조회 실패' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, category, stock, unitPrice, supplier, memo } = await request.json();

    const newFeed = await Feed.create({
      name,
      category,
      stock: Number(stock) || 0,
      unitPrice: Number(unitPrice) || 0,
      supplier,
      memo,
    });

    return NextResponse.json({ success: true, feed: newFeed }, { status: 201 });
  } catch (error) {
    console.error('Failed to create feed:', error);
    return NextResponse.json({ error: '사료 등록 실패' }, { status: 500 });
  }
}