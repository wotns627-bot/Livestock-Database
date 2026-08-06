import mongoose, { Schema, Document } from 'mongoose';

export interface IShipment extends Document {
  cattleId: mongoose.Types.ObjectId; // 어떤 소인지 연결 (Cattle)
  shipmentDate: Date;                // 출하 일자
  weight: number;                    // 출하 체중 (생체중)
  carcassWeight: number;             // 도체중 (고기 무게)
  grade: string;                     // 육질 등급 (예: 1++, 1+, 1, 2, 3)
  unitPrice: number;                 // 경락 단가 (원/kg)
  totalPrice: number;                // 총 수취 가격
  buyer: string;                     // 출하처 (예: 농협 공판장)
  memo?: string;                     // 비고
  createdAt: Date;
}

const ShipmentSchema: Schema = new Schema({
  cattleId: { type: Schema.Types.ObjectId, ref: 'Cattle', required: true },
  shipmentDate: { type: Date, required: true },
  weight: { type: Number, required: true },
  carcassWeight: { type: Number },
  grade: { 
    type: String, 
    enum: ['1++', '1+', '1', '2', '3', '등외'],
    required: true 
  },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  buyer: { type: String, required: true },
  memo: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Shipment || mongoose.model<IShipment>('Shipment', ShipmentSchema);