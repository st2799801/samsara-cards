import { group, eq, ok } from './assert.js';
import { makeRng } from '../js/rng.js';
import { startRun, resolveCheck, dungeonModifier } from '../js/engine/run.js';

group('run', () => {
  const card = { name:'测试', bioId:'x', stats:{atk:10,def:10,hp:40}, traits:['bite'], stars:0, record:{win:0,lose:0} };
  const run = startRun(card, 0);
  eq(run.cycle, 1, '从第 1 轮开始');
  ok(run.alive, '开局存活');

  // dungeonModifier：持有 boon 命中的词条 → 拿到 boon.mod 加成
  const node = { type:'check', threshold:55, boon:{ traits:['bite'], mod:+15 }, fail:{damage:10} };
  eq(dungeonModifier(['bite'], node), 15, '命中 boon 词条给 +15');
  eq(dungeonModifier(['armor'], node), 0, '未命中 boon 不给加成');

  // resolveCheck 失败时扣血
  const r = makeRng(1);
  const failNode = { type:'check', threshold:101, boon:{traits:[],mod:0}, fail:{damage:10} };
  const out = resolveCheck(run, failNode, r);
  eq(out.success, false, '阈值101必失败');
  eq(run.card.stats.hp, 30, '失败扣 10 血');
  ok(run.alive === (run.card.stats.hp > 0), 'alive 跟随 hp');
});
