// src/models/RawMaterial.ts
import mongoose, { Schema, Document, Model, models, model } from 'mongoose';

export interface IRawMaterial extends Document {
  name: string;
  category: string;
  stock: number;
  safeStock: number;
  unitPrice: number;
  updatedAt: Date;
}

const RawMaterialSchema = new Schema<IRawMaterial>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true, default: '조사료' },
    stock: { type: Number, required: true, default: 0 },
    safeStock: { type: Number, required: true, default: 0 },
    unitPrice: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

// as Model<IRawMaterial> 타입을 명시하여 TS2349 유니온 타입 에러를 방지합니다.
export default (models.RawMaterial as Model<IRawMaterial>) || model<IRawMaterial>('RawMaterial', RawMaterialSchema);