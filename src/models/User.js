import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // 아이디
  password: { type: String, required: true },               // 비밀번호
  name: { type: String, required: true },                   // 이름 (찾기 용도)
  email: { type: String, required: true },                  // 이메일 (찾기 용도)
  phone: { type: String, required: true },
  address: { type: String },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);