// src/models/StockLog.ts
import mongoose, { Schema, Document, Model, models, model } from 'mongoose';

export interface IStockLog extends Document {
  materialId: mongoose.Types.ObjectId;
  materialName: string;
  type: 'IN' | 'OUT';
  amount: number;
  beforeStock: number;
  afterStock: number;
  memo?: string;
  createdAt: Date;
}

const StockLogSchema = new Schema<IStockLog>(
  {
    materialId: { type: Schema.Types.ObjectId, ref: 'RawMaterial', required: true },
    materialName: { type: String, required: true },
    type: { type: String, enum: ['IN', 'OUT'], required: true },
    amount: { type: Number, required: true, min: 1 },
    beforeStock: { type: Number, required: true },
    afterStock: { type: Number, required: true },
    memo: { type: String, default: '' },
  },
  { timestamps: true }
);

// as Model<IStockLog> 타입을 명시합니다.
export default (models.StockLog as Model<IStockLog>) || model<IStockLog>('StockLog', StockLogSchema);