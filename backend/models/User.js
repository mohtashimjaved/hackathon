import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['need_help', 'can_help', 'both', 'admin'], default: 'both' },
  avatar: { type: String, default: 'avatar1' },
  bio: { type: String, default: '' },
  skills: [{ type: String }],
  interests: [{ type: String }],
  location: { type: String },
  trustScore: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
