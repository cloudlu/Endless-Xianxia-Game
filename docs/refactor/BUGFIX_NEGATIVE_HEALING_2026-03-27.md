# Bug修复：治疗技能负数恢复值

**严重级别**: 🔴 Critical
**发现时间**: 2026-03-27
**修复时间**: 2026-03-27
**影响范围**: 所有使用治疗技能的战斗场景

---

## 🐛 问题描述

### 用户报告

测试服出现严重问题：
1. 治疗技能显示负数恢复值："-78.20000000000073点生命值！"
2. 玩家HP被异常削减：从1092变成580，无法恢复
3. 灵力变成0
4. 多次治疗尝试显示负数或0

### 战斗日志示例

```
恢复了-78.20000000000073点生命值！
恢复了-5.460000000000036点生命值！
恢复了0点生命值！
```

---

## 🔍 根本原因分析

### 问题定位

**CombatContextBuilder 使用错误的数据源**

在 [src/combat/CombatContextBuilder.js:29-30](../src/combat/CombatContextBuilder.js#L29-L30)：

```javascript
// ❌ 错误实现
return {
    hp: game.persistentState.player.hp,
    maxHp: game.persistentState.player.maxHp,  // ⚠️ 这是基础值，不含装备加成
    ...
}
```

### 数据不一致

游戏中存在两套HP数据：

1. **persistentState.player.maxHp** = 基础值（不含装备加成）
   - 例如：580

2. **getActualStats().maxHp** = 实际值（包含装备、buff等加成）
   - 例如：1092

### Bug触发机制

```javascript
// CombatEngine.calculateHealSkill 计算过程
const healAmount = Math.floor(player.maxHp * healPercentage);  // 580 * 0.01 = 5
const newHp = Math.min(player.hp + healAmount, player.maxHp); // Math.min(1092 + 5, 580) = 580
const actualHeal = newHp - player.hp;  // 580 - 1092 = -612 ❌ 负数！
```

**核心问题**：`player.hp` 是装备加成后的实际值（1092），但 `player.maxHp` 是基础值（580），导致治疗计算时 hp > maxHp，产生负数治疗量。

---

## ✅ 修复方案

### 1. 修复 CombatContextBuilder（优先级：🔴 Critical）

[src/combat/CombatContextBuilder.js:27-44](../src/combat/CombatContextBuilder.js#L27-L44)

```javascript
static buildPlayerContext(game, playerStats) {
    return {
        hp: game.persistentState.player.hp,
        maxHp: playerStats.maxHp,  // ✅ 使用包含装备/buff加成的实际maxHp
        // ... 其他属性
        energy: game.persistentState.player.energy,  // ✅ 添加energy字段
        // ✅ 添加防御/闪避状态
        defenseActive: game.persistentState.player.defenseActive || false,
        defenseBonusValue: game.persistentState.player.defenseBonusValue || 0,
        dodgeActive: game.persistentState.player.dodgeActive || false,
        dodgeBonus: game.persistentState.player.dodgeBonus || 0
    };
}
```

**关键修改**：
- `maxHp` 改用 `playerStats.maxHp`（即 `getActualStats().maxHp`）
- 添加 `energy` 字段（修复灵力为0的问题）
- 添加防御/闪避状态字段

### 2. 修复敌人战败HP恢复（优先级：🟡 High）

[combatlogic.js:871-880](../../combatlogic.js#L871-L880)

```javascript
// ✅ 使用实际maxHp（含装备加成）
const actualMaxHp = this.getActualStats().maxHp;
const hpRecovery = Math.floor(actualMaxHp * hpRecoveryPercent);
const actualHpRecovered = Math.min(hpRecovery, actualMaxHp - this.persistentState.player.hp);
```

### 3. 修复战败重置HP（优先级：🟡 High）

[combatlogic.js:984-986](../../combatlogic.js#L984-L986)

```javascript
// ✅ 使用实际maxHp（含装备加成）
const actualMaxHp = this.getActualStats().maxHp;
this.persistentState.player.hp = actualMaxHp;
```

### 4. 修复物品恢复HP（优先级：🟡 High）

[game.js:6589-6593](../../game.js#L6589-L6593)

```javascript
// ✅ 使用实际maxHp（含装备加成）
const actualMaxHp = this.getActualStats().maxHp;
const healAmount = Math.floor(actualMaxHp * item.value);
this.persistentState.player.hp = Math.min(this.persistentState.player.hp + healAmount, actualMaxHp);
```

---

## 🧪 测试验证

### 单元测试

```bash
npm test
✅ 299/299 tests passing
```

### 调试日志

添加了详细的调试日志到 `CombatEngine.calculateHealSkill`：

```javascript
console.log('🔧 [calculateHealSkill] 输入参数:', {
    playerHp: player.hp,
    playerMaxHp: player.maxHp,
    healPercentage: skillData.healPercentage,
    energy: player.energy,
    energyCost: skillData.energyCost
});

console.log('🔧 [calculateHealSkill] 计算过程:', {
    healAmount,
    newHp,
    actualHeal,
    'hp > maxHp?': player.hp > player.maxHp
});
```

---

## 📊 影响范围

### 受影响功能

1. ✅ **治疗技能** - 所有治疗类技能
2. ✅ **敌人战败恢复** - 战斗胜利后的35%HP恢复
3. ✅ **战败重置** - 战斗失败后的HP重置
4. ✅ **物品使用** - 使用恢复类物品

### 修复前后对比

| 场景 | 修复前 | 修复后 |
|------|--------|--------|
| 玩家基础maxHp | 580 | 580 |
| 装备加成后maxHp | 1092 | 1092 |
| CombatContext.maxHp | 580 ❌ | 1092 ✅ |
| 治疗百分比 | 1% | 1% |
| 计算治疗量 | 5.8 → 5 | 10.92 → 10 |
| 实际hp | 1092 | 1092 |
| newHp计算 | Math.min(1097, 580) = 580 ❌ | Math.min(1102, 1092) = 1092 ✅ |
| actualHeal | 580 - 1092 = **-612** ❌ | 1092 - 1092 = **0** ✅ |

---

## 🎓 经验教训

### 1. 数据源一致性

**问题**：游戏中存在基础值和实际值两套数据，容易混淆。

**最佳实践**：
- ✅ **CombatContext 应该使用实际值**（包含装备、buff等加成）
- ✅ **persistentState 存储基础值**，用于存档
- ✅ **getActualStats() 计算实际值**，用于战斗计算

### 2. 纯函数式迁移的风险

**问题**：迁移到纯函数式架构时，需要确保上下文构建的正确性。

**最佳实践**：
- ✅ **渐进式迁移** - 新旧代码并存，逐步替换
- ✅ **对比测试** - 同时运行新旧代码，对比结果
- ✅ **详细日志** - 添加调试日志，记录输入输出

### 3. 测试覆盖不足

**问题**：单元测试未发现此bug，因为测试用例使用的是模拟数据，hp和maxHp是一致的。

**改进方案**：
- ✅ **添加集成测试** - 使用真实game对象构建上下文
- ✅ **边界条件测试** - 测试 hp > maxHp 的异常情况
- ✅ **装备系统测试** - 测试装备加成后的HP计算

---

## 🔮 后续工作

1. **添加集成测试** - 测试装备加成后的HP计算
2. **代码审查** - 检查是否还有其他地方使用了错误的maxHp
3. **监控日志** - 观察修复后的控制台输出，确保治疗值正常
4. **性能优化** - 缓存 `getActualStats()` 结果，避免重复计算

---

**修复人**: Claude Code
**审核人**: 待审核
**测试状态**: ✅ 299/299 tests passing
**部署状态**: 🟡 待部署到测试服验证
