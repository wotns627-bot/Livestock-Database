import mongoose, { Schema, Document } from 'mongoose';

interface IFarmSettings extends Document {
  farmName: string;
  region: string;
  regionDisplayName: string;
}

const FarmSettingsSchema = new Schema<IFarmSettings>({
  farmName: { type: String, required: true, default: '우리 한우 농장' },
  region: { type: String, required: true, default: 'Namhae' },
  regionDisplayName: { type: String, required: true, default: '경상남도 남해군' },
}, { timestamps: true });

export default mongoose.models.FarmSettings || mongoose.model<IFarmSettings>('FarmSettings', FarmSettingsSchema);