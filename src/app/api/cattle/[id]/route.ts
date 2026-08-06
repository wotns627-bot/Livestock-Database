// src/app/api/cattle/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    // @ts-ignore
    const client = await dbConnect();
    const db = client.db();
    
    const body = await request.json();
    delete body._id;

    const result = await db.collection('cattle').findOneAndUpdate(
      { _id: new ObjectId(resolvedParams.id) },
      { $set: body },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ success: false, error: '해당 개체를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    // @ts-ignore
    const client = await dbConnect();
    const db = client.db();

    const result = await db.collection('cattle').deleteOne({
      _id: new ObjectId(resolvedParams.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: '해당 개체를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}