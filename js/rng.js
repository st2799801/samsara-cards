// 上帝的骰子：可种子化 RNG（mulberry32），所有随机走这里
export function makeRng(seed = Date.now() >>> 0) {
  let s = seed >>> 0;
  function next() {
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  const int = (min, max) => min + Math.floor(next() * (max - min + 1));
  const pick = (arr) => arr[int(0, arr.length - 1)];
  // 掷 1d100 + mod，与 threshold 比较；返回透明结果供 UI 展示
  const check = ({ threshold, mod = 0 }) => {
    const roll = int(1, 100);
    const total = roll + mod;
    return { roll, mod, total, threshold, success: total >= threshold };
  };
  return { int, pick, check, next };
}
