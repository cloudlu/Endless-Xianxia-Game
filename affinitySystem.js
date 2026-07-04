// 无尽修仙 - 角色好感度系统
// 管理友好NPC的好感度，提供关系等级与UI渲染

class AffinitySystem {
    constructor(game) {
        this.game = game;
    }

    /**
     * 获取好感度数据（带默认值兼容）
     */
    get affinity() {
        const ms = this.game.persistentState.mainStory;
        if (!ms.affinity) {
            ms.affinity = this.defaultAffinity();
        }
        return ms.affinity;
    }

    defaultAffinity() {
        return {
            '村长': 0, '师尊': 0, '师兄': 0, '弟子': 0,
            '长老': 0, '故友': 0, '天道之音': 0, '神秘旅者': 0, '小霜': 0
        };
    }

    addAffinity(character, amount) {
        const aff = this.affinity;
        if (aff[character] === undefined) aff[character] = 0;
        aff[character] += amount;
        this.game.saveGameState?.();
    }

    getAffinity(character) {
        return this.affinity[character] || 0;
    }

    /**
     * 根据数值返回关系等级
     */
    getTier(value) {
        if (value >= 12) return { name: '生死之交', level: 5, color: 'text-red-400' };
        if (value >= 8)  return { name: '挚友',     level: 4, color: 'text-orange-400' };
        if (value >= 5)  return { name: '信任',     level: 3, color: 'text-yellow-400' };
        if (value >= 2)  return { name: '相识',     level: 2, color: 'text-green-400' };
        return { name: '陌生', level: 1, color: 'text-white/40' };
    }

    getCharacterTier(character) {
        return this.getTier(this.getAffinity(character));
    }

    /**
     * 渲染人物关系面板 HTML
     */
    renderAffinityPanel() {
        const container = document.getElementById('quest-tab-affinity-content');
        if (!container) return;

        const chars = (typeof window !== 'undefined' && window.StoryData?.characters) || {};
        const affinity = this.affinity;

        let html = '<div class="space-y-2">';
        for (const [name, val] of Object.entries(affinity)) {
            const tier = this.getTier(val);
            const pct = Math.min(100, Math.max(0, (val / 15) * 100));
            const desc = chars[name]?.description || '';

            html += `
                <div class="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-white/90 text-sm font-medium">${name}</span>
                        <span class="text-xs ${tier.color}">${tier.name} <span class="text-white/40">(${val})</span></span>
                    </div>
                    <div class="h-1.5 bg-white/10 rounded overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-gold/60 to-gold rounded transition-all" style="width:${pct}%"></div>
                    </div>
                    ${desc ? `<div class="text-white/40 text-xs mt-1 leading-snug">${desc}</div>` : ''}
                </div>
            `;
        }
        html += '</div>';
        html += '<div class="text-white/30 text-xs mt-3 text-center">通过剧情选择与互动提升关系等级</div>';

        container.innerHTML = html;
    }

    /**
     * 判断是否满足好感度条件（供支线解锁使用）
     * @param {Object} req - { '角色名': 最低值, ... }
     */
    meetsAffinity(req) {
        if (!req) return true;
        for (const [char, minVal] of Object.entries(req)) {
            if (this.getAffinity(char) < minVal) return false;
        }
        return true;
    }
}

window.AffinitySystem = AffinitySystem;
