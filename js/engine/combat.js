import { evalLoadout } from './traits.js';

const STYLE = {
  aggro:   { atkRoll:+8, defRoll:-4 },
  guard:   { atkRoll:-4, defRoll:+8 },
  counter: { atkRoll:+2, defRoll:+2 },
};

// 把卡 + 布阵编译成有效战斗属性
function build(card, plan) {
  const { totals } = evalLoadout(card.traits);
  const s = STYLE[plan.style] || STYLE.counter;
  return {
    name: card.name,
    atk: card.stats.atk + totals.atk,
    def: card.stats.def + totals.def,
    hp:  card.stats.hp + totals.hp,
    atkRoll: totals.atkRoll + s.atkRoll,
    defRoll: totals.defRoll + s.defRoll,
  };
}

// 一次攻击：掷骰，attacker.atkRoll vs defender.defRoll，命中则按攻防差扣血
function strike(att, def, rng) {
  const aRoll = rng.int(1, 100) + att.atkRoll;
  const dRoll = rng.int(1, 100) + def.defRoll;
  const hit = aRoll >= dRoll;
  const dmg = hit ? Math.max(1, att.atk - Math.floor(def.def / 2)) : 0;
  return { aRoll, dRoll, hit, dmg };
}

// 异步自动推演：A 先手与 B 交替出手，直到一方 hp ≤ 0 或达回合上限
export function simulateDuel(cardA, cardB, planA, planB, rng, maxRounds = 30) {
  const a = build(cardA, planA), b = build(cardB, planB);
  const rounds = [];
  let i = 0;
  while (a.hp > 0 && b.hp > 0 && i < maxRounds) {
    const sa = strike(a, b, rng); b.hp -= sa.dmg;
    const sb = b.hp > 0 ? strike(b, a, rng) : { aRoll:0, dRoll:0, hit:false, dmg:0 };
    a.hp -= sb.dmg;
    rounds.push({
      n: i + 1,
      a: { atkRoll: sa.aRoll, hit: sa.hit, dmg: sa.dmg, hpLeft: Math.max(0,b.hp) },
      b: { atkRoll: sb.aRoll, hit: sb.hit, dmg: sb.dmg, hpLeft: Math.max(0,a.hp) },
    });
    i++;
  }
  const winner = a.hp > b.hp ? 'A' : 'B';
  return { winner, rounds, finalA: Math.max(0,a.hp), finalB: Math.max(0,b.hp) };
}
