const Provider = require('./index');


class MockProvider extends Provider {
constructor(opts = {}) { super(); }
async chat({ messages, stream=false, onDelta }) {
const last = messages[messages.length-1];
const reply = `Mock reply to: ${last?.content || last?.text || '...'}`;
if(stream) {
// stream by chunks
const chunks = reply.match(/.{1,8}/g) || [reply];
for(const ch of chunks) {
await new Promise(r => setTimeout(r, 80));
onDelta(ch);
}
onDelta(null, true);
return;
}
return { text: reply, raw: {} };
}
async summarize({ messages }) {
return `Summary: ${messages.length} messages.`;
}
}


module.exports = MockProvider;
