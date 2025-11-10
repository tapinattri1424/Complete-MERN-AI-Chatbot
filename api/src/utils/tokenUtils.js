// naive token estimator: 1 token ~= 4 chars
module.exports = {
estimateTokens: (text) => Math.max(1, Math.ceil((text || '').length / 4))
};
