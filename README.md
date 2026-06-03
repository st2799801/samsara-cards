# 轮回·撕卡

无限流 roguelike 养成 + 词条 build + 异步卡牌赌斗。纯静态网页，无后端。

掷骰生成一名幸存者 → 闯轮回副本（文本事件流，靠词条过判定）→ 攒强化点、三选一凑 build → 连续活过 4 轮毕业成卡 → 拿卡赛前布阵、自动推演决斗 → 赢了升星、天梯赛输了撕卡。所有判定都走「上帝的骰子」，掷骰结果全程透明可见。

## 玩法要点

- **上帝的骰子**：事件判定、词条触发、决斗每回合都掷骰对阈值，词条和属性加减骰面。
- **流派与联动**：5 流派（嗜血 / 机巧 / 诡异 / 天命 / 不死），同流派凑套数触发套装强化，特定跨流派组合触发隐藏「奇效」。
- **撕卡赌注**：练习赛输了卡安全；天梯赛输了角色卡永久销毁。
- **卡码分享**：毕业卡可导出成一段卡码，贴给别人即可互斗（异步）。

## 本地运行

需要一个静态服务器（因为用了 ES Module，直接双击打开会被浏览器拦）：

```bash
cd projects/samsara-cards
python3 -m http.server 8124
# 浏览器打开 http://localhost:8124/
```

## 跑测试

逻辑层（骰子、词条、生成、副本、决斗、卡码）有 Node 单测：

```bash
npm test
```

## 目录结构

```
js/rng.js          上帝的骰子（可种子化 RNG）
js/engine/         纯逻辑：traits 词条求值 / gen 幸存者生成 / run 副本 / combat 决斗
js/data/           纯数据：traits / bios / names / dungeons / opponents
js/screens/        四个屏幕：home / dungeon / graduate / duel
js/ui.js js/state.js js/cardcode.js js/storage.js js/main.js
tests/             Node 单测
```

逻辑层与数据层零 DOM，可在 Node 下单测；UI 层只做渲染与事件绑定。

## 部署

纯静态站点，部署到 GitHub Pages：把本目录内容作为仓库根（或配置 Pages 指向子目录），在仓库 Settings → Pages 选分支即可。

## 设计文档

- 设计 spec：`../../docs/superpowers/specs/2026-06-03-samsara-cards-design.md`
- 实现计划：`../../docs/superpowers/plans/2026-06-03-samsara-cards.md`
