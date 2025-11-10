const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MessageSchema = new Schema({
sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
userId: { type: Schema.Types.ObjectId, ref: 'User' },
role: { type: String, enum: ['user', 'assistant', 'system', 'tool'], required: true },
text: { type: String, required: true },
tokens: { type: Number, default: 0 },
meta: Schema.Types.Mixed
}, { timestamps: true });


MessageSchema.index({ sessionId: 1 });
module.exports = mongoose.model('Message', MessageSchema);
