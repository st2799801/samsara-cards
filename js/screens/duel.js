import { OPPONENTS } from '../data/opponents.data.js';
import { simulateDuel } from '../engine/combat.js';
import { decodeCard } from '../cardcode.js';
import { removeGraduate } from '../storage.js';
import { game } from '../state.js';
import { show, el, $ } from '../ui.js';

export function renderDuel(myCard) {
  const root = $('#screen-duel'); root.innerHTML = '';
  root.append(el('h2', 'title', '选择对手'));
  // 对手列表
  OPPONENTS.forEach(opp => {
    const c = el('div', 'skill pick', `<div class="sk-name">${opp.name}（${'★'.repeat(opp.tier)}）</div>
      <div class="sk-desc">攻${opp.stats.atk}·防${opp.stats.def}·命${opp.stats.hp}</div>`);
    c.onclick = () => arrange(root, myCard, opp);
    root.append(c);
  });
  // 卡码导入
  const imp = el('div', 'codebox', `<div class="label">或贴入对手卡码</div><textarea id="opp-code" placeholder="SC1.xxx..."></textarea>`);
  const ib = el('button', 'btn', '导入对手');
  ib.onclick = () => {
    const codeEl = $('#opp-code');
    const o = decodeCard(codeEl ? codeEl.value.trim() : '');
    if (o) arrange(root, myCard, o);
    else alert('卡码无效');
  };
  imp.append(ib);
  root.append(imp);
}

function arrange(root, myCard, opp) {
  root.innerHTML = '';
  root.append(el('h2', 'title', `对阵 ${opp.name}`));
  let style = 'counter';
  const styles = [['aggro', '激进'], ['guard', '保守'], ['counter', '克制']];
  const row = el('div', 'styles');
  styles.forEach(([k, label]) => {
    const b = el('button', 'btn', label);
    b.onclick = () => {
      style = k;
      row.querySelectorAll('button').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
    };
    row.append(b);
  });
  root.append(el('div', 'label', '选择打法'), row);
  const fight = el('button', 'cta', '开 打');
  fight.onclick = () => {
    const planA = { style, order: myCard.traits };
    const planB = { style: 'counter', order: opp.traits || [] };
    const res = simulateDuel(myCard, opp, planA, planB, game.rng);
    playback(root, res, myCard);
  };
  root.append(fight);
}

function playback(root, res, myCard) {
  root.innerHTML = '';
  root.append(el('h2', 'title', '战报'));
  const log = el('div', 'battlelog');
  res.rounds.forEach(rd => {
    log.append(el('div', 'rd',
      `第 ${rd.n} 回合：我 ${rd.a.hit ? `命中 -${rd.a.dmg}` : '未中'}（敌剩 ${rd.a.hpLeft}）｜敌 ${rd.b.hit ? `命中 -${rd.b.dmg}` : '未中'}（我剩 ${rd.b.hpLeft}）`
    ));
  });
  root.append(log);
  const win = res.winner === 'A';
  root.append(el('div', win ? 'death ok' : 'death', win ? '胜！角色升星。' : '败。天梯赛中此卡将被撕毁。'));
  if (win) {
    myCard.stars++;
    myCard.record.win++;
  } else {
    myCard.record.lose++;
  }
  const back = el('button', 'cta', '返回');
  back.onclick = () => {
    import('./home.js').then(m => m.renderHome());
    show('screen-home');
  };
  root.append(back);
}
