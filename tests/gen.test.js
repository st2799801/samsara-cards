import { group, eq, ok } from './assert.js';
import { makeRng } from '../js/rng.js';
import { generateSurvivor } from '../js/engine/gen.js';

group('gen', () => {
  const card = generateSurvivor(makeRng(42));
  ok(typeof card.name === 'string' && card.name.length >= 2, '有人名');
  ok(card.bioId && card.traits.length === 1, '起手仅 1 词条');
  // 起手词条必须等于小传绑定的 startTrait（技能跟着小传走）
  // 三维在合理范围
  ok(card.stats.atk >= 3 && card.stats.atk <= 18, 'atk 在 3..18');
  ok(card.stats.hp  >= 20 && card.stats.hp <= 50, 'hp 在 20..50');
  eq(card.stars, 0, '新卡 0 星');

  // 同种子可复现
  eq(generateSurvivor(makeRng(99)), generateSurvivor(makeRng(99)), '同种子同幸存者');
});
