# 事件驱动的组合更新原则

## 核心原则

**任何影响玩家属性的事件，都必须包含 `playerStats` 更新**

## 为什么需要组合更新？

当某个系统发生变化时，可能会影响多个UI组件。例如：

1. **玩家升级**：
   - 基础属性提升（攻击、防御、生命等）→ 更新 `playerStats`
   - 等级显示变化 → 更新 `expAndLevel`
   - 可能突破境界限制 → 更新 `realm`
   - **组合更新**：`playerStats` + `expAndLevel` + `realm`

2. **玩家突破**：
   - 境界加成提升 → 更新 `playerStats`
   - 境界显示变化 → 更新 `realm`
   - 等级显示变化 → 更新 `expAndLevel`
   - 消耗突破石 → 更新 `resource`
   - **组合更新**：`playerStats` + `expAndLevel` + `realm` + `resource`

3. **充值成功**：
   - VIP等级可能提升 → VIP加成提升 → 更新 `playerStats`
   - 仙玉增加 → 更新 `resource`
   - VIP显示变化 → 更新 `vip`
   - **组合更新**：`playerStats` + `resource` + `vip`

## 属性影响链

```
装备系统 ────┐
            │
VIP系统  ────┼──→ equipmentEffects ───┐
            │                           │
境界系统 ────┘                           │
                                        ├──→ getActualStats() ───→ playerStats
基础属性 ────────────────────────────────┘
```

### 属性影响源

1. **基础属性** (`persistentState.player`)
   - `attack`, `defense`, `speed`, `luck`, `hp`, `maxHp`, `maxEnergy`
   - 来源：初始创建、升级、突破

2. **装备效果** (`equipmentEffects`)
   - 来源：装备系统、VIP加成
   - 缓存机制：通过 getter 自动缓存
   - 清除时机：装备改变、VIP升级

3. **境界加成** (`realmBonus`)
   - 来源：境界系统
   - 计算：`calculateRealmBonus()`

4. **VIP加成** (`vipBonus`)
   - 来源：VIP系统
   - 在 `calculateEquipmentEffects()` 中计算

## 事件到UI更新的映射

| 事件 | playerStats | expAndLevel | realm | resource | vip | energy | healthBars |
|------|------------|------------|-------|----------|-----|--------|------------|
| `player:levelup` | ✅ | ✅ | ✅ | | | | |
| `player:breakthrough` | ✅ | ✅ | ✅ | ✅ | | | |
| `recharge:success` | ✅ | | | ✅ | ✅ | | |
| `equipment:equip` | ✅ | | | | | | |
| `equipment:check` | ✅ | | | | | | |
| `map:change` | | | | ✅ | | ✅ | |
| `battle:victory` | ✅ | ✅ | | ✅ | | | |
| `battle:damage` | | | | | | | ✅ |
| `battle:energy` | | | | | | ✅ | |

## 什么时候需要包含 `playerStats`？

**需要包含的场景：**

1. ✅ **升级** - 基础属性提升
2. ✅ **突破** - 境界加成提升
3. ✅ **装备改变** - 装备效果提升
4. ✅ **VIP升级** - VIP加成提升
5. ✅ **药水效果消失** - 临时属性加成消失

**不需要包含的场景：**

1. ❌ **地图切换** - 只消耗灵力，不影响属性
2. ❌ **普通战斗** - 只改变HP/灵力，不影响基础属性
3. ❌ **购买物品** - 只改变资源，不影响属性

## 缓存管理

### equipmentEffects 缓存

```javascript
// 在 UIManager.updatePlayerStats() 中自动清除缓存
if (typeof this.game.invalidateEquipmentEffectsCache === 'function') {
    this.game.invalidateEquipmentEffectsCache();
}
```

**什么时候需要清除缓存？**
- ✅ 装备改变（穿戴、脱下、精炼、刷新）
- ✅ VIP升级（影响VIP加成）
- ✅ 任何影响 `equipmentEffects` 的操作

## 最佳实践

### 1. 事件命名规范

```javascript
// ✅ 好的命名（系统:动作）
'player:levelup'
'equipment:equip'
'battle:victory'
'map:change'

// ❌ 不好的命名（太模糊）
'update'
'change'
'refresh'
```

### 2. 事件数据结构

```javascript
// ✅ 包含必要信息
window.eventManager.emit('player:levelup', {
    newLevel: 10,
    oldLevel: 9,
    timestamp: Date.now()
});

// ❌ 缺少关键信息
window.eventManager.emit('player:levelup', {});
```

### 3. UI更新粒度

```javascript
// ✅ 细粒度更新
this.scheduleUpdate('playerStats', 'expAndLevel', 'realm');

// ❌ 过于粗粒度（浪费性能）
this.scheduleUpdate('all'); // 不存在这个选项，但 forceUpdateAll() 可以做到

// ❌ 过于细粒度（遗漏相关更新）
this.scheduleUpdate('playerStats'); // 升级时只更新属性，忘记更新等级显示
```

## 常见错误

### 错误 1：忘记清除缓存

```javascript
// ❌ 错误：装备改变但没有清除缓存
this.game.equipmentSystem.calculateEquipmentEffects();
this.uiManager.updatePlayerStats();

// ✅ 正确：先清除缓存再更新
this.game.invalidateEquipmentEffectsCache();
this.game.equipmentSystem.calculateEquipmentEffects();
this.uiManager.updatePlayerStats();
```

**解决方案**：UIManager.updatePlayerStats() 中已自动清除缓存

### 错误 2：遗漏组合更新

```javascript
// ❌ 错误：突破时只更新境界，忘记更新属性
this.scheduleUpdate('realm');

// ✅ 正确：同时更新属性和境界
this.scheduleUpdate('playerStats', 'expAndLevel', 'realm', 'resource');
```

### 错误 3：使用 forceUpdateAll()

```javascript
// ❌ 错误：低频操作也用完整更新
this.uiManager.forceUpdateAll();

// ✅ 正确：使用细粒度更新
this.uiManager.updatePlayerStats();
```

## 检查清单

添加新事件时，检查以下问题：

- [ ] 这个事件会影响玩家属性吗？
  - 如果是 → 必须包含 `playerStats`
- [ ] 会影响装备效果缓存吗？
  - 如果是 → UIManager 会自动清除，但确保调用 `updatePlayerStats()`
- [ ] 会影响多个UI组件吗？
  - 如果是 → 使用组合更新，列出所有需要更新的组件
- [ ] 事件数据是否完整？
  - 包含必要的上下文信息（新值、旧值、时间戳等）

## 性能监控

### 如何检测性能问题？

```javascript
// 在浏览器控制台中查看
console.time('UI Update');
game.uiManager.updatePlayerStats();
console.timeEnd('UI Update');

// 如果超过 16ms（60fps），需要优化
```

### 如何优化？

1. **减少DOM操作**：使用细粒度更新
2. **节流高频调用**：使用 `scheduleUpdate()` 而非直接调用
3. **批量更新**：一次更新多个组件，而非多次单独更新

## 未来改进方向

1. **虚拟DOM**：使用虚拟DOM减少真实DOM操作
2. **脏检查机制**：只在数据真正改变时更新UI
3. **优先级队列**：紧急更新（血条）优先级高于普通更新（资源）
4. **帧率监控**：自动检测并警告低帧率情况
