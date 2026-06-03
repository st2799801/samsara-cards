import { OPPONENTS } from '../data/opponents.data.js';
import { simulateDuel } from '../engine/combat.js';
import { decodeCard } from '../cardcode.js';
import { removeGraduate } from '../storage.js';
import { game } from '../state.js';
import { show, el, $ } from '../ui.js';

// gradIndex：该毕业卡在 localStorage 仓库里的下标；
// 天梯赛败北时用于 removeGraduate(gradIndex) 永久撕卡。
// 从内置对手池导入的卡（非玩家 graduates）无 gradIndex，传 -1 即可（仅影响撕卡逻辑）。
export function renderDuel(myCard, gradIndex = -1) {
  const root = $('#screen-duel'); root.innerHTML = '';
  root.append(el('h2', 'title', '选择赛制'));

  // ── 赛制选择 ──
  let mode = null; // 'practice' | 'ranked'
  const modeRow = el('div', 'styles');

  const btnPractice = el('button', 'btn', '练习赛（不撕卡）');
  const btnRanked   = el('button', 'btn', '天梯赛（输了撕卡）');

  const selectMode = (chosen) => {
    mode = chosen;
    [btnPractice, btnRanked].forEach(b => b.classList.remove('on'));
    (chosen === 'practice' ? btnPractice : btnRanked).classList.add('on');
    modeHint.textContent = chosen === 'practice'
      ? '练习赛：败北只记败绩，此卡安全。'
      : '天梯赛：败北此卡将被永久撕毁，不可恢复。';
  };

  btnPractice.onclick = () => selectMode('practice');
  btnRanked.onclick   = () => selectMode('ranked');
  modeRow.append(btnPractice, btnRanked);

  const modeHint = el('div', 'label', '请先选择赛制');
  root.append(el('div', 'label', '赛制'), modeRow, modeHint);

  // ── 分割线 ──
  root.append(el('hr', 'divider'));
  root.append(el('h2', 'title', '选择对手'));

  // 对手列表
  OPPONENTS.forEach(opp => {
    const c = el('div', 'skill pick', `<div class="sk-name">${opp.name}（${'★'.repeat(opp.tier)}）</div>
      <div class="sk-desc">攻${opp.stats.atk}·防${opp.stats.def}·命${opp.stats.hp}</div>`);
    c.onclick = () => {
      if (!mode) { alert('请先选择赛制'); return; }
      arrange(root, myCard, opp, mode, gradIndex);
    };
    root.append(c);
  });

  // 卡码导入
  const imp = el('div', 'codebox', `<div class="label">或贴入对手卡码</div><textarea id="opp-code" placeholder="SC1.xxx..."></textarea>`);
  const ib = el('button', 'btn', '导入对手');
  ib.onclick = () => {
    if (!mode) { alert('请先选择赛制'); return; }
    const codeEl = $('#opp-code');
    const o = decodeCard(codeEl ? codeEl.value.trim() : '');
    if (o) arrange(root, myCard, o, mode, gradIndex);
    else alert('卡码无效');
  };
  imp.append(ib);
  root.append(imp);
}

function arrange(root, myCard, opp, mode, gradIndex) {
  root.innerHTML = '';
  const modeLabel = mode === 'practice' ? '练习赛' : '天梯赛';
  root.append(el('h2', 'title', `【${modeLabel}】对阵 ${opp.name}`));
  if (mode === 'ranked') {
    root.append(el('div', 'death', '⚠ 天梯赛：败北此卡将被永久撕毁'));
  }
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
    playback(root, res, myCard, mode, gradIndex);
  };
  root.append(fight);
}

function playback(root, res, myCard, mode, gradIndex) {
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
  if (win) {
    myCard.stars++;
    myCard.record.win++;
    root.append(el('div', 'death ok', '胜！角色升星。'));
  } else {
    myCard.record.lose++;
    if (mode === 'ranked' && gradIndex >= 0) {
      // 天梯赛败北：永久撕卡
      removeGraduate(gradIndex);
      root.append(el('div', 'death', '败。【此卡已被撕毁，永久消失。】'));
    } else {
      // 练习赛败北：仅记录败绩，不撕卡
      root.append(el('div', 'death', '败。（练习赛，此卡安全。）'));
    }
  }

  const back = el('button', 'cta', '返回');
  back.onclick = () => {
    import('./home.js').then(m => m.renderHome());
    show('screen-home');
  };
  root.append(back);
}
