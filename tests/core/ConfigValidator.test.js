import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConfigValidator } from '../../src/core/ConfigValidator.js';

describe('ConfigValidator', () => {
    let logSpy, errSpy, warnSpy;
    beforeEach(() => {
        ConfigValidator.FAIL_FAST = false;
        logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    const goodMetadata = () => ({
        enemyTypes: [
            { name: '雪原狼', baseHp: 28, baseAttack: 7, baseDefense: 2, baseSpeed: 12 },
            { name: '冰原熊', baseHp: 48, baseAttack: 11, baseDefense: 4, baseSpeed: 8 }
        ],
        mapEnemyMapping: { 'm1': ['雪原狼', '冰原熊'] },
        dungeons: { 'd1': { enemy_types: ['雪原狼'], boss_type: '冰原熊' } },
        questTemplateConfig: { realmThemes: [{ bossPool: ['冰原熊'] }] },
        realmSkills: [{ id: 'powerStrike', levels: [{}, {}, {}, {}] }],
        mainStoryQuests: { 0: [{ id: 'q1', storyTrigger: 'realm0_Q1' }] },
        storyScenes: { scenes: { 'realm0_Q1': {} } },
        dropRates: { normal: { white: 0.5, blue: 0.5 } },
        realmConfig: [{ name: '武者', stages: [{ stage: 1 }] }]
    });

    it('合法配置应通过（0 错误 0 警告）', () => {
        const { errors, warnings } = ConfigValidator.validate(goodMetadata(), {});
        expect(errors).toHaveLength(0);
        // boss_type '冰原熊' 在 enemyTypes 中，bossPool 也都在，应无警告
        expect(warnings).toHaveLength(0);
    });

    it('enemyTypes name 重复报错', () => {
        const m = goodMetadata();
        m.enemyTypes.push({ name: '雪原狼', baseHp: 1 });
        const { errors } = ConfigValidator.validate(m, {});
        expect(errors.some(e => e.includes('重复') && e.includes('雪原狼'))).toBe(true);
    });

    it('mapEnemyMapping 引用不存在的敌人报错', () => {
        const m = goodMetadata();
        m.mapEnemyMapping['m2'] = ['雪原狼', '不存在的怪'];
        const { errors } = ConfigValidator.validate(m, {});
        expect(errors.some(e => e.includes('不存在的怪') && e.includes('mapEnemyMapping'))).toBe(true);
    });

    it('dungeons.enemy_types 引用不存在报错；boss_type 不存在仅告警', () => {
        const m = goodMetadata();
        m.dungeons['d2'] = { enemy_types: ['雪原狼', '幽灵怪'], boss_type: '特殊大魔王' };
        const { errors, warnings } = ConfigValidator.validate(m, {});
        expect(errors.some(e => e.includes('幽灵怪'))).toBe(true);
        expect(warnings.some(w => w.includes('特殊大魔王'))).toBe(true);
    });

    it('storyTrigger 指向不存在的 scene 报错', () => {
        const m = goodMetadata();
        m.mainStoryQuests[0].push({ id: 'q2', storyTrigger: 'realm0_Q99' });
        const { errors } = ConfigValidator.validate(m, {});
        expect(errors.some(e => e.includes('realm0_Q99'))).toBe(true);
    });

    it('realmSkills id 重复报错；levels 数量非 4 告警', () => {
        const m = goodMetadata();
        m.realmSkills.push({ id: 'powerStrike', levels: [{}, {}] }); // 重复 id
        m.realmSkills.push({ id: 'threeLevel', levels: [{}, {}, {}] }); // 非 4 级
        const { errors, warnings } = ConfigValidator.validate(m, {});
        expect(errors.some(e => e.includes('powerStrike') && e.includes('重复'))).toBe(true);
        expect(warnings.some(w => w.includes('threeLevel'))).toBe(true);
    });

    it('dropRates 概率越界报错', () => {
        const m = goodMetadata();
        m.dropRates.normal.white = 1.5;
        const { errors } = ConfigValidator.validate(m, {});
        expect(errors.some(e => e.includes('dropRates') && e.includes('white'))).toBe(true);
    });

    it('FAIL_FAST=true 时有错误则抛出', () => {
        ConfigValidator.FAIL_FAST = true;
        const m = goodMetadata();
        m.mapEnemyMapping['m2'] = ['幽灵怪'];
        expect(() => ConfigValidator.validate(m, {})).toThrow();
    });

    it('metadata 为空直接报错返回', () => {
        const { errors } = ConfigValidator.validate(null, {});
        expect(errors.length).toBeGreaterThan(0);
    });
});
