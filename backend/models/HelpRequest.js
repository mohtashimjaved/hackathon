import mongoose from 'mongoose';

const HelpRequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  urgency: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  status: { type: String, enum: ['open', 'in-progress', 'solved'], default: 'open' },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  helpers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  selectedHelper: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('HelpRequest', HelpRequestSchema);
