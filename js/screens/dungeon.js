import { DUNGEONS, resolveCheck } from '../engine/run.js';
import { TRAITS } from '../data/traits.data.js';
import { getTrait } from '../engine/traits.js';
import { game } from '../state.js';
import { show, el, $ } from '../ui.js';

export function renderDungeon() {
  const run = game.run, root = $('#screen-dungeon'); root.innerHTML = '';
  const dungeon = DUNGEONS[run.dungeonIndex % DUNGEONS.length];
  root.append(el('div', 'cycle', `第 ${run.cycle} / 4 轮 · ${dungeon.title}`));
  root.append(el('div', 'hpbar', `命 ${run.card.stats.hp}`));
  const node = dungeon.nodes[run.nodeIndex];

  if (!node) { offerTraitPick(root); return; }      // 副本走完 → 三选一
  root.append(el('p', 'event', node.text));

  if (node.type === 'text') {
    const next = el('button', 'btn', '继续');
    next.onclick = () => { run.nodeIndex++; renderDungeon(); };
    root.append(next);
  } else { // check
    const act = el('button', 'btn', '应 对（掷骰）');
    act.onclick = () => {
      const r = resolveCheck(run, node, game.rng);
      const last = run.log[run.log.length - 1];
      root.append(el('div', r.success ? 'roll ok' : 'roll bad',
        `掷出 ${r.roll}${r.mod ? ` + 词条 ${r.mod}` : ''} = ${r.total}，需 ≥ ${r.threshold} → ${r.success ? '成功' : '失败'}<br>${last.text || ''}`));
      if (!run.alive) return death(root);
      const next = el('button', 'btn', '继续');
      next.onclick = () => { run.nodeIndex++; renderDungeon(); };
      root.append(next);
      act.disabled = true;
    };
    root.append(act);
  }
}

function offerTraitPick(root) {
  const run = game.run;
  const pool = TRAITS.filter(t => !run.card.traits.includes(t.id));
  const picks = [];
  const rng = game.rng;
  while (picks.length < 3 && pool.length) {
    picks.push(pool.splice(rng.int(0, pool.length - 1), 1)[0]);
  }
  root.append(el('div', 'label', '强化点 ＋3 · 三选一'));
  picks.forEach(t => {
    const c = el('div', 'skill pick', `<div class="sk-name">【${t.name}】</div><div class="sk-desc">${t.text}</div>`);
    c.onclick = () => {
      run.card.traits.push(t.id);
      run.nodeIndex = 0;
      run.cycle++;
      run.dungeonIndex++;
      if (run.cycle > 4) {
        import('./graduate.js').then(m => m.renderGraduate());
        show('screen-graduate');
      } else {
        renderDungeon();
      }
    };
    root.append(c);
  });
}

function death(root) {
  root.append(el('div', 'death', '你死在了这一轮。撕卡——重新掷骰。'));
  const back = el('button', 'cta', '重新开始');
  back.onclick = () => {
    game.run = null;
    import('./home.js').then(m => m.renderHome());
    show('screen-home');
  };
  root.append(back);
}
