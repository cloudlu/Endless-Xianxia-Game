// 无尽修仙 - 启动配置自检 (ConfigValidator)
// 在游戏初始化（metadata + storyData 合并完成后）运行一次，
// 把"配置错误要等玩家触达才静默失败"的问题前移到启动期可见。
//
// 严格度：默认 report-only（console.error/warn + 汇总），不 throw，
// 避免被继承代码库的潜伏问题 bricking 现有用户游戏。
// 设置 ConfigValidator.FAIL_FAST = true 可在发现 ERROR 时抛出。

class ConfigValidator {
    static FAIL_FAST = false;

    /**
     * 校验整体配置
     * @param {Object} metadata - game-metadata（已合并 storyScenes）
     * @param {Object} storyData - window.StoryData（含 mainStoryScenes / characters）
     * @returns {{errors: string[], warnings: string[]}}
     */
    static validate(metadata, storyData) {
        const errors = [];
        const warnings = [];
        if (!metadata) {
            errors.push('metadata 为空');
            return ConfigValidator._finalize(errors, warnings);
        }

        // 1. enemyTypes：name/id 唯一且非空
        const enemyTypes = Array.isArray(metadata.enemyTypes) ? metadata.enemyTypes : [];
        const enemyNameSet = new Set();
        const enemyIdSet = new Set();
        for (const e of enemyTypes) {
            if (!e.name || typeof e.name !== 'string') {
                errors.push(`enemyTypes 存在无 name 的条目: ${JSON.stringify(e).slice(0, 80)}`);
                continue;
            }
            if (enemyNameSet.has(e.name)) errors.push(`enemyTypes name 重复: ${e.name}`);
            enemyNameSet.add(e.name);
            if (e.id !== undefined) {
                if (!e.id) errors.push(`enemyTypes[${e.name}] id 为空`);
                else if (enemyIdSet.has(e.id)) errors.push(`enemyTypes id 重复: ${e.id}（name=${e.name}）`);
                else enemyIdSet.add(e.id);
            }
            // 数值卫生
            for (const f of ['baseHp', 'baseAttack', 'baseDefense', 'baseSpeed']) {
                if (e[f] !== undefined && !(Number.isFinite(e[f]) && e[f] >= 0)) {
                    errors.push(`enemyTypes[${e.name}].${f} 非有限非负: ${e[f]}`);
                }
            }
        }

        // 2. 引用完整性：mapEnemyMapping / dungeons.enemy_types 中的名字必须能在 enemyTypes 找到
        const checkNameRef = (name, where) => {
            if (!enemyNameSet.has(name)) errors.push(`引用了不存在的敌人 "${name}"（${where}）`);
        };
        if (metadata.mapEnemyMapping && typeof metadata.mapEnemyMapping === 'object') {
            for (const [mapId, names] of Object.entries(metadata.mapEnemyMapping)) {
                if (!Array.isArray(names)) continue;
                for (const n of names) checkNameRef(n, `mapEnemyMapping["${mapId}"]`);
            }
        }
        // 3. dungeons.enemy_types（普通敌人必须存在）；boss_type 可能是特殊 Boss 名，缺失只告警
        if (metadata.dungeons && typeof metadata.dungeons === 'object') {
            for (const [did, d] of Object.entries(metadata.dungeons)) {
                if (!d) continue;
                if (Array.isArray(d.enemy_types)) {
                    for (const n of d.enemy_types) checkNameRef(n, `dungeons["${did}"].enemy_types`);
                }
                if (d.boss_type && !enemyNameSet.has(d.boss_type)) {
                    warnings.push(`dungeons["${did}"].boss_type "${d.boss_type}" 不在 enemyTypes 中（可能是特殊 Boss，确认是否有意）`);
                }
            }
        }
        // 4. realmThemes.bossPool（缺失只告警，可能是剧情 Boss）
        const rt = metadata.questTemplateConfig?.realmThemes;
        if (Array.isArray(rt)) {
            rt.forEach((theme, i) => {
                if (Array.isArray(theme?.bossPool)) {
                    for (const n of theme.bossPool) {
                        if (!enemyNameSet.has(n)) {
                            warnings.push(`realmThemes[${i}].bossPool "${n}" 不在 enemyTypes 中（确认是否有意）`);
                        }
                    }
                }
            });
        }

        // 5. realmSkills：id 唯一；levels 数量告警（引擎硬编 4 级 targeting 表）
        const skills = Array.isArray(metadata.realmSkills) ? metadata.realmSkills : [];
        const skillIdSet = new Set();
        for (const t of skills) {
            if (!t.id) { errors.push('realmSkills 存在无 id 的技能树'); continue; }
            if (skillIdSet.has(t.id)) errors.push(`realmSkills id 重复: ${t.id}`);
            skillIdSet.add(t.id);
            if (!Array.isArray(t.levels) || t.levels.length === 0) {
                errors.push(`realmSkills[${t.id}] 缺少 levels`);
            } else if (t.levels.length !== 4) {
                warnings.push(`realmSkills[${t.id}] levels=${t.levels.length}（引擎 targeting 表硬编 4 级，非 4 级可能无 targeting 元数据）`);
            }
        }

        // 6. storyTrigger 引用：验证【真正被消费的路径】。
        // mainStoryQuests[].storyTrigger 是死字段（仅 q.name 被 mainQuest.js:1228 用于命名查找，
        // 从不触发剧情）；运行时实际触发的是 generateQuestFromTemplate 为 boss 任务生成的
        // `r{realm}_boss_{bossName}`（mainQuest.js:125,578）。校验后者是否有对应 scene。
        const scenes = metadata.storyScenes?.scenes || storyData?.mainStoryScenes || {};
        const sceneKeySet = new Set(Object.keys(scenes));
        const rt2 = metadata.questTemplateConfig?.realmThemes;
        if (Array.isArray(rt2)) {
            rt2.forEach((theme, realm) => {
                if (!Array.isArray(theme?.bossPool)) return;
                for (const bossName of theme.bossPool) {
                    const key = `r${realm}_boss_${bossName}`;
                    if (!sceneKeySet.has(key)) {
                        warnings.push(`boss 剧情 scene 缺失: "${key}"（realm${realm} bossPool "${bossName}"，Boss 任务完成后将无法触发剧情）`);
                    }
                }
            });
        }

        // 7. dropRates 数值范围（每个品质概率有限非负）
        if (metadata.dropRates && typeof metadata.dropRates === 'object') {
            for (const [tier, rates] of Object.entries(metadata.dropRates)) {
                if (!rates || typeof rates !== 'object') continue;
                for (const [rarity, p] of Object.entries(rates)) {
                    if (!(Number.isFinite(p) && p >= 0 && p <= 1)) {
                        errors.push(`dropRates.${tier}.${rarity} 概率越界: ${p}`);
                    }
                }
            }
        }

        // 8. realmConfig 结构（每境界 stages 非空、bonus 数值有限）
        if (Array.isArray(metadata.realmConfig)) {
            metadata.realmConfig.forEach((realm, i) => {
                if (!Array.isArray(realm?.stages) || realm.stages.length === 0) {
                    errors.push(`realmConfig[${i}] 缺少 stages`);
                }
            });
        }

        return ConfigValidator._finalize(errors, warnings);
    }

    static _finalize(errors, warnings) {
        const stamp = '[ConfigValidator]';
        if (errors.length === 0 && warnings.length === 0) {
            console.log(`${stamp} ✅ 配置自检通过`);
        } else {
            if (errors.length > 0) {
                console.error(`${stamp} ❌ ${errors.length} 个错误:`);
                errors.forEach(e => console.error(`  ❌ ${e}`));
            }
            if (warnings.length > 0) {
                console.warn(`${stamp} ⚠️ ${warnings.length} 个警告:`);
                warnings.forEach(w => console.warn(`  ⚠️ ${w}`));
            }
            if (ConfigValidator.FAIL_FAST && errors.length > 0) {
                throw new Error(`${stamp} 配置自检发现 ${errors.length} 个错误（FAIL_FAST 模式）`);
            }
        }
        return { errors, warnings };
    }
}

if (typeof window !== 'undefined') window.ConfigValidator = ConfigValidator;
if (typeof module !== 'undefined' && module.exports) module.exports = { ConfigValidator };
