import mongoose, { Schema, Document, Model, models, model } from 'mongoose';

export interface IBarn extends Document {
  userId: string;
  name: string;          // 축사 이름 (예: 큰축사, 작은축사)
  description?: string;  // 설명
  createdAt: Date;
}

const BarnSchema = new Schema<IBarn>(
  {
    userId: { type: String, default: 'default_user' },
    name: { type: String, required: true },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export default (models.Barn as Model<IBarn>) || model<IBarn>('Barn', BarnSchema);