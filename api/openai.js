/index');
this.apiKey = apiKey;
this.baseUrl = baseUrl || 'https://api.openai.com/v1';
}


async chat({ messages, model='gpt-4o-mini', temperature=0.7, stream=false, onDelta }) {
const url = `${this.baseUrl}/chat/completions`;
const payload = { model, messages: messages.map(m => ({ role: m.role || m.role, content: m.content || m.text || '' })), temperature, stream };
const res = await fetch(url, {
method: 'POST',
headers: { 'Authorization': `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
body: JSON.stringify(payload)
});
if(!res.ok) {
const body = await res.text();
throw new Error(`OpenAI API error: ${res.status} ${body}`);
}


if(stream) {
const reader = res.body.getReader();
const decoder = new TextDecoder('utf-8');
let buf = '';
while(true) {
const { done, value } = await reader.read();
if(done) break;
buf += decoder.decode(value, { stream: true });
// SSE-style chunks: look for lines starting with data:
const parts = buf.split('\n\n');
for(let i=0;i<parts.length-1;i++){
const part = parts[i].trim();
if(!part) continue;
const jsonText = part.replace(/^data:\s*/,'');
if(jsonText === '[DONE]') { onDelta(null, true); continue; }
try {
const parsed = JSON.parse(jsonText);
const delta = parsed.choices?.[0]?.delta?.content || parsed.choices?.[0]?.delta || '';
if(delta) onDelta(delta);
} catch(e) {
// ignore incomplete json
}
}
buf = parts[parts.length-1];
}
onDelta(null, true);
return;
} else {
const data = await res.json();
const content = data.choices?.[0]?.message?.content || '';
return { text: content, raw: data };
}
}


async summarize({ messages }) {
const prompt = `Summarize the conversation in a concise manner:\n\n${messages.map(m => `${m.role}: ${m.text}`).join('\n')}`;
return (await this.chat({ messages: [{ role:'system', content: prompt }], model: 'gpt-4o-mini' })).text;
}
}


module.exports = OpenAIProvider;
