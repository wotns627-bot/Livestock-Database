import mongoose, { Schema, Document } from 'mongoose';

export interface ICow extends Document {
  tagNumber: string;       // 이력번호 / 개체번호
  gender: '암' | '수' | '거세';
  breed: string;           // 품종 (한우, 육우 등)
  birthDate: Date;         // 생년월일
  weight: number;          // 체중 (kg)
  status: '사육중' | '출하완료' | '폐사';
  memo?: string;           // 메모
  createdAt: Date;
}

const CowSchema: Schema = new Schema({
  tagNumber: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['암', '수', '거세'], required: true },
  breed: { type: String, default: '한우' },
  birthDate: { type: Date, required: true },
  weight: { type: Number, required: true },
  status: { type: String, enum: ['사육중', '출하완료', '폐사'], default: '사육중' },
  memo: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Cow || mongoose.model<ICow>('Cow', CowSchema);