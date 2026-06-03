import { group, eq, ok } from './assert.js';
import { evalLoadout } from '../js/engine/traits.js';

group('traits', () => {
  // 单词条：mods 累加进 totals
  const r1 = evalLoadout(['bite']);
  eq(r1.totals.atk, 2, 'bite 给 +2 atk');

  // 套装联动：嗜血 2 件触发 set bonus(+3 atk)
  const r2 = evalLoadout(['bite','rage']);   // atk: 2+3(rage) + 3(set need2) = 8
  eq(r2.totals.atk, 8, '嗜血2件触发套装');
  ok(r2.sets.some(s => s.school==='blood' && s.need===2), '记录触发的套装');

  // 跨流派奇效：rage + bomb → 玉石俱焚
  const r3 = evalLoadout(['rage','bomb']);
  ok(r3.synergies.some(s => s.id==='mutual_destruction'), '触发玉石俱焚');
  ok(r3.totals.atk >= 10, '奇效加成生效');
});
