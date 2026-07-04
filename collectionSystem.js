// 图鉴系统模块 (collectionSystem.js)
// 敌人图鉴 + 装备图鉴，记录/查询/奖励检查

class CollectionSystem {
    constructor(game) {
        this.game = game;
    }

    // 初始化（旧存档兼容）
    init() {
        if (!this.game.persistentState.collection) {
            this.game.persistentState.collection = {
                enemies: [],
                equipmentTypes: [],
                pets: [],
                rewardedCategories: []
            };
        }

        // 旧存档兼容：补pets字段
        if (!this.game.persistentState.collection.pets) {
            this.game.persistentState.collection.pets = [];
        }

        // 已拥有的宠物自动记录到图鉴
        this._syncPetCollection();

        // ✅ 监听事件，自动记录图鉴
        if (typeof window !== 'undefined' && window.eventManager) {
            // 监听战斗胜利事件，自动记录敌人
            window.eventManager.on('battle:victory', (event) => {
                if (event.data && event.data.enemy) {
                    this.recordEnemy(event.data.enemy);
                }
            });

            console.log('✅ CollectionSystem事件监听已注册');
        }
    }

    // ==================== 敌人图鉴 ====================

    // 获取所有地图及其敌人列表（从元数据构建）
    getEnemyCategories() {
        const mapNames = this.game.metadata.mapNames || {};
        const mapEnemyMapping = this.game.metadata.mapEnemyMapping || {};
        const mapRealmReq = this.game.metadata.mapRealmRequirements || {};
        const categories = [];
        for (const [mapId, enemies] of Object.entries(mapEnemyMapping)) {
            // 每个baseName有3种变体：普通、精英、Boss
            const allKeys = [];
            for (const baseName of enemies) {
                allKeys.push(baseName);            // 普通
                allKeys.push(baseName + '_elite'); // 精英
                allKeys.push('BOSS' + baseName);   // Boss
            }
            categories.push({
                mapId,
                name: mapNames[mapId] || mapId,
                realm: mapRealmReq[mapId]?.realm ?? 0,
                realmName: mapRealmReq[mapId]?.name || '',
                enemyKeys: allKeys
            });
        }

        // 副本敌人分类
        const resourceDungeons = this.game.metadata.resourceDungeons || {};
        for (const [dungeonId, dungeon] of Object.entries(resourceDungeons)) {
            const allKeys = [];
            for (const enemyName of (dungeon.enemy_types || [])) {
                allKeys.push(enemyName);            // 普通
                allKeys.push(enemyName + '_elite'); // 精英
            }
            if (dungeon.boss_type) {
                allKeys.push('BOSS' + dungeon.boss_type); // Boss
            }
            categories.push({
                mapId: dungeonId,
                name: dungeon.name || dungeonId,
                realm: -1,
                realmName: '副本',
                enemyKeys: allKeys
            });
        }

        return categories;
    }

    // 获取敌人图鉴总条目数
    getEnemyTotal() {
        const categories = this.getEnemyCategories();
        return categories.reduce((sum, cat) => sum + cat.enemyKeys.length, 0);
    }

    // 记录击杀敌人
    recordEnemy(enemy) {
        const collection = this.game.persistentState.collection;
        if (!collection) return;

        let key;
        if (enemy.isBoss) {
            key = 'BOSS' + enemy.baseName;
        } else if (enemy.isElite) {
            key = enemy.baseName + '_elite';
        } else {
            key = enemy.baseName;
        }

        if (!collection.enemies.includes(key)) {
            collection.enemies.push(key);
            this.checkAndGrantEnemyRewards();
        }
    }

    // 查询敌人是否已解锁
    isEnemyUnlocked(key) {
        return this.game.persistentState.collection?.enemies?.includes(key) || false;
    }

    // 获取敌人图鉴进度
    getEnemyProgress() {
        return {
            unlocked: (this.game.persistentState.collection?.enemies?.length) || 0,
            total: this.getEnemyTotal()
        };
    }

    // ==================== 装备图鉴 ====================

