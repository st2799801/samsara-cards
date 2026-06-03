import { group, eq, ok } from './assert.js';
import { makeRng } from '../js/rng.js';

group('rng', () => {
  const r = makeRng(12345);
  const a = r.int(1, 100);
  ok(a >= 1 && a <= 100, 'int 落在范围内');

  // 同种子 → 同序列（可复现，便于测试）
  const r1 = makeRng(7), r2 = makeRng(7);
  eq([r1.int(1,6), r1.int(1,6)], [r2.int(1,6), r2.int(1,6)], '同种子同序列');

  // pick 从数组取一个元素
  ok(['a','b','c'].includes(makeRng(1).pick(['a','b','c'])), 'pick 返回数组元素');

  // check：掷 d100 + mod ≥ threshold → {success, roll, total}
  const c = makeRng(1).check({ threshold: 0, mod: 0 });
  ok(c.success === true && c.roll >= 1 && c.roll <= 100, 'threshold 0 必成功');
  const c2 = makeRng(1).check({ threshold: 101, mod: 0 });
  ok(c2.success === false, 'threshold 101 必失败');
});
