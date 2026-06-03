// 跨环境 base64（Node 用 Buffer，浏览器用 btoa/atob + UTF-8 安全处理）
function toB64(str) {
  if (typeof Buffer !== 'undefined') return Buffer.from(str, 'utf8').toString('base64');
  return btoa(unescape(encodeURIComponent(str)));
}
function fromB64(b64) {
  if (typeof Buffer !== 'undefined') return Buffer.from(b64, 'base64').toString('utf8');
  return decodeURIComponent(escape(atob(b64)));
}

const PREFIX = 'SC1.'; // 版本前缀，便于将来升级

export function encodeCard(card) {
  return PREFIX + toB64(JSON.stringify(card));
}

export function decodeCard(code) {
  try {
    if (typeof code !== 'string' || !code.startsWith(PREFIX)) return null;
    const obj = JSON.parse(fromB64(code.slice(PREFIX.length)));
    if (!obj || !obj.stats || !Array.isArray(obj.traits)) return null;
    return obj;
  } catch { return null; }
}
