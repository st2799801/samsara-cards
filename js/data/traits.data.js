export const SCHOOLS = {
  blood:  { name: '嗜血', color: '#e7707a' },
  mech:   { name: '机巧', color: '#7fb6d6' },
  weird:  { name: '诡异', color: '#b89be0' },
  fate:   { name: '天命', color: '#e0c66a' },
  undead: { name: '不死', color: '#86b58a' },
};

// mods 影响决斗结算：atk/def/hp 直接加成；atkRoll/defRoll 加减骰面
export const TRAITS = [
  { id:'bite',    name:'撕咬',     school:'blood',  text:'攻击概率附带流血，目标越虚弱伤害越高', mods:{atk:+2, atkRoll:+5} },
  { id:'rage',    name:'暴怒',     school:'blood',  text:'受伤后攻击提升',                       mods:{atk:+3} },
  { id:'regen',   name:'再生',     school:'blood',  text:'每回合恢复少量生命',                   mods:{hp:+6} },
  { id:'frenzy',  name:'狂化',     school:'blood',  text:'血量越低攻击越高',                     mods:{atk:+2} },
  { id:'savage',  name:'撕扯',     school:'blood',  text:'暴击时追加流血',                       mods:{atkRoll:+4} },

  { id:'armor',   name:'护甲',     school:'mech',   text:'开局护盾，每回合修复少量',             mods:{def:+5} },
  { id:'trap',    name:'陷阱',     school:'mech',   text:'对手出手有概率被陷阱削弱',             mods:{defRoll:+5} },
  { id:'bomb',    name:'自爆装置', school:'mech',   text:'濒死时引爆，对双方造成伤害',           mods:{atk:+4} },
  { id:'volley',  name:'连射',     school:'mech',   text:'有概率追加一次攻击',                   mods:{atkRoll:+3} },
  { id:'plating', name:'装甲板',   school:'mech',   text:'减少受到的伤害',                       mods:{def:+4} },

  { id:'illusion',name:'幻觉',     school:'weird',  text:'概率让对手攻击落空、误伤自己人',       mods:{defRoll:+6} },
  { id:'fear',    name:'恐惧',     school:'weird',  text:'降低对手命中',                         mods:{defRoll:+4} },
  { id:'soulrip', name:'夺魂',     school:'weird',  text:'攻击吸取对手生命',                     mods:{atk:+3} },
  { id:'mindblk', name:'心障',     school:'weird',  text:'概率使对手本回合无法行动',             mods:{atkRoll:+3} },
  { id:'whisper', name:'低语',     school:'weird',  text:'每回合小幅削弱对手攻击',               mods:{defRoll:+3} },

  { id:'dodge',   name:'闪避',     school:'fate',   text:'概率完全闪开一次攻击',                 mods:{defRoll:+7} },
  { id:'crit',    name:'暴击',     school:'fate',   text:'概率造成双倍伤害',                     mods:{atkRoll:+7} },
  { id:'revive',  name:'起死回生', school:'fate',   text:'死亡时概率以少量生命复活一次',         mods:{hp:+4} },
  { id:'halo',    name:'主角光环', school:'fate',   text:'濒死时一次概率免疫致命伤',             mods:{def:+2} },
  { id:'fortune', name:'气运',     school:'fate',   text:'所有判定骰面小幅提升',                 mods:{atkRoll:+3, defRoll:+3} },

  { id:'poison',  name:'中毒',     school:'undead', text:'攻击叠加中毒，持续掉血',               mods:{atkRoll:+4} },
  { id:'corrode', name:'腐蚀',     school:'undead', text:'攻击削减对手护甲并叠加中毒',           mods:{atk:+2, atkRoll:+3} },
  { id:'sacrifice',name:'献祭',    school:'undead', text:'消耗自身生命换取爆发攻击',             mods:{atk:+5, hp:-3} },
  { id:'zombify', name:'僵尸化',   school:'undead', text:'生命归零后短暂续战',                   mods:{hp:+5} },
  { id:'rot',     name:'尸毒',     school:'undead', text:'对手中毒时其攻击下降',                 mods:{defRoll:+4} },
];

// 套装联动：同流派持有件数达到阈值 → 额外加成
export const SET_BONUS = {
  blood:  [{ need:2, mods:{atk:+3} },  { need:4, mods:{atk:+8, atkRoll:+5} }],
  mech:   [{ need:2, mods:{def:+3} },  { need:4, mods:{def:+8, defRoll:+5} }],
  weird:  [{ need:2, mods:{defRoll:+4} }, { need:4, mods:{defRoll:+10} }],
  fate:   [{ need:2, mods:{atkRoll:+3, defRoll:+3} }, { need:4, mods:{atkRoll:+8, defRoll:+8} }],
  undead: [{ need:2, mods:{atkRoll:+4} }, { need:4, mods:{atk:+6, atkRoll:+6} }],
};

// 跨流派奇效：持有全部 requires 中的词条 → 命名特效（隐藏，发掘乐趣）
export const SYNERGY = [
  { id:'mutual_destruction', name:'玉石俱焚', requires:['rage','bomb'],   mods:{atk:+10} },
  { id:'last_stand',         name:'绝境翻盘', requires:['fear','halo'],   mods:{def:+6, atkRoll:+6} },
  { id:'plague_lord',        name:'瘟疫之主', requires:['poison','soulrip'], mods:{atk:+8} },
  { id:'ghost_armor',        name:'鬼甲',     requires:['illusion','armor'], mods:{def:+8, defRoll:+8} },
];
