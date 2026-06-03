import { group, eq, ok } from './assert.js';
import { makeRng } from '../js/rng.js';
import { simulateDuel } from '../js/engine/combat.js';

group('combat', () => {
  const strong = { name:'强', stats:{atk:18,def:14,hp:50}, traits:['crit','rage','bite','frenzy'] };
  const weak   = { name:'弱', stats:{atk:4,def:3,hp:22},  traits:['regen'] };

  const res = simulateDuel(strong, weak, { style:'aggro', order:strong.traits }, { style:'guard', order:weak.traits }, makeRng(3));
  ok(['A','B'].includes(res.winner), '产出胜者');
  ok(Array.isArray(res.rounds) && res.rounds.length >= 1, '有逐回合战报');
  // 强卡大概率赢（不强制，但同种子可复现）
  eq(simulateDuel(strong, weak, {style:'aggro',order:strong.traits}, {style:'guard',order:weak.traits}, makeRng(3)).winner,
     res.winner, '同种子结果可复现');

  // 布阵 style 影响：aggro 提升攻、guard 提升防（体现在 round 日志的有效值上）
  ok(res.rounds[0].a.atkRoll !== undefined, '回合记录含骰面，供 UI 展示');
});
