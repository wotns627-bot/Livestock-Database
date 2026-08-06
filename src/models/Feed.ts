import mongoose, { Schema, Document } from 'mongoose';

export interface IFeed extends Document {
  name: string;             // 사료/원료명 (예: 볏짚, 옥수수, TMR 1호)
  category: string;         // 분류 (조사료, 농후사료, TMR, 미네랄 등)
  stock: number;            // 현재 재고량 (단위: kg)
  unitPrice: number;        // 단가 (원/kg)
  supplier: string;         // 공급처/구입처
  memo?: string;            // 비고
  createdAt: Date;
}

const FeedSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['ROUGHAGE', 'CONCENTRATE', 'TMR', 'MINERAL'] // ROUGHAGE:조사료, CONCENTRATE:농후사료
  },
  stock: { type: Number, required: true, default: 0 },
  unitPrice: { type: Number, default: 0 },
  supplier: { type: String, default: '' },
  memo: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Feed || mongoose.model<IFeed>('Feed', FeedSchema);