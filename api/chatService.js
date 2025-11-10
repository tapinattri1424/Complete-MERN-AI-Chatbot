const Session = require('../models/Session');
const Message = require('../models/Message');
const User = require('../models/User');
const MockProvider = require('../providers/mock');
const OpenAIProvider = require('../providers/openai');
const config = require('../config');
const { estimateTokens } = require('../utils/tokenUtils');


class ChatService {
constructor() {
this.providers = {
mock: new MockProvider(),
openai: new OpenAIProvider({ apiKey: config.openaiKey })
};
this.defaultProvider = config.defaultProvider;
}


async safetyCheck(text) {
if(!text || typeof text !== 'string') throw new Error('Invalid input');
if(text.length > 50000) throw new Error('Input too long');
const lowered = text.toLowerCase();
const banned = ['kill', 'bomb', 'terror'];
for(const b of banned) if(lowered.includes(b)) throw new Error('Input violates policy');
if(/ignore (previous|all) instructions|forget your|you are an assistant/i.test(text)) throw new Error('Potential prompt injection');
}


async getOrCreateSession(userId, sessionId) {
if(sessionId) {
const s = await Session.findById(sessionId);
if(s) return s;
}
const s = await Session.create({ userId, ttlIndex: new Date(Date.now() + config.sessionTtlSeconds * 1000) });
return s;
}


async summarizeIfNeeded(session) {
const msgs = await Message.find({ sessionId: session._id }).sort({ createdAt: 1 }).lean();
const tokenCount = msgs.reduce((acc, m) => acc + (m.tokens || estimateTokens(m.text)), 0);
if(tokenCount > config.maxTokens) {
const provider = this.providers[this.defaultProvider];
const toSummarize = msgs.slice(0, Math.max(0, msgs.length - 10));
const summary = await provider.summarize({ messages: toSummarize });
await Message.create({ sessionId: session._id, role: 'system', text: `Summary:\n${summary}`, tokens: estimateTokens(summary) });
await Message.deleteMany({ sessionId: session._id, _id: { $in: toSummarize.map(m => m._id) } });
}
}


async handleMessage({ user, sessionId, text, providerName, model, stream=false, onDelta }) {
await this.safetyCheck(text);
const userId = user._id;
const session = await this.getOrCreateSession(userId, sessionId);
session.lastActiveAt = new Date();
session.ttlIndex = new Date(Date.now() + config.sessionTtlSeconds * 1000);
await session.save();


const userTokens = estimateTokens(text);
awa
