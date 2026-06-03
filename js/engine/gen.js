import { SURNAMES, GIVEN } from '../data/names.data.js';
import { BIOS } from '../data/bios.data.js';

// 掷 3d6 类区间：sum of n dice
function roll(rng, n, faces) { let s = 0; for (let i=0;i<n;i++) s += rng.int(1, faces); return s; }

// 上帝的骰子生成幸存者：随机人名 + 随机小传 + 随机属性 + 跟着小传走的起手词条
export function generateSurvivor(rng) {
  const bio = rng.pick(BIOS);
  const name = rng.pick(SURNAMES) + rng.pick(GIVEN);
  const stats = {
    atk: roll(rng, 3, 6),          // 3..18
    def: roll(rng, 3, 6),          // 3..18
    hp:  20 + roll(rng, 5, 6),     // 25..50（保底偏高，留作战斗资源）
  };
  return {
    name,
    bioId: bio.id,
    bioText: bio.text,
    nick: bio.nick,
    stats,
    traits: [bio.startTrait],
    stars: 0,
    record: { win: 0, lose: 0 },
  };
}
