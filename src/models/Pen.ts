import mongoose, { Schema, Document, Model, models, model } from 'mongoose';

export interface IPen extends Document {
  barnId: mongoose.Types.ObjectId;
  zone: 'LEFT' | 'RIGHT'; // 좌측(어린송아지), 우측(큰송아지)
  penNumber: number;      // 1 ~ 15 칸 번호
  name: string;           // 표시 이름 (예: 좌측 1번)
  status: 'EMPTY' | 'OCCUPIED'; // 사육 중 여부
  memo?: string;          // 메모 (예: 개체 번호, 특이사항 등)
}

const PenSchema = new Schema<IPen>(
  {
    barnId: { type: Schema.Types.ObjectId, ref: 'Barn', required: true },
    zone: { type: String, enum: ['LEFT', 'RIGHT'], required: true },
    penNumber: { type: Number, required: true },
    name: { type: String, required: true },
    status: { type: String, enum: ['EMPTY', 'OCCUPIED'], default: 'EMPTY' },
    memo: { type: String, default: '' },
  },
  { timestamps: true }
);

export default (models.Pen as Model<IPen>) || model<IPen>('Pen', PenSchema);