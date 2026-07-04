# CombatEngine 迁移方法分析

## 无需迁移的方法

### clearBattleStates
**原因**: 这是一个纯副作用方法，修改游戏状态，不涉及计算逻辑
**文件**: combatlogic.js:1177
**状态**: ❌ 无需迁移（应保留在game.js中）

**内容**:
- 清理玩家战斗状态（护盾、防御、闪避、Buff等）
- 清理敌人战斗状态（Debuff）
- 移除防御特效

**结论**: 此方法应该保留在game.js中，不需要迁移到纯函数式CombatEngine

---

## 需要迁移的方法分类

### 1. 计算类方法（适合纯函数式）✅
- ✅ calculatePlayerAttack - 已完成
- ✅ calculateEnemyAttack - 已完成（在CombatEngine中）
- ⏳ triggerEnemyCounterattack - 需要迁移
- ⏳ useSkill - 需要迁移

### 2. 结果处理方法（部分纯函数式）⏳
- ⏳ enemyDefeated - 部分迁移（计算部分）
- ⏳ playerDefeated - 部分迁移（计算部分）

### 3. Buff/Debuff方法（混合）
- ⏳ processBuffsAtTurnStart - 可迁移计算部分
- ⏳ processBuffDecay - 可迁移计算部分
- ⏳ processSkillEffects - 可迁移计算部分

### 4. UI/状态管理方法（不适合迁移）❌
- ❌ clearBattleStates - 纯副作用，保留在game.js
- ❌ closeBattleModal - UI方法，保留在game.js
- ❌ showEnemyDefeatedAnimation - UI方法，保留在game.js

### 5. 自动战斗方法（简单包装）
- ⏳ toggleAutoBattle - 简单逻辑
- ⏳ startAutoBattle - 简单逻辑
- ⏳ stopAutoBattle - 简单逻辑

### 6. 工具方法
- ✅ getSkillElementType - 已完成