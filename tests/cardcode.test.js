import { group, eq, ok } from './assert.js';
import { encodeCard, decodeCard } from '../js/cardcode.js';

group('cardcode', () => {
  const card = { name:'陈阿炳', bioId:'butcher', stats:{atk:10,def:9,hp:40}, traits:['bite','rage'], stars:1, record:{win:2,lose:0} };
  const code = encodeCard(card);
  ok(typeof code === 'string' && code.length > 0, '编码出字符串');
  eq(decodeCard(code), card, '解码还原');
  eq(decodeCard('not-a-valid-code'), null, '非法卡码返回 null');
});
