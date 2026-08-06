import mongoose, { Schema, Document } from 'mongoose';

export interface ICattle extends Document {
  earTag: string;           // 귀표번호 (고유값)
  gender: 'MALE' | 'FEMALE' | 'CASTRATED'; // 성별 (수컷, 암컷, 거세축)
  birthDate: Date;          // 생년월일
  weight: number;           // 체중 (kg)
  barnId: mongoose.Types.ObjectId; // 소속 축사 ID
  penId: mongoose.Types.ObjectId;  // 소속 칸 ID
  status: 'GROWING' | 'SHIPPED';   // 사육 중 / 출하 완료
  memo?: string;            // 메모
  createdAt: Date;
}

const CattleSchema: Schema = new Schema(
  {
    earTag: { type: String, required: true, unique: true },
    gender: { type: String, enum: ['MALE', 'FEMALE', 'CASTRATED'], required: true },
    birthDate: { type: Date, required: true },
    weight: { type: Number, default: 0 },
    barnId: { type: mongoose.Schema.Types.ObjectId, ref: 'Barn', required: true },
    penId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pen', required: true },
    status: { type: String, enum: ['GROWING', 'SHIPPED'], default: 'GROWING' },
    memo: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Cattle || mongoose.model<ICattle>('Cattle', CattleSchema);