const KEY = 'samsara-cards.v1';
const empty = { graduates: [], points: 0 };

export function load() {
  try { return { ...empty, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; }
  catch { return { ...empty }; }
}
export function save(data) { localStorage.setItem(KEY, JSON.stringify(data)); }
export function addGraduate(card) { const d = load(); d.graduates.push(card); save(d); return d; }
export function removeGraduate(index) { const d = load(); d.graduates.splice(index, 1); save(d); return d; } // 撕卡
