import { makeRng } from './rng.js';
export const game = {
  rng: makeRng(),          // 整局共用一颗骰子
  run: null,               // 当前轮回 run（engine/run.js）
  draftCard: null,         // 待毕业的卡
};
export function reseed(seed) { game.rng = makeRng(seed); }
