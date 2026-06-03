import { TRAITS, SET_BONUS, SYNERGY } from '../data/traits.data.js';

const BY_ID = Object.fromEntries(TRAITS.map(t => [t.id, t]));
export const getTrait = (id) => BY_ID[id];

function addMods(totals, mods = {}) {
  for (const [k, v] of Object.entries(mods)) totals[k] = (totals[k] || 0) + v;
}

// 输入词条 id 列表，输出累加后的 totals + 命中的套装/奇效，供决斗与 UI 使用
export function evalLoadout(traitIds = []) {
  const totals = { atk:0, def:0, hp:0, atkRoll:0, defRoll:0 };
  const owned = new Set(traitIds);

  for (const id of traitIds) {
    const t = BY_ID[id];
    if (t) addMods(totals, t.mods);
  }

  // 套装
  const counts = {};
  for (const id of traitIds) { const t = BY_ID[id]; if (t) counts[t.school] = (counts[t.school]||0)+1; }
  const sets = [];
  for (const [school, tiers] of Object.entries(SET_BONUS)) {
    for (const tier of tiers) {
      if ((counts[school]||0) >= tier.need) { addMods(totals, tier.mods); sets.push({ school, need: tier.need }); }
    }
  }

  // 跨流派奇效
  const synergies = [];
  for (const s of SYNERGY) {
    if (s.requires.every(id => owned.has(id))) { addMods(totals, s.mods); synergies.push({ id:s.id, name:s.name }); }
  }

  return { totals, sets, synergies };
}
