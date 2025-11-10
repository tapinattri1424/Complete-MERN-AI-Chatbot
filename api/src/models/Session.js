const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const SessionSchema = new Schema({
userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
title: { type: String, default: 'New session' },
systemPrompt: { type: String, default: '' },
lastActiveAt: { type: Date, default: Date.now },
ttlIndex: { type: Date, default: undefined },
metadata: Schema.Types.MixeSession.js
d
}, { timestamps: true });


SessionSchema.index({ ttlIndex: 1 }, { expireAfterSeconds: 0 });


module.exports = mongoose.model('Session', SessionSchema);