    // 获取装备分类列表（境界×品质）
    getEquipmentCategories() {
        const realmConfig = this.game.metadata.realmConfig || [];
        const rarities = this.game.metadata.equipmentRarities || [];
        const templates = this.game.metadata.equipmentTemplates || [];
        const categories = [];

        for (let realmIdx = 0; realmIdx < realmConfig.length; realmIdx++) {
            const realm = realmConfig[realmIdx];
            for (const rarity of rarities) {
                // 构建该分类下所有装备key
                const equipKeys = [];
                for (const template of templates) {
                    const suffixes = Array.isArray(template.nameSuffixes[0])
                        ? template.nameSuffixes[realmIdx]
                        : template.nameSuffixes;
                    if (suffixes) {
                        for (const suffix of suffixes) {
                            // ✅ 修改key格式，包含境界索引：${realmIdx}_${type}_${rarity}_${suffix}
                            equipKeys.push(`${realmIdx}_${template.type}_${rarity.name}_${suffix}`);
                        }
                    }
                }
                categories.push({
                    realmIdx,
                    realmName: realm.name,
                    rarity,
                    equipKeys
                });
            }
        }
        return categories;
    }

    // 获取装备图鉴总条目数
    getEquipmentTotal() {
        const categories = this.getEquipmentCategories();
        return categories.reduce((sum, cat) => sum + cat.equipKeys.length, 0);
    }

    // 记录获取装备
    recordEquipment(equipment) {
        const collection = this.game.persistentState.collection;
        if (!collection || !equipment) return;

        if (!equipment.type || !equipment.rarity) return;

        // ✅ 计算境界索引（从装备level推导）
        const realmIdx = equipment.level ? Math.max(0, equipment.level - 1) : 0;

        // ✅ 如果suffix为undefined，尝试从装备名称中提取
        let suffix = equipment.suffix;
        if (!suffix && equipment.name) {
            // 从装备名称中提取后缀（去除品质前缀后的部分）
            const rarityPrefixes = ['凡铁', '精钢', '百炼', '青铜', '白银', '寒铁', '青玉', '紫玉', '水晶', '龙泉', '紫金', '玄冰', '天蚕', '紫霄', '太乙', '天罡', '玄冥', '九天', '混元', '太虚', '两仪', '鸿蒙', '混沌', '须弥', '造化'];
            let name = equipment.name;
            for (const prefix of rarityPrefixes) {
                if (name.startsWith(prefix)) {
                    name = name.substring(prefix.length);
                    break;
                }
            }
            suffix = name;
        }

        if (!suffix) return;

        // ✅ 修改key格式，包含境界索引：${realmIdx}_${type}_${rarity}_${suffix}
        const key = `${realmIdx}_${equipment.type}_${equipment.rarity}_${suffix}`;
        if (!collection.equipmentTypes.includes(key)) {
            collection.equipmentTypes.push(key);
            this.checkAndGrantEquipmentRewards();
        }
    }

    // 查询装备是否已解锁
    isEquipmentUnlocked(key) {
        return this.game.persistentState.collection?.equipmentTypes?.includes(key) || false;
    }

    // 获取装备图鉴进度
    getEquipmentProgress() {
        return {
            unlocked: (this.game.persistentState.collection?.equipmentTypes?.length) || 0,
            total: this.getEquipmentTotal()
        };
    }

    // ==================== 奖励系统 ====================

    // 检查并发放敌人图鉴奖励（按地图分类全解锁）
    checkAndGrantEnemyRewards() {
        const collection = this.game.persistentState.collection;
        if (!collection) return;

        const categories = this.getEnemyCategories();
        for (const cat of categories) {
            const rewardKey = `enemy_${cat.mapId}`;
            if (collection.rewardedCategories.includes(rewardKey)) continue;

            const allUnlocked = cat.enemyKeys.every(key => collection.enemies.includes(key));
            if (!allUnlocked) continue;

            // 发放奖励：经验+2500，灵草+50，灵石+100
            collection.rewardedCategories.push(rewardKey);
            this.game.addBattleLog(`[图鉴] ${cat.name} 全解锁奖励：经验+2500，灵草+50，灵石+100！`);

            // 增加经验
            if (this.game.persistentState.player) {
                this.game.persistentState.player.exp = (this.game.persistentState.player.exp || 0) + 2500;
            }
            // 增加资源（v2.0资源系统统一 - 删除wood，改为有用资源）
            if (this.game.persistentState.resources) {
                this.game.persistentState.resources.herbs = (this.game.persistentState.resources.herbs || 0) + 50;
                this.game.persistentState.resources.spiritStones = (this.game.persistentState.resources.spiritStones || 0) + 100;
            }
        }
    }

