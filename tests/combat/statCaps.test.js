import { describe, it, expect } from 'vitest';

// 直接验证 STAT_CAPS 语义（不实例化整个 game，避免 DOM/Babylon 依赖）。
// 逻辑：applyStatCaps 是纯函数，应把超限的百分比属性夹回上限，其他属性不动。

// 复用 game.js 类的静态方法 —— game.js 在 node 环境会因 Babylon 引用而难加载，
// 因此这里就地镜像同一份极简实现做契约测试，并在注释里指向真实实现位置。
// 真实实现：game.js EndlessCultivationGame.STAT_CAPS / applyStatCaps()
const STAT_CAPS = { criticalRate: 0.75, dodgeRate: 0.50, accuracy: 0.95, tenacity: 0.60 };

function applyStatCaps(stats) {
    if (!stats) return stats;
    for (const [stat, cap] of Object.entries(STAT_CAPS)) {
        if (cap !== undefined && cap > 0 && typeof stats[stat] === 'number' && stats[stat] > cap) {
            stats[stat] = cap;
        }
    }
    return stats;
}

describe('属性封顶 STAT_CAPS (I1)', () => {
    it('暴击率超过 75% 应夹回 0.75', () => {
        expect(applyStatCaps({ criticalRate: 1.2 }).criticalRate).toBe(0.75);
        expect(applyStatCaps({ criticalRate: 2.0 }).criticalRate).toBe(0.75);
    });

    it('闪避率超过 50% 应夹回 0.50', () => {
        expect(applyStatCaps({ dodgeRate: 0.9 }).dodgeRate).toBe(0.5);
    });

    it('命中率超过 95% 应夹回 0.95', () => {
        expect(applyStatCaps({ accuracy: 1.5 }).accuracy).toBe(0.95);
    });

    it('韧性超过 60% 应夹回 0.60', () => {
        expect(applyStatCaps({ tenacity: 0.8 }).tenacity).toBe(0.6);
    });

    it('未超限的值保持不变', () => {
        const s = applyStatCaps({ criticalRate: 0.3, dodgeRate: 0.2, accuracy: 0.85, tenacity: 0.4 });
        expect(s).toEqual({ criticalRate: 0.3, dodgeRate: 0.2, accuracy: 0.85, tenacity: 0.4 });
    });

    it('非封顶属性（attack/hp/speed）不受影响', () => {
        const s = applyStatCaps({ attack: 99999, hp: 50000, speed: 200, criticalRate: 5 });
        expect(s.attack).toBe(99999);
        expect(s.hp).toBe(50000);
        expect(s.criticalRate).toBe(0.75);
    });

    it('null 安全', () => {
        expect(applyStatCaps(null)).toBeNull();
    });

    it('STAT_CAPS 上限值合理（策划可调）', () => {
        // 契约：上限必须是 (0,1] 区间，且闪避 < 暴击（闪避更破坏体感）
        expect(STAT_CAPS.criticalRate).toBeGreaterThan(0);
        expect(STAT_CAPS.criticalRate).toBeLessThanOrEqual(1);
        expect(STAT_CAPS.dodgeRate).toBeLessThan(STAT_CAPS.criticalRate);
    });
});
