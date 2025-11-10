require('dotenv').config();
module.exports = {
port: process.env.PORT || 4000,
mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/chatdb',
jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret',
clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
defaultProvider: process.env.DEFAULT_PROVIDER || 'mock',
openaiKey: process.env.OPENAI_API_KEY || '',
maxTokens: parseInt(process.env.MAX_TOKENS || '4000', 10),
sessionTtlSeconds: parseInt(process.env.SESSION_TTL_SECONDS || '604800', 10)
};
