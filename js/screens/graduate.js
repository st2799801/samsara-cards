import { encodeCard } from '../cardcode.js';
import { addGraduate, load } from '../storage.js';
import { evalLoadout, getTrait } from '../engine/traits.js';
import { game } from '../state.js';
import { show, el, $ } from '../ui.js';

export function renderGraduate() {
  const card = game.run.card, root = $('#screen-graduate'); root.innerHTML = '';
  addGraduate(card);
  // addGraduate push 后 graduates 长度 - 1 即为本卡的下标
  const gradIndex = load().graduates.length - 1;
  const { sets, synergies } = evalLoadout(card.traits);
  root.append(el('h2', 'title', `${card.name} 毕业`));
  root.append(el('div', 'bio', card.bioText));
  root.append(el('div', 'stats', `攻 ${card.stats.atk} · 防 ${card.stats.def} · 命 ${card.stats.hp}`));
  root.append(el('div', 'traits', card.traits.map(id => {
    const t = getTrait(id);
    return t ? `【${t.name}】` : `【${id}】`;
  }).join(' ')));
  if (synergies.length) root.append(el('div', 'synergy', '奇效：' + synergies.map(s => s.name).join('、')));
  const code = encodeCard(card);
  const box = el('div', 'codebox', `<div class="label">卡码（可分享）</div><textarea readonly>${code}</textarea>`);
  root.append(box);
  const go = el('button', 'cta', '前 往 决 斗');
  go.onclick = () => {
    // 把仓库下标传入 duel 屏，供天梯赛撕卡使用
    import('./duel.js').then(m => m.renderDuel(card, gradIndex));
    show('screen-duel');
  };
  root.append(go);
}
