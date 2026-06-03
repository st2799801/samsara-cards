import { generateSurvivor } from '../engine/gen.js';
import { startRun } from '../engine/run.js';
import { getTrait } from '../engine/traits.js';
import { game } from '../state.js';
import { show, el, $ } from '../ui.js';

export function renderHome() {
  const root = $('#screen-home'); root.innerHTML = '';
  root.append(el('h1', 'title', '轮 回 · 撕 卡'));
  const btn = el('button', 'cta', '掷 骰 · 生 成 幸 存 者');
  const panel = el('div', 'reveal');
  panel.style.display = 'none';
  btn.onclick = () => {
    const card = generateSurvivor(game.rng);
    game.draftCard = card;
    const t = getTrait(card.traits[0]);
    panel.innerHTML = `
      <div class="name">${card.name}<small>「${card.nick}」</small></div>
      <div class="bio">${card.bioText}</div>
      <div class="skill">
        <div class="sk-name">【${t ? t.name : card.traits[0]}】</div>
        <div class="sk-desc">${t ? t.text : ''}</div>
      </div>
      <div class="stats">攻 ${card.stats.atk} · 防 ${card.stats.def} · 命 ${card.stats.hp}</div>`;
    panel.style.display = 'block';
    const go = el('button', 'cta', '进 入 轮 回');
    go.onclick = () => {
      game.run = startRun(card, 0);
      import('./dungeon.js').then(m => m.renderDungeon());
      show('screen-dungeon');
    };
    panel.append(go);
  };
  root.append(btn, panel);
}