    // 检查并发放装备图鉴奖励（按境界×品质分类全解锁）
    checkAndGrantEquipmentRewards() {
        const collection = this.game.persistentState.collection;
        if (!collection) return;

        const categories = this.getEquipmentCategories();
        for (const cat of categories) {
            const rewardKey = `equipment_${cat.realmIdx}_${cat.rarity.name}`;
            if (collection.rewardedCategories.includes(rewardKey)) continue;

            const allUnlocked = cat.equipKeys.every(key => collection.equipmentTypes.includes(key));
            if (!allUnlocked) continue;

            // 发放奖励：对应境界保底品质装备箱×1
            collection.rewardedCategories.push(rewardKey);
            this.game.addBattleLog(`[图鉴] ${cat.realmName}境·${cat.rarity.displayName}品质 全解锁奖励：保底${cat.rarity.displayName}装备箱×1！`);

            // 生成一件对应境界和品质的装备
            const level = cat.realmIdx + 1;
            const templates = this.game.metadata.equipmentTemplates;
            if (templates && templates.length > 0) {
                const templateIdx = Math.floor(Math.random() * templates.length);
                const equipment = this.game.equipmentSystem.generateEquipment(
                    templates[templateIdx].type, level, cat.rarity.name
                );
                // 放入背包
                if (!this.game.persistentState.player.inventory) {
                    this.game.persistentState.player.inventory = [];
                }
                if (!this.game.persistentState.player.inventory.items) {
                    this.game.persistentState.player.inventory.items = [];
                }
                this.game.persistentState.player.inventory.items.push(equipment);
                this.game.addBattleLog(`[图鉴] 获得保底装备：${equipment.rarityDisplayName} ${equipment.name}`);
            }
        }
    }

    // 查询分类是否已领奖
    isCategoryRewarded(categoryKey) {
        return this.game.persistentState.collection?.rewardedCategories?.includes(categoryKey) || false;
    }

    // ==================== 宠物图鉴 ====================

    /**
     * 同步已有宠物到图鉴（启动时调用）
     */
    _syncPetCollection() {
        const pets = this.game.persistentState?.player?.pets?.owned || [];
        for (const pet of pets) {
            this.recordPet(pet);
        }
    }

    /**
     * 记录宠物到图鉴（按 typeId 记录）
     */
    recordPet(petInstance) {
        const collection = this.game.persistentState.collection;
        if (!collection || !petInstance?.typeId) return;

        // key格式：petTypeId_quality，如 spirit_fox_2
        const key = `${petInstance.typeId}_${petInstance.quality || 0}`;
        if (!collection.pets.includes(key)) {
            collection.pets.push(key);
            this.checkAndGrantPetRewards();
        }
    }

    /**
     * 查询宠物是否已解锁
     */
    isPetUnlocked(typeId, quality) {
        const key = `${typeId}_${quality || 0}`;
        return this.game.persistentState.collection?.pets?.includes(key) || false;
    }

    /**
     * 获取宠物图鉴进度
     */
    getPetProgress() {
        const petTypes = this.game.metadata.petTypes || [];
        const qualities = 4; // 凡/灵/仙/神
        const total = petTypes.length * qualities;
        const unlocked = this.game.persistentState.collection?.pets?.length || 0;
        return { unlocked, total };
    }

    /**
     * 检查并发放宠物图鉴奖励
     */
    checkAndGrantPetRewards() {
        const collection = this.game.persistentState.collection;
        if (!collection) return;

        const petTypes = this.game.metadata.petTypes || [];

        // 收集全部种类奖励
        for (const petType of petTypes) {
            const rewardKey = `pet_all_${petType.id}`;
            if (collection.rewardedCategories.includes(rewardKey)) continue;

            // 检查该种类是否4个品质都收集齐
            const allCollected = [0, 1, 2, 3].every(q => collection.pets.includes(`${petType.id}_${q}`));
            if (!allCollected) continue;

            collection.rewardedCategories.push(rewardKey);
            this.game.addBattleLog(`[图鉴] ${petType.name}全品质收集完成！奖励：仙玉+200，突破石+10`);

            if (this.game.persistentState.resources) {
                this.game.persistentState.resources.jade = (this.game.persistentState.resources.jade || 0) + 200;
                this.game.persistentState.resources.breakthroughStones =
                    (this.game.persistentState.resources.breakthroughStones || 0) + 10;
            }
        }
    }
}

// 挂载到全局（浏览器环境）
if (typeof window !== 'undefined') {
    window.CollectionSystem = CollectionSystem;
}

// 导出（Node/Vitest 环境）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CollectionSystem };
}
