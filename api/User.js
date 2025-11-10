const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
email: { type: String, unique: true, required: true },
passwordHash: String,
role: { type: String, default: 'user' },
quota: {
tokensUsed: { type: Number, default: 0 },
monthlyLimit: { type: Number, default: 1000000 }
}
}, { timestamps: true });


module.exports = mongoose.model('User', UserSchema);
