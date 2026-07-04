/**
 * game.js 集成示例
 * 展示如何使用纯函数式CombatEngine
 */

// ==================== 步骤1: 构建CombatContext ====================

/**
 * 从game对象构建战斗上下文
 */
function buildCombatContext(game) {
    const playerStats = game.getActualStats();
    const enemyStats = game.getEnemyActualStats();

    return {
        player: {
            hp: game.persistentState.player.hp,
            maxHp: game.persistentState.player.maxHp,
            attack: playerStats.attack,
            defense: playerStats.defense,
            speed: playerStats.speed,
            luck: playerStats.luck,
            accuracy: playerStats.accuracy,
            dodgeRate: playerStats.dodgeRate,
            criticalRate: playerStats.criticalRate,
            critDamage: playerStats.critDamage,
            tenacity: playerStats.tenacity || 0,
            currentEnergy: game.persistentState.player.currentEnergy || 100,
            buffs: game.persistentState.player.buffs || {},
            skills: game.persistentState.player.skills || {}
        },
        enemy: {
            name: game.transientState.enemy.name,
            baseName: game.transientState.enemy.baseName,
            hp: game.transientState.enemy.hp,
            maxHp: game.transientState.enemy.maxHp,
            attack: enemyStats.attack,
            defense: enemyStats.defense,
            speed: enemyStats.speed,
            accuracy: enemyStats.accuracy,
            dodgeRate: enemyStats.dodgeRate,
            criticalRate: enemyStats.criticalRate,
            critDamage: enemyStats.critDamage,
            level: game.transientState.enemy.level,
            isBoss: game.transientState.enemy.isBoss,
            isElite: game.transientState.enemy.isElite,
            buffs: game.transientState.enemy.buffs || {}
        },
        battleState: {
            inBattle: game.transientState.battle.inBattle,
            turnCount: game.transientState.battle.turnCount || 1,
            currentTurn: 'player'
        },
        config: {
            skillConfig: game.metadata.skills || {},
            realmConfig: game.metadata.realmConfig || [],
            dropRates: game.metadata.dropRates || {}
        }
    };
}

// ==================== 步骤2: 使用纯函数计算结果 ====================

/**
 * 新版本的attackEnemy - 使用纯函数式CombatEngine
 */
function attackEnemy_New(game) {
    // 1. 构建上下文
    const context = buildCombatContext(game);

    // 2. 调用纯函数计算攻击结果
    const result = CombatEngine.calculatePlayerAttack(context);

    // 3. 播放攻击动画（动画逻辑保留在game.js）
    game.playAttackAnimation(
        // 碰撞回调
        () => {
            if (result.data.isHit) {
                // 创建特效
                if (game.battle3D.enemy) {
                    const hitPosition = game.battle3D.enemy.position.clone();
                    hitPosition.y = 1.0;
                    const effectColor = result.data.isCrit ? '#ffcc00' : '#ffffff';
                    game.createAttackEffect(hitPosition, effectColor);
                }

                // 应用结果：更新敌人HP（纯函数返回的新状态）
                game.transientState.enemy.hp = result.updatedEnemy.hp;

                // 显示伤害
                const damageType = result.data.isCrit ? 'crit' : 'red';
                game.showDamage(game.battle3D.enemy, result.data.damage, damageType);
            } else {
                // 显示闪避
                game.showDodge(game.battle3D.enemy, '闪避');
            }

            // 4. 触发事件（由game.js负责）
            result.events.forEach(event => {
                if (typeof eventManager !== 'undefined') {
                    eventManager.emit(event.type, event.data);
                }
            });

            // 5. 添加日志（由game.js负责）
            result.logs.forEach(log => {
                game.addBattleLog(log);
            });

            // 6. 检查战斗结束
            const endCheck = CombatEngine.checkBattleEnd({
                ...context,
                enemy: result.updatedEnemy
            });

            if (endCheck.isEnded) {
                game.updateHealthBars();
                game.battle3D.enemy.action = 'death';
                game.battle3D.enemy.animationTime = 0;
                setTimeout(() => {
                    if (endCheck.winner === 'player') {
                        enemyDefeated_New(game, endCheck.result);
                    } else {
                        playerDefeated_New(game, endCheck.result);
                    }
                }, 1500);
                return;
            }

            // 7. 敌人回合
            enemyTurn_New(game, result.updatedEnemy);
        },
        // 返回回调
        () => {
            game.updateHealthBars();
        }
    );
}

/**
 * 敌人回合 - 使用纯函数式
 */
