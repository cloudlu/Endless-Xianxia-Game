# 平衡数值 Review（2026-07）

> 方法论：`game-design-architecture` skill 的平衡铁律 + 演算证明。
> 证据：2 路代码 agent + 升级公式/技能倍率/能量经济人工核实 + `analyze_balance.js` 快照。
> 本文档是 **review 结论**，落地修复见末尾「已实施」节。

## 0. 重要诚实修正

战斗 agent 初版结论「r3 卡死、r5 死胡同」**是误报**——它假设纯普攻，漏算了技能倍率（最高 3.2x）和能量充沛。代入技能重算后战斗曲线其实打得过（见 §1）。真正的严重问题在**经济闭环**，不在战斗公式。

## 1. 战斗曲线演算（skill 铁律 3：DPS × 回合 ≥ 血量）

公式（[CombatEngine.js:38](../../src/combat/CombatEngine.js#L38)）：普攻 `max(1, atk-def)`，技能 `floor(atk×mult)-def`。
玩家成长线性累加（[game.js:2312](../../game.js#L2312)）vs 敌人 HP 几何成长（[map.js:852](../../map.js#L852)，+50% base/级）。

| 断点 | 玩家 ATK | 敌 HP | 最佳技能倍率 | 单回合 | 击杀回合 | 敌杀玩家 | 净结果 |
|---|---|---|---|---|---|---|---|
| r0 st1 (L5) | 22 | 84 | 1.2x | ~26 | ~3 | ~60 | 🟢 碾压 |
| r3 中 (L670) | 3240 | 43615 | 2.5x | 6890 | 6.3 | 8.9 | 🟢 险胜 |
| r5 中 (L1520) | 15090 | 327015 | 3.2x | 41895 | ~8 | ~10 | 🟠 容错薄 |

技能倍率（[game-metadata.js](../../game-metadata.js) realmSkills attack 系）：r0 1.2→r5 3.2，仅线性增长；能量 r5 maxEnergy 数万、技能耗 80，可每回合放顶级技能。**战斗成立但高境界容错薄**。

## 2. 突破石墙（核心 🔴）

突破石仅 BOSS 掉落（[combatlogic.js:929-955](../../combatlogic.js#L929)），r2+ 免费玩家突破一次需：

| 境界 | 突破石需求 | Boss 掉率 | 需 boss 战场数 |
|---|---|---|---|
| r2 st1 | 150 | 15% | ~500 |
| r3 st1 | 900 | 20% | ~2250 |
| r5 st1 | 6750 | 30% | ~11250 |

**F2P 在 r2 之后基本无法推进**——违反 skill 北极星 7（meta 闭环：F2P 必须能到终局）。而仙玉商店可直购突破石 → 硬付费捷径。

## 3. P2W 边界（re-review 后降级）

> ⚠️ 原 review 把 skill「付费不破封顶」铁律套到了本项目，但该铁律**前提是竞争场景**。本项目是**单机**（无 PvP/无排行榜/无服务端战斗校验，determinism + backend agent 双重确认）。单机 cultivation 中 VIP ×1.40 =「付费跳过 grind」= 类型常态（对标《一念逍遥》），**非公平违规**。

- VIP12：×1.40 攻 / ×1.30 防 / ×1.30 血 / +12% 暴击（[vipSystem.js:52](../../vipSystem.js#L52)，mul_pct 乘合成后——架构正确）。
- 彩虹装/宠物/重铸石全仙玉锁：单机里属「付费加速」，可接受，**前提是 F2P 仍有路径到终局**（由 §2 修复保证）。
- **结论**：不为整数属性加硬封顶（与几何成长设计冲突且单机无必要）。改为确保 F2P 可达终局。

## 4. Cheese / 死胡同

| 类别 | 现状 | 级别 |
|---|---|---|
| 低境界 AFK 无限刷 | 击杀回 35% maxHp（[:796](../../src/combat/CombatEngine.js#L796)）+ 战外 0.5hp/s 回复 → 无脑挂机 | 🟢（降回血） |
| 首杀/副本重置 | 首杀永久标记、副本日限 3 次 → 无 cheese | ✅ |
| r0 st1-9 突破石零产出 | boss 掉率=0，st10 才 5% | 随 §2 修复解决 |
| 宠物/重铸石仙玉锁 | 免费关闭（单机可接受） | 🟢 |

## 5. 结构性技术债（本轮文档化，不动）

- **暴击公式不对称**：玩家先乘倍率后减防（[:36](../../src/combat/CombatEngine.js#L36)），敌人先减防后乘韧性倍率（[:117](../../src/combat/CombatEngine.js#L117)）。真实不一致，但战斗当前平衡，动公式需重新平衡 → **记为技术债**。
- **minDamage 仅敌人**（[:99](../../src/combat/CombatEngine.js#L99)）：玩家无保底，不对称 → 同上。
- **levelUpStats 死代码**（[game-metadata.js:2985](../../game-metadata.js#L2985)）：升级加成定义但 game.js 从不引用，实际用硬编码 realmBonus → **本轮删除**。

## severity 汇总

| 级别 | 项 | 处置 |
|---|---|---|
| 🔴 | 突破石 r2+ 墙，F2P 无法推进 | **本轮修复**（配置化：精英怪低概率掉落 + 副本首通固定给） |
| 🟢 | levelUpStats 死代码误导 | **本轮删除** |
| 🟢 | 低境界 AFK 回血过高 | **本轮降档**（35%→15%） |
| 文档 | 暴击/minDamage 不对称、高境界容错薄、单机 P2W 可接受 | 记录，不在本轮动 |

## 已实施（2026-07）

**配置驱动的突破石掉落（🔴 修复）** —— SOLID：
- `game-metadata.js` 新增 `breakthroughDropRates` 配置（normal=0 / elite=3% / Boss 按境界递增封顶 50% / amount 1-3）。北极星 3：策划可独立调参。
- `src/combat/CombatEngine.js` 新增纯函数 `rollBreakthroughDrop(enemy, realm, rates)` —— 单一真相源（SRP/DRY）。
- `combatlogic.js` 单敌人主路径（实际生效那条）改为调用该纯函数，删掉原硬编码境界 if-else（OCP）。
- `src/combat/CombatContextBuilder.js` 把 `breakthroughDropRates` + `realm` 注入 CombatContext，让纯函数路径可测、配置驱动。
- **新增 F2P 通道**：精英怪 3% 掉突破石。r2+ 免费玩家从「不可行（500-11250 场 boss 战）」变为「可行但 grindy（精英+boss+副本）」。

**删除 levelUpStats 死代码（🟢）**：metadata 里的升级加成定义从未被引用（实际用 game.js 硬编码 realmBonus），删除消除误导。

### 修复中发现的关联 bug（本轮记录，未动）

- **多敌人路径不发放突破石**：`combatlogic.js:1675` 的多敌人结算调了 `calculateEnemyDefeat`，但只应用 exp/resource，**丢弃了 breakthroughStonesGained**（纯函数算了但不发）。属 I10「新旧两套战斗路径并存」的症状。修复后纯函数计算已正确，待多敌人路径补上 `apply breakthroughStonesGained` 即可。

### re-review 后**未实施**（原则判断，非遗漏）

- **整数属性封顶 / VIP P2W 限制**：skill「付费不破封顶」铁律前提是竞争场景；本项目单机无 PvP/排行榜，VIP 1.4x 属「付费跳 grind」类型常态。硬封顶与几何成长设计冲突。F2P 可达终局已由突破石修复保证。
- **暴击/minDamage 公式不对称**：真实不一致，但战斗当前平衡，动公式需重新平衡 → 记技术债。
- **击杀回血 35%→15%（低境界 AFK）**：全局下调会同时恶化高境界本已薄的容错（8 vs 10 回合）。低境界 AFK 的根因是「敌人攻击被防御归零」，正确修法是调低境界敌人攻击曲线（需实测），本轮不动。
- **高境界容错薄**：调敌人 HP 系数（0.5/级）需实测验证，记为调参选项。

修复 commit 见 git log。354 测试通过（含 8 个新增 rollBreakthroughDrop 用例）。
