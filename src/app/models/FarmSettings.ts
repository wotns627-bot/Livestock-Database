import mongoose, { Schema, Document } from 'mongoose';

interface IFarmSettings extends Document {
  farmName: string;
  region: string; // 예: "Namhae", "Jinju" 등 날씨 API용 도시명 또는 좌표
  regionDisplayName: string; // 화면 표시용: "경상남도 남해군"
}

const FarmSettingsSchema = new Schema<IFarmSettings>({
  farmName: { type: String, required: true, default: '우리 한우 농장' },
  region: { type: String, required: true, default: 'Namhae' },
  regionDisplayName: { type: String, required: true, default: '경상남도 남해군' },
}, { timestamps: true });

export default mongoose.models.FarmSettings || mongoose.model<IFarmSettings>('FarmSettings', FarmSettingsSchema);