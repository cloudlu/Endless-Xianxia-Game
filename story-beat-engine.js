// 无尽修仙 - 任务间叙事节拍引擎
// 在任务完成 / 地图访问时，按条件随机触发环境叙事（不打断主线节奏）

class StoryBeatEngine {
    constructor(game) {
        this.game = game;
        // 频率限制：两次 beat 之间的最小冷却（毫秒）
        this.COOLDOWN_MS = 30000;
        // 同一境界+阶段最多触发的 beat 数量
        this.MAX_BEATS_PER_REALM_STAGE = 3;
        this._listenerRegistered = false;
        this.registerListeners();
    }

    /**
     * 获取所有环境叙事数据
     */
    getBeats() {
        return (typeof window !== 'undefined' && window.StoryData?.interQuestBeats) || [];
    }

    registerListeners() {
        if (this._listenerRegistered) return;
        if (typeof window === 'undefined' || !window.eventManager) {
            console.warn('[叙事节拍] eventManager未加载，稍后重试注册');
            // 延迟重试
            setTimeout(() => this.registerListeners(), 1000);
            return;
        }

        // 任务完成后检查
        window.eventManager.on('quest:complete', (event) => {
            this.checkAndTriggerBeat({
                type: 'quest_complete',
                realm: this._currentRealm(),
                stage: this._currentStage(),
                questId: event?.data?.questId,
                mapType: this._currentMapType()
            });
        });

        // 地图访问
        window.eventManager.on('map:visit', (event) => {
            this.checkAndTriggerBeat({
                type: 'map_visit',
                mapType: event?.data?.mapType,
                realm: this._currentRealm()
            });
        });

        this._listenerRegistered = true;
        console.log('✅ StoryBeatEngine 叙事节拍监听已注册');
    }

    _currentRealm() {
        return this.game.persistentState.player?.realm?.currentRealm ?? 0;
    }
    _currentStage() {
        return this.game.persistentState.player?.realm?.currentStage ?? 1;
    }
    _currentMapType() {
        const idx = this.game.persistentState.currentBackgroundIndex ?? 0;
        return this.game.metadata?.mapBackgrounds?.[idx]?.type;
    }

    /**
     * 主检查逻辑：频率限制 + 条件匹配 + 触发
     */
    checkAndTriggerBeat(context) {
        const beats = this.getBeats();
        if (!beats || beats.length === 0) return;

        // 如果剧情覆盖层正在播放，不打断
        if (this.game.persistentState.mainStory?.currentScene) return;

        const history = this.game.persistentState.mainStory.beatHistory || {};

        // 冷却限制
        const now = Date.now();
        if (history.lastBeatTimestamp && (now - history.lastBeatTimestamp) < this.COOLDOWN_MS) {
            return;
        }

        // 同境界+阶段上限
        const realmStage = `r${context.realm}_s${context.stage}`;
        const beatsThisRealmStage = (history[realmStage] || []).length;
        if (beatsThisRealmStage >= this.MAX_BEATS_PER_REALM_STAGE) {
            return;
        }

        // 遍历匹配第一个可触发的 beat
        for (const beat of beats) {
            if (this.hasBeatPlayed(beat.id)) continue;
            if (!this.matchesConditions(beat.conditions, context)) continue;

            // 概率
            if (beat.conditions?.chance && Math.random() > beat.conditions.chance) continue;

            // 触发
            this.triggerBeat(beat, context);
            break;
        }
    }

    /**
     * 触发一个 beat：将其转换为临时故事场景播放
     */
    triggerBeat(beat, context) {
        const ms = this.game.persistentState.mainStory;

        // 将 beat 注册为一个临时故事场景（用 beat.id 作为 sceneId）
        // 注入到 metadata.storyScenes.scenes 和 window.StoryData.mainStoryScenes
        if (typeof window !== 'undefined' && window.StoryData?.mainStoryScenes) {
            window.StoryData.mainStoryScenes[beat.id] = {
                chapter: beat.conditions?.realm ?? 0,
                title: beat.title || beat.id,
                pages: beat.pages
            };
        }
        if (this.game.metadata?.storyScenes?.scenes) {
            this.game.metadata.storyScenes.scenes[beat.id] = {
                chapter: beat.conditions?.realm ?? 0,
                title: beat.title || beat.id,
                pages: beat.pages
            };
        }

        // 标记已播放
        const history = ms.beatHistory || (ms.beatHistory = {});
        const realmStage = `r${context.realm}_s${context.stage}`;
        if (!history[realmStage]) history[realmStage] = [];
        history[realmStage].push(beat.id);
        history.lastBeatTimestamp = Date.now();

        // 通过主线任务系统的故事引擎播放（保持一致的 UI/打字机效果）
        const engine = this.game.mainQuestSystem?.storyEngine;
        if (engine) {
            engine.triggerStory(beat.id);
            console.log(`[叙事节拍] 触发: ${beat.id} (${beat.title || ''})`);
        }
    }

    hasBeatPlayed(beatId) {
        const history = this.game.persistentState.mainStory?.beatHistory || {};
        for (const key in history) {
            if (key === 'lastBeatTimestamp') continue;
            if (Array.isArray(history[key]) && history[key].includes(beatId)) return true;
        }
        return false;
    }

    matchesConditions(cond, ctx) {
        if (!cond) return true;
        if (cond.realm !== undefined && ctx.realm !== cond.realm) return false;
        if (cond.stageRange && (ctx.stage < cond.stageRange[0] || ctx.stage > cond.stageRange[1])) return false;
        if (cond.mapType && ctx.mapType !== cond.mapType) return false;
        if (cond.questId && ctx.questId !== cond.questId) return false;

        // 需要 flag
        if (cond.requiresFlag) {
            const flags = this.game.persistentState.mainStory?.flags || {};
            if (!flags[cond.requiresFlag]) return false;
        }

        // 需要好感度
        if (cond.requiresAffinity) {
            const affinity = this.game.persistentState.mainStory?.affinity || {};
            for (const [char, minVal] of Object.entries(cond.requiresAffinity)) {
                if ((affinity[char] || 0) < minVal) return false;
            }
        }

        return true;
    }
}

window.StoryBeatEngine = StoryBeatEngine;