function enemyTurn_New(game, updatedEnemy) {
    const context = buildCombatContext(game);
    context.enemy.hp = updatedEnemy.hp; // 使用更新后的敌人HP

    const result = CombatEngine.calculateEnemyAttack(context);

    // 应用敌人攻击结果
    setTimeout(() => {
        if (result.data.isHit) {
            game.persistentState.player.hp = result.updatedPlayer.hp;

            const damageType = result.data.isCrit ? 'crit' : 'red';
            game.showDamage(game.battle3D.player, result.data.damage, damageType);
        } else {
            game.showDodge(game.battle3D.player, '闪避');
        }

        // 触发事件
        result.events.forEach(event => {
            if (typeof eventManager !== 'undefined') {
                eventManager.emit(event.type, event.data);
            }
        });

        // 添加日志
        result.logs.forEach(log => {
            game.addBattleLog(log);
        });

        // 检查战斗结束
        const endCheck = CombatEngine.checkBattleEnd({
            ...context,
            player: result.updatedPlayer
        });

        if (endCheck.isEnded && endCheck.winner === 'enemy') {
            playerDefeated_New(game, endCheck.result);
        }

        game.updateHealthBars();
    }, 1000);
}

/**
 * 使用技能 - 纯函数式
 */
function useSkill_New(game, skillId) {
    const context = buildCombatContext(game);

    // 计算技能效果
    const result = CombatEngine.calculateSkillEffect(context, skillId);

    if (!result.success) {
        game.addBattleLog(result.error);
        return;
    }

    // 应用技能结果
    game.persistentState.player.currentEnergy = result.updatedPlayer.currentEnergy;

    if (result.updatedEnemy) {
        game.transientState.enemy.hp = result.updatedEnemy.hp;
    }

    // 触发事件
    result.events.forEach(event => {
        if (typeof eventManager !== 'undefined') {
            eventManager.emit(event.type, event.data);
        }
    });

    // 添加日志
    result.logs.forEach(log => {
        game.addBattleLog(log);
    });

    // 检查战斗结束
    const endCheck = CombatEngine.checkBattleEnd({
        ...context,
        player: result.updatedPlayer,
        enemy: result.updatedEnemy || context.enemy
    });

    if (endCheck.isEnded) {
        if (endCheck.winner === 'player') {
            enemyDefeated_New(game, endCheck.result);
        }
    }
}

/**
 * 敌人被击败 - 纯函数式
 */
function enemyDefeated_New(game, result) {
    // 触发事件
    if (typeof eventManager !== 'undefined') {
        eventManager.emit('battle:victory', {
            enemy: game.transientState.enemy.name,
            isBoss: game.transientState.enemy.isBoss,
            isElite: game.transientState.enemy.isElite,
            expGained: Math.floor(game.transientState.enemy.level * 20),
            timestamp: Date.now()
        });
    }

    // 原有的敌人击败逻辑...
    game.addBattleLog(`击败了${game.transientState.enemy.name}！`);

    // 发放奖励...
    // 结束战斗...
}

/**
 * 玩家被击败 - 纯函数式
 */
function playerDefeated_New(game, result) {
    // 触发事件
    if (typeof eventManager !== 'undefined') {
        eventManager.emit('battle:defeat', {
            enemy: game.transientState.enemy.name,
            expLoss: Math.floor(game.persistentState.player.exp * 0.2),
            timestamp: Date.now()
        });
    }

    // 原有的玩家失败逻辑...
    game.addBattleLog('你被击败了...');

    // 结束战斗...
}

// ==================== 优势对比 ====================

/**
 * 纯函数式重构的优势：
 *
 * 1. 易于测试
 *    - 不需要mock整个game对象
 *    - 只需要准备输入数据即可
 *    - 验证输出结果即可
 *
 * 2. 易于调试
 *    - 输入 → 输出清晰可见
 *    - 没有隐藏的副作用
 *    - 结果可预测
 *
 * 3. 易于扩展
 *    - 添加新功能只需要添加新的纯函数
 *    - 不影响现有代码
 *    - 组合函数即可实现复杂逻辑
 *
 * 4. 易于维护
 *    - 业务逻辑集中在CombatEngine
 *    - game.js只负责状态应用和UI更新
 *    - 职责分离清晰
 *
 * 5. 可复用性
 *    - 纯函数可在不同场景复用
 *    - 例如：服务器端战斗计算、AI决策、战斗回放
 */

// ==================== 迁移步骤 ====================

/**
 * 从combatlogic.js迁移到纯函数式CombatEngine的步骤：
 *
 * 阶段1：并行运行（验证阶段）⏳ 1-2天
 * - 保留原有attackEnemy()代码
 * - 新增attackEnemy_New()使用纯函数
 * - 两者并行运行，对比结果
 * - 确保新逻辑正确
 *
 * 阶段2：逐步替换（迁移阶段）⏳ 2-3天
 * - 将attackEnemy替换为attackEnemy_New
 * - 运行所有测试验证功能
 * - 逐个方法迁移（attackEnemy → useSkill → enemyDefeated...）
 *
 * 阶段3：删除旧代码（清理阶段）⏳ 1天
 * - 删除combatlogic.js中的旧代码
 * - 清理game.js中的冗余代码
 * - 完成迁移
 *
 * 预计总时间：4-6天
 * 风险：低（渐进式迁移，可随时回滚）
 */

// 导出示例（如果需要）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        buildCombatContext,
        attackEnemy_New,
        useSkill_New,
        enemyDefeated_New,
        playerDefeated_New
    };
}
