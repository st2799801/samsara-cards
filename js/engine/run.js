import { DUNGEONS } from '../data/dungeons.data.js';

export function startRun(card, dungeonIndex = 0) {
  return { card, dungeonIndex, nodeIndex: 0, points: 0, cycle: 1, alive: true, log: [] };
}

// 词条命中副本节点的 boon 列表 → 返回该节点的加成 mod，否则 0
export function dungeonModifier(traitIds, node) {
  if (!node.boon || !node.boon.traits) return 0;
  return node.boon.traits.some(id => traitIds.includes(id)) ? node.boon.mod : 0;
}

// 结算一个 check 节点；走"上帝的骰子"，失败扣血、可能致死
export function resolveCheck(run, node, rng) {
  const mod = dungeonModifier(run.card.traits, node);
  const result = rng.check({ threshold: node.threshold, mod });
  if (result.success) {
    run.points += 3;
    run.log.push({ ...result, text: node.success });
  } else {
    const dmg = node.fail?.damage ?? 0;
    run.card.stats.hp -= dmg;
    run.alive = run.card.stats.hp > 0;
    run.log.push({ ...result, text: node.fail?.text, damage: dmg });
  }
  return { ...result };
}

export { DUNGEONS };
