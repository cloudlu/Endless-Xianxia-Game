// 无尽修仙 - 剧情数据文件
// 从 game-metadata.js 分离出来的所有剧情相关数据

window.StoryData = {
    // 主线剧情场景
    mainStoryScenes: {
        // ===== 武者卷 =====
        '0_chapter_start': {
            chapter: 0,
            title: '第一卷 · 武者之路',
            pages: [
                { text: '在遥远的极北之地，一个被永恒寒冬笼罩的世界里，修仙者们为了突破境界、追求永生而不断奋斗。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '你是一个普通山村少年，今天村庄突然传来警报——妖兽来袭！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '快！保护村民们！拿起你的武器，击退这些妖兽！', speaker: '村长', speakerImage: 'assets/characters/character_02_village_chief.jpg' },
                { text: '警报声刺破寒夜。你心中涌起复杂的情感——面对未知的危险，你会作何选择？', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg',
                    choices: [
                        { text: '毫不犹豫拿起武器冲向村口——保护村民是我的责任！', next: 'brave_charge', affinity: { '村长': 2 }, flags: { 'courage_first': true } },
                        { text: '先冷静观察，了解妖兽的数量和动向再做决定', next: 'cautious_observe', affinity: { '村长': 1 }, flags: { 'tactician_first': true } },
                        { text: '心中恐惧，但看到村民们都在行动，咬牙跟了上去', next: 'fearful_follow', affinity: {}, flags: { 'humble_first': true } }
                    ]
                }
            ],
            _pageMap: {
                'brave_charge': { text: '你毫不犹豫地从墙边拿起武器，大步向村口跑去。雪地上留下一串深深的脚印。身后的村民们投来敬畏的目光——这个平日里沉默寡言的少年，此刻眼中有着他们从未见过的光芒。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg', mood: 'intense' },
                'cautious_observe': { text: '你冷静地登上高处远远望去——至少有十几只妖兽正向村庄逼近。你注意到东侧妖兽较少，立刻向村长喊道："东侧薄弱，让女人孩子从西侧撤！"村长愣了一下，随即按你的指挥行动。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg', mood: 'calm' },
                'fearful_follow': { text: '你的双腿有些发抖，手心全是冷汗。但当你看到老村长佝偻着背举起了锄头，看到王婶抱着孩子躲在墙角——你突然不那么害怕了。勇气不是不害怕，而是害怕时仍然选择前行。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg', mood: 'solemn' }
            }
        },
        'awaken_complete': {
            chapter: 0,
            title: '觉醒',
            pages: [
                { text: '你成功击退了妖兽！但你体内突然涌出一股奇异的力量...', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '这是...修仙者的灵力！想不到在这偏远山村竟然有修仙资质出众之人。', speaker: '神秘旅者', speakerImage: 'assets/characters/character_03_mysterious_traveler.jpg' },
                { text: '少年，你可愿随我修仙问道？前方的路虽然艰险，但也许能打破这永恒寒冬的诅咒。', speaker: '神秘旅者', speakerImage: 'assets/characters/character_03_mysterious_traveler.jpg' }
            ]
        },
        'seek_master_complete': {
            chapter: 0,
            title: '拜师',
            pages: [
                { text: '你来到了山顶的门派，云雾缭绕中，一座古朴的大殿矗立眼前。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '入门弟子先从基础功法修炼起，等到武者初期修炼有成，便可下山历练。', speaker: '师尊', speakerImage: 'assets/characters/character_04_master.jpg' }
            ]
        },
        'train_complete': {
            chapter: 0,
            title: '初窥门径',
            pages: [
                { text: '经过刻苦修炼，你终于掌握了基础功法的精髓！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '不错，根基已稳。是时候下山历练一番了，记住：实战才是最好的老师。', speaker: '师尊', speakerImage: 'assets/characters/character_04_master.jpg' }
            ]
        },
        'first_battle_complete': {
            chapter: 0,
            title: '实战归来',
            pages: [
                { text: '战斗归来，你浑身是伤，但眼神愈发坚定。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '你已经有了武者的资格。但要真正突破武者巅峰，你需要不断历练，最终击败冰霜巨人！', speaker: '师尊', speakerImage: 'assets/characters/character_04_master.jpg' }
            ]
        },
        'warrior_peak_complete': {
            chapter: 0,
            title: '武者巅峰',
            pages: [
                { text: '冰霜巨人倒下了！你感到体内灵力涌动，武者境已达巅峰！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '你已经准备好突破到炼气境了。当你准备好时，前往角色面板进行突破。', speaker: '师尊', speakerImage: 'assets/characters/character_04_master.jpg' }
            ]
        },

        // ===== 炼气卷 =====
        '1_chapter_start': {
            chapter: 1,
            title: '第二卷 · 炼气有成',
            pages: [
                { text: '一股强大的灵力在你体内爆发，你的修为突破了武者境的桎梏！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '恭喜你踏入了炼气境，更广阔的修仙世界正在等待你探索。', speaker: '师尊', speakerImage: 'assets/characters/character_04_master.jpg' }
            ]
        },
        'sect_mission_complete': {
            chapter: 1,
            title: '门派贡献',
            pages: [
                { text: '你完成了门派分配的任务，获得了资源和声望。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '很好，你已经证明了自己的价值。接下来前往海滩秘境探索，炼气境的路还很长。', speaker: '师尊', speakerImage: 'assets/characters/character_04_master.jpg' }
            ]
        },
        'beach_explore_complete': {
            chapter: 1,
            title: '海滩初探',
            pages: [
                { text: '你来到了海滩，海浪拍打着礁石，远处有强大的气息。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        'secret_realm_complete': {
            chapter: 1,
            title: '秘境之战',
            pages: [
                { text: '你击败了秘境守卫，获得了珍贵的宝物！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        'compete_complete': {
            chapter: 1,
            title: '同门切磋',
            pages: [
                { text: '你与同门弟子切磋武艺，实力大增！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '你的进步很快，炼气境的路已经走了一半。继续修炼，突破大圆满就在前方。', speaker: '师尊', speakerImage: 'assets/characters/character_04_master.jpg' }
            ]
        },
        'qi_peak_complete': {
            chapter: 1,
            title: '炼气巅峰',
            pages: [
                { text: '你击败了海滩的BOSS，炼气境已达到巅峰！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '你已经准备好突破到筑基境了。', speaker: '师尊', speakerImage: 'assets/characters/character_04_master.jpg' }
            ]
        },

        // ===== 筑基卷 =====
        '2_chapter_start': {
            chapter: 2,
            title: '第三卷 · 筑基求真',
            pages: [
                { text: '你的修为再次突破，踏入了筑基境！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        'foundation_establish_complete': {
            chapter: 2,
            title: '开山立派',
            pages: [
                { text: '你收集了足够的资源，开始在门派中建立自己的势力。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        'foundation_plains_complete': {
            chapter: 2,
            title: '平原探索',
            pages: [
                { text: '你来到了广阔的平原，风中带着青草的芬芳。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        'foundation_resource_complete': {
            chapter: 2,
            title: '资源充足',
            pages: [
                { text: '你收集了大量的灵石，修为更加稳固！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        'foundation_challenge_complete': {
            chapter: 2,
            title: '秘境挑战',
            pages: [
                { text: '你击败了秘境守卫，获得了珍贵的传承！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        'foundation_peak_complete': {
            chapter: 2,
            title: '筑基巅峰',
            pages: [
                { text: '你的筑基境已达到巅峰，是时候冲击金丹境了！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },

        // ===== 金丹卷 =====
        '3_chapter_start': {
            chapter: 3,
            title: '第四卷 · 金丹大道',
            pages: [
                { text: '金丹已成，大道可期！你踏入了金丹境！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        'spiritStonesen_sect_status_complete': {
            chapter: 3,
            title: '门派地位',
            pages: [
                { text: '你在门派中的地位越来越高，获得了更多的资源和支持。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        'spiritStonesen_canyon_complete': {
            chapter: 3,
            title: '峡谷探索',
            pages: [
                { text: '你来到了险峻的峡谷，四周是悬崖峭壁。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        'spiritStonesen_desert_complete': {
            chapter: 3,
            title: '沙漠寻宝',
            pages: [
                { text: '你穿越了茫茫沙漠，发现了传说中的遗迹！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        'spiritStonesen_evil_complete': {
            chapter: 3,
            title: '正道守护',
            pages: [
                { text: '你击败了邪恶修士，保护了正道的尊严！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        'spiritStonesen_peak_complete': {
            chapter: 3,
            title: '金丹巅峰',
            pages: [
                { text: '你的金丹境已达到巅峰，元婴境就在眼前！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },

        // ===== 元婴卷 =====
        '4_chapter_start': {
            chapter: 4,
            title: '第五卷 · 元婴无双',
            pages: [
                { text: '元婴出世，神通无量！你踏入了元婴境！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        'nascent_explore_complete': {
            chapter: 4,
            title: '探索世界',
            pages: [
                { text: '你离开了门派，开始探索这个广阔的世界。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        'nascent_volcano_complete': {
            chapter: 4,
            title: '火山探索',
            pages: [
                { text: '你来到了炽热的火山，岩浆在脚下流淌。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        'nascent_demon_complete': {
            chapter: 4,
            title: '斩妖除魔',
            pages: [
                { text: '你击败了强大的妖兽，保护了人类的安宁！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        'nascent_trial_complete': {
            chapter: 4,
            title: '天道考验',
            pages: [
                { text: '你通过了天道的考验，距离化神只有一步之遥！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        'nascent_peak_complete': {
            chapter: 4,
            title: '元婴巅峰',
            pages: [
                { text: '你的元婴境已达到巅峰，化神境的门槛已经打开！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },

        // ===== 化神卷 =====
        '5_chapter_start': {
            chapter: 5,
            title: '第六卷 · 化神超脱',
            pages: [
                { text: '化神已成，超脱凡俗！你踏入了化神境！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        'deity_truth_complete': {
            chapter: 5,
            title: '世界真相',
            pages: [
                { text: '你发现了永恒寒冬的真相——这是一个被古老封印笼罩的世界！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        'deity_heaven_complete': {
            chapter: 5,
            title: '对抗天道',
            pages: [
                { text: '你击败了天道的使者，向着自由迈出了重要一步！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        'deity_challenge_complete': {
            chapter: 5,
            title: '终极挑战',
            pages: [
                { text: '你击败了最终守护者，只剩下最后一步了！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        'deity_lock_complete': {
            chapter: 5,
            title: '突破枷锁',
            pages: [
                { text: '你打破了世界的束缚，天空裂开一道金光！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },

        // ===== 飞升结局 =====
        'final_ascending': {
            chapter: 5,
            title: '飞升',
            pages: [
                { text: '你击败了元始天尊，打破了永恒寒冬的枷锁，天空裂开一道金光...', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '无尽的修仙之路，终于迎来了终点...或者说，新的起点。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '恭喜你飞升成功！感谢你的旅途！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '【游戏通关】你已完成了无尽战斗的全部主线内容！', speaker: '系统', speakerImage: 'assets/characters/character_10_system.jpg' }
            ]
        },

        // ===== 境界突破剧情 =====
        'realm_breakthrough_1': {
            chapter: 1,
            title: '突破！炼气境',
            pages: [
                { text: '恭喜你突破到炼气境！新的冒险正在等待你。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        'realm_breakthrough_2': {
            chapter: 2,
            title: '突破！筑基境',
            pages: [
                { text: '恭喜你突破到筑基境！你的修为更加深厚了。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        'realm_breakthrough_3': {
            chapter: 3,
            title: '突破！金丹境',
            pages: [
                { text: '恭喜你突破到金丹境！金丹已成，大道可期！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        'realm_breakthrough_4': {
            chapter: 4,
            title: '突破！元婴境',
            pages: [
                { text: '恭喜你突破到元婴境！元婴出世，神通无量！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        'realm_breakthrough_5': {
            chapter: 5,
            title: '突破！化神境',
            pages: [
                { text: '恭喜你突破到化神境！你已经是这个世界最强大的存在之一！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },

        // ===== 模板系统：阶段转换里程碑剧情 =====
        // 初期→中期 (stage 4 第1级触发)
        'r0_stage_4_start': { chapter: 0, title: '武者·踏入中期', pages: [
            { text: '经过初期的磨练，你的身体越来越强健。师尊点了点头，"是时候面对更强的对手了。"', speaker: '师尊', speakerImage: 'assets/characters/character_04_master.jpg' },
            { text: '山峰深处的妖兽更加凶猛，但你已经有了足够的实力。中期修炼，正式开始！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
        ]},
        'r1_stage_4_start': { chapter: 1, title: '炼气·踏入中期', pages: [
            { text: '炼气前期的修炼已告一段落，你体内的灵力流转更加顺畅。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '"海滩深处的妖兽越来越强，正好拿来磨砺你的灵力。"师兄递给你一瓶丹药。', speaker: '师兄' }
        ]},
        'r2_stage_4_start': { chapter: 2, title: '筑基·踏入中期', pages: [
            { text: '筑基的基础已经稳固，你可以感受到灵力在经脉中奔涌。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '弟子来报："师尊，平原深处发现了大量妖兽活动，需要您前去查看！"', speaker: '弟子', speakerImage: 'assets/characters/character_06_disciple.jpg' }
        ]},
        'r3_stage_4_start': { chapter: 3, title: '金丹·踏入中期', pages: [
            { text: '金丹前期的修炼让你的内丹更加凝实，金光隐隐透体而出。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '长老捋了捋胡须："金丹中期是修炼的关键节点，峡谷和沙漠中的机缘不可错过。"', speaker: '长老', speakerImage: 'assets/characters/character_07_elder.jpg' }
        ]},
        'r4_stage_4_start': { chapter: 4, title: '元婴·踏入中期', pages: [
            { text: '元婴前期的探索让你对这个世界有了更深的了解。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '故友传讯："你在湖泊和森林的探索引起了某些势力的注意，小心行事。"', speaker: '故友', speakerImage: 'assets/characters/character_08_old_friend.jpg' }
        ]},
        'r5_stage_4_start': { chapter: 5, title: '化神·踏入中期', pages: [
            { text: '化神前期的修炼让你感受到了天道的力量。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '一个声音在你脑海中回荡："你已经触碰到了世界真相的边缘，继续前进..."', speaker: '天道之音', speakerImage: 'assets/characters/character_09_heavenly_dao.jpg' }
        ]},

        // 中期→后期 (stage 7 第1级触发)
        'r0_stage_7_start': { chapter: 0, title: '武者·踏入后期', pages: [
            { text: '中期的战斗让你脱胎换骨，肌肉中蕴含着惊人的力量。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '"你的进步超出了我的预期。"师尊露出欣慰的笑容，"武者巅峰就在前方！"', speaker: '师尊' }
        ]},
        'r1_stage_7_start': { chapter: 1, title: '炼气·踏入后期', pages: [
            { text: '灵力在体内运转自如，你已经可以操控灵力进行各种攻击。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '"后期的修炼需要更多的灵石支持。"师兄为你指点了几个灵石丰富的地点。', speaker: '师兄' }
        ]},
        'r2_stage_7_start': { chapter: 2, title: '筑基·踏入后期', pages: [
            { text: '筑基后期的修炼让你对灵力有了全新的感悟。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '"师尊，前方有一处秘境，据说藏有筑基突破的机缘！"弟子带来了好消息。', speaker: '弟子' }
        ]},
        'r3_stage_7_start': { chapter: 3, title: '金丹·踏入后期', pages: [
            { text: '金丹后期，你的丹田中金光大盛，修为已臻化境。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '长老严肃道："金丹后期是结婴的关键，务必小心应对每一次战斗。"', speaker: '长老', speakerImage: 'assets/characters/character_07_elder.jpg' }
        ]},
        'r4_stage_7_start': { chapter: 4, title: '元婴·踏入后期', pages: [
            { text: '元婴后期的你，已经可以感应到方圆百里的灵力波动。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '"火山深处有远古遗迹的消息，你打算亲自去探一探。"故友为你整理了情报。', speaker: '故友' }
        ]},
        'r5_stage_7_start': { chapter: 5, title: '化神·踏入后期', pages: [
            { text: '化神后期的你，已经可以与天道进行初步的沟通。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '天道之音再次响起："你距离真相越来越近了，但最后的考验也最为凶险。"', speaker: '天道之音', speakerImage: 'assets/characters/character_09_heavenly_dao.jpg' }
        ]},

        // 后期→巅峰 (stage 10 第1级触发)
        'r0_stage_10_start': { chapter: 0, title: '武者·巅峰之路', pages: [
            { text: '后期的磨练让你拥有了远超常人的实力，武者巅峰就在眼前！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '"武者巅峰是通往更高境界的关键。"师尊目光深邃，"击败冰霜巨人，你的修仙之路才算真正开始。"', speaker: '师尊' }
        ]},
        'r1_stage_10_start': { chapter: 1, title: '炼气·大圆满', pages: [
            { text: '炼气大圆满的境界近在咫尺，你的灵力已经精纯到了极致。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '"海滩深处有一只远古海怪，击败它，你就能突破到筑基境！"师兄为你打气。', speaker: '师兄' }
        ]},
        'r2_stage_10_start': { chapter: 2, title: '筑基·大圆满', pages: [
            { text: '筑基大圆满，你的灵力根基稳如磐石。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '"师尊，平原之王出现了！它就在东方！"弟子的声音中带着一丝紧张。', speaker: '弟子' }
        ]},
        'r3_stage_10_start': { chapter: 3, title: '金丹·大圆满', pages: [
            { text: '金丹大圆满，丹田中的金丹散发出璀璨光芒。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '长老沉声道："峡谷领主是金丹境最终的考验，战胜它，元婴可期。"', speaker: '长老', speakerImage: 'assets/characters/character_07_elder.jpg' }
        ]},
        'r4_stage_10_start': { chapter: 4, title: '元婴·大圆满', pages: [
            { text: '元婴大圆满的境界让你拥有了移山填海的力量。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '故友："火山领主是这个世界最强大的妖兽之一，也是你通往化神的最后考验。"', speaker: '故友', speakerImage: 'assets/characters/character_08_old_friend.jpg' }
        ]},
        'r5_stage_10_start': { chapter: 5, title: '化神·大圆满', pages: [
            { text: '化神大圆满——你已经是这个世界上最接近仙的存在了。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '天道之音轰然响起："元始天尊是永恒寒冬的守护者，击败他，你就能打破枷锁，飞升成仙！"', speaker: '天道之音', speakerImage: 'assets/characters/character_09_heavenly_dao.jpg' }
        ]},

        // ===== 模板系统：Boss 战后剧情 =====
        // 武者境 Boss
        'r0_boss_冰霜巨人': { chapter: 0, title: '冰霜巨人之战', pages: [
            { text: '冰霜巨人轰然倒地，冰屑飞溅！你在武者境的实力已经无人能敌。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '"好！很好！"师尊眼中闪过光芒，"你已经做好了踏入炼气境的准备。"', speaker: '师尊', speakerImage: 'assets/characters/character_04_master.jpg' }
        ]},
        // 炼气境 Boss
        'r1_boss_龙王': { chapter: 1, title: '龙王之战', pages: [
            { text: '龙王发出最后的咆哮，倒在了你的脚下。海面的波涛渐渐平息。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '"龙王的内丹是炼气的绝佳材料！"师兄兴奋地捡起战利品。', speaker: '师兄' }
        ]},
        'r1_boss_海怪': { chapter: 1, title: '海怪之战', pages: [
            { text: '海怪巨大的身躯沉入海底，溅起滔天巨浪。炼气境，圆满！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '"你已经准备好突破到筑基境了。"师兄为你递上突破丹药。', speaker: '师兄' }
        ]},
        // 筑基境 Boss
        'r2_boss_草原之王': { chapter: 2, title: '草原之王之战', pages: [
            { text: '草原之王倒下了，平原上的妖兽纷纷逃散。筑基境，圆满！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '"师尊威武！"弟子们欢呼雀跃，你的声望在门派中达到了顶峰。', speaker: '弟子' }
        ]},
        // 金丹境 Boss
        'r3_boss_峡谷领主': { chapter: 3, title: '峡谷领主之战', pages: [
            { text: '峡谷领主的巨大身躯轰然倒塌，峡谷中回荡着胜利的回声。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '长老捋须微笑："金丹圆满，元婴可期。你的成就已经超过了我的预期。"', speaker: '长老', speakerImage: 'assets/characters/character_07_elder.jpg' }
        ]},
        'r3_boss_沙漠之王': { chapter: 3, title: '沙漠之王之战', pages: [
            { text: '沙漠之王在烈日下化为飞灰，沙漠恢复了往日的宁静。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '"金丹境的考验你已经全部通过了。"长老为你指引前方的道路。', speaker: '长老' }
        ]},
        // 元婴境 Boss
        'r4_boss_湖龙王': { chapter: 4, title: '湖龙王之战', pages: [
            { text: '湖龙王的咆哮声渐渐消失在湖面上。湖水晶莹如镜。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '"元婴的力量果然非同凡响。"故友感叹道，"你已经是这个世界最顶尖的强者之一了。"', speaker: '故友' }
        ]},
        'r4_boss_妖狐王': { chapter: 4, title: '妖狐王之战', pages: [
            { text: '妖狐王的幻术在你面前土崩瓦解，它化作一缕青烟消散。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '"妖狐王已除，森林恢复了安宁。"故友望着远方，"火山领主还在等着你。"', speaker: '故友' }
        ]},
        'r4_boss_火山领主': { chapter: 4, title: '火山领主之战', pages: [
            { text: '火山领主的火焰在你面前熄灭！岩浆凝固，火山归于沉寂。元婴境，圆满！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '"化神境的考验才是真正的挑战。"故友的眼中闪过一丝担忧。', speaker: '故友' }
        ]},
        // 化神境 Boss
        'r5_boss_地下蠕虫': { chapter: 5, title: '地下蠕虫之战', pages: [
            { text: '巨大的蠕虫在洞穴中化为灰烬，洞穴恢复了光明。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '天道之音："这个世界的守护者不止一个，真正的考验才刚刚开始。"', speaker: '天道之音', speakerImage: 'assets/characters/character_09_heavenly_dao.jpg' }
        ]},
        'r5_boss_麒麟': { chapter: 5, title: '麒麟之战', pages: [
            { text: '远古神兽麒麟发出最后的咆哮，化作金色光点消散。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '天道之音："你打破了世界的第二层封印...元始天尊正在等待你。"', speaker: '天道之音', speakerImage: 'assets/characters/character_09_heavenly_dao.jpg' }
        ]},
        'r5_boss_元始天尊': { chapter: 5, title: '最终之战', pages: [
            { text: '元始天尊的身影在天空中渐渐消散，永恒寒冬的枷锁出现了裂痕...', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '天空裂开一道金光，温暖的阳光洒落大地。寒冬，终于要结束了。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
        ]},

        // ===== 模板系统：境界最终剧情 =====
        'r0_realm_final': { chapter: 0, title: '武者圆满', pages: [
            { text: '武者境的修炼已经圆满！你的身体和意志都达到了凡人的巅峰。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '"从今天起，你正式踏入修仙者的行列。"师尊将一枚令牌递给你。', speaker: '师尊' }
        ]},
        'r1_realm_final': { chapter: 1, title: '炼气圆满', pages: [
            { text: '炼气境的修炼已经圆满！你的灵力已经精纯到了极致。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '"筑基境的修炼需要更多悟性，但我相信你一定可以。"师兄拍了拍你的肩膀。', speaker: '师兄' }
        ]},
        'r2_realm_final': { chapter: 2, title: '筑基圆满', pages: [
            { text: '筑基圆满！你的灵力根基已经稳如磐石。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '"师尊，我一定会成为门派的骄傲！"你的弟子眼中满是崇敬。', speaker: '弟子' }
        ]},
        'r3_realm_final': { chapter: 3, title: '金丹圆满', pages: [
            { text: '金丹圆满！丹田中金光万丈，你的修为已经达到了一个全新的高度。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '长老感慨："老夫当年修炼到金丹境用了三百年，你只用了不到一年...后生可畏！"', speaker: '长老', speakerImage: 'assets/characters/character_07_elder.jpg' }
        ]},
        'r4_realm_final': { chapter: 4, title: '元婴圆满', pages: [
            { text: '元婴圆满！你拥有了移山填海的力量，已经站上了这个世界的顶端。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '故友望着你："化神境...那是传说中的领域。去完成你的使命吧！"', speaker: '故友', speakerImage: 'assets/characters/character_08_old_friend.jpg' }
        ]},
        'r5_realm_final': { chapter: 5, title: '化神圆满', pages: [
            { text: '化神圆满！你已经达到了这个世界修仙者的巅峰。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
            { text: '天道之音："永恒寒冬的真相即将揭开...你准备好了吗？"', speaker: '天道之音', speakerImage: 'assets/characters/character_09_heavenly_dao.jpg' }
        ]},

        // ===== 武者卷新增场景 (Q4-Q9) =====
        'realm0_Q4': { chapter: 0, title: '实战归来', pages: [{ text: '战斗归来，你的武者修为又精进了不少。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm0_Q5': { chapter: 0, title: '精英挑战', pages: [{ text: '精英怪物比普通妖兽强大不少，但你也变得更强了！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm0_Q6': { chapter: 0, title: '资源充足', pages: [{ text: '充足的修炼资源是突破的基础，你已经准备好了。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm0_Q7': { chapter: 0, title: '进阶修炼', pages: [{ text: '你的修为更进一步，武者境的巅峰就在眼前。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm0_Q8': { chapter: 0, title: '战斗历练', pages: [{ text: '在与妖兽的战斗中，你的实力不断提升。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm0_Q9': { chapter: 0, title: '精英猎手', pages: [{ text: '你已经可以轻松击败精英怪物了，是时候挑战最终BOSS！', speaker: '师尊', speakerImage: 'assets/characters/character_04_master.jpg' }] },

        // ===== 炼气卷新增场景 (Q3-Q9) =====
        'realm1_Q3': { chapter: 1, title: '修炼提升', pages: [{ text: '炼气境的修炼比武者境更加精深，你感受到了灵力的流动。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm1_Q4': { chapter: 1, title: '海滩战斗', pages: [{ text: '海滩上的妖兽比山峰的更加强大，但你应对自如。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm1_Q6': { chapter: 1, title: '灵石猎人', pages: [{ text: '灵石是高级修仙的必备资源，你已经学会了如何高效收集。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm1_Q8': { chapter: 1, title: '深入修炼', pages: [{ text: '你的灵力越来越精纯，炼气境的巅峰即将到来。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm1_Q9': { chapter: 1, title: '战斗提升', pages: [{ text: '你已经准备好挑战海滩的最终BOSS了。', speaker: '师尊', speakerImage: 'assets/characters/character_04_master.jpg' }] },

        // ===== 筑基卷场景 (Q1-Q9) =====
        'realm2_Q1': { chapter: 2, title: '开山立派', pages: [{ text: '你收集了足够的资源，开始在门派中建立自己的势力。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm2_Q2': { chapter: 2, title: '平原探索', pages: [{ text: '你来到了广阔的平原，风中带着青草的芬芳。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm2_Q3': { chapter: 2, title: '修炼突破', pages: [{ text: '筑基境的修炼更加深入，你感受到了灵力的质变。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm2_Q7': { chapter: 2, title: '精英猎手', pages: [{ text: '平原上的精英怪物已经被你一一击败。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm2_Q8': { chapter: 2, title: '深入修炼', pages: [{ text: '你距离筑基境的巅峰只差一步了。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm2_Q9': { chapter: 2, title: '战斗历练', pages: [{ text: '你已经准备好挑战平原的最终BOSS了。', speaker: '师尊', speakerImage: 'assets/characters/character_04_master.jpg' }] },

        // ===== 金丹卷场景 (Q1-Q9) =====
        'realm3_Q1': { chapter: 3, title: '门派地位', pages: [{ text: '你在门派中的地位越来越高，获得了更多的资源和支持。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm3_Q2': { chapter: 3, title: '峡谷探索', pages: [{ text: '你来到了险峻的峡谷，四周是悬崖峭壁。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm3_Q3': { chapter: 3, title: '沙漠寻宝', pages: [{ text: '你穿越了茫茫沙漠，发现了传说中的遗迹！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm3_Q7': { chapter: 3, title: '精英挑战', pages: [{ text: '金丹境的精英怪物实力强大，但你也不弱。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm3_Q8': { chapter: 3, title: '修炼突破', pages: [{ text: '金丹的修炼接近圆满，元婴境的大门即将打开。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm3_Q9': { chapter: 3, title: '秘境守卫', pages: [{ text: '击败了两位秘境守卫，你已准备好最终挑战。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },

        // ===== 元婴卷场景 (Q1-Q9) =====
        'realm4_Q1': { chapter: 4, title: '探索世界', pages: [{ text: '你离开了门派，开始探索这个广阔的世界。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm4_Q2': { chapter: 4, title: '火山探索', pages: [{ text: '你来到了炽热的火山，岩浆在脚下流淌。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm4_Q5': { chapter: 4, title: '战斗提升', pages: [{ text: '元婴境的战斗让你实力大增。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm4_Q6': { chapter: 4, title: '精英猎手', pages: [{ text: '你已经可以轻松应对各种精英挑战。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm4_Q8': { chapter: 4, title: '深入修炼', pages: [{ text: '元婴境的巅峰就在眼前，化神境的门槛已经打开。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm4_Q9': { chapter: 4, title: '战斗历练', pages: [{ text: '一切准备就绪，最终之战即将到来。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },

        // ===== 化神卷新增场景 (Q2-Q9) =====
        'realm5_Q2': { chapter: 5, title: '探索收集', pages: [{ text: '在化神境的修炼中，每一份资源都至关重要。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm5_Q5': { chapter: 5, title: '战斗提升', pages: [{ text: '化神境的战斗已经接近神级。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm5_Q8': { chapter: 5, title: '修炼巅峰', pages: [{ text: '你已达到化神境的修炼巅峰。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] },
        'realm5_Q9': { chapter: 5, title: '突破枷锁', pages: [{ text: '你击败了麒麟，打破了世界的一层封印！', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }] }
    },

    // ========== 任务间叙事节拍（环境叙事）==========
    // 在任务完成 / 地图访问时按条件随机触发，丰富修仙过程
    // conditions: { realm, stageRange:[min,max], chance, mapType, questId, requiresFlag, requiresAffinity }
    interQuestBeats: [
        // ===== 武者境 · 环境叙事 =====
        {
            id: 'ambient_first_snow',
            title: '初雪',
            conditions: { realm: 0, stageRange: [1, 3], chance: 0.15 },
            pages: [
                { text: '窗外飘起了今冬的第一场雪。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg', mood: 'cold' },
                { text: '但这雪，已经下了太久了。村里的老人们说，在他们祖父的时代，这雪便从未停过。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '也许等你变得更强，便能找到答案吧。', speaker: '师尊', speakerImage: 'assets/characters/character_04_master.jpg' }
            ]
        },
        {
            id: 'ambient_mountain_training',
            title: '山间练功',
            conditions: { realm: 0, stageRange: [1, 4], chance: 0.2 },
            pages: [
                { text: '清晨的山峰格外寒冷，呼出的气息在空气中凝结成白雾。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg', mood: 'cold' },
                { text: '你一遍又一遍地挥拳，肌肉的酸痛告诉你——这才是变强的路。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '不错，记住，身体的极限只是起点，真正要突破的是心灵的枷锁。', speaker: '师尊', speakerImage: 'assets/characters/character_04_master.jpg' }
            ]
        },
        {
            id: 'ambient_village_night',
            title: '山村夜话',
            conditions: { realm: 0, stageRange: [2, 5], chance: 0.15 },
            pages: [
                { text: '夜深了，山村的灯火稀疏而温暖。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg', mood: 'calm' },
                { text: '村里的老人围坐在火塘旁，讲述着那些关于修仙者的古老传说。他们说，曾经有一个大能，一剑斩开了永恒寒冬的裂缝，让世界重新有了四季。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '但那只是传说罢了。如今，连那个大能的名字也已被风雪掩埋。', speaker: '村长', speakerImage: 'assets/characters/character_02_village_chief.jpg' }
            ]
        },
        {
            id: 'ambient_master_sword',
            title: '师尊的剑',
            conditions: { realm: 0, stageRange: [3, 6], chance: 0.15 },
            pages: [
                { text: '你在后山练功时，偶然看到了师尊练剑。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg', mood: 'intense' },
                { text: '剑气如虹，所过之处积雪消融，寸草不生的岩壁上竟生出了嫩绿的芽。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '这便是剑意的力量——以意御剑，以剑破冬。你现在还做不到，但只要坚持修炼，终有一天……', speaker: '师尊', speakerImage: 'assets/characters/character_04_master.jpg' }
            ]
        },
        {
            id: 'ambient_winter_truth_1',
            title: '冬之暗语',
            conditions: { realm: 0, stageRange: [7, 9], chance: 0.2 },
            pages: [
                { text: '你与师尊闲聊时，提到了永恒寒冬的来历。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg', mood: 'solemn' },
                { text: '寒冬并非自然现象——它是一道封印。有人，或者说有某种存在，用强大的力量冻结了这个世界的时间。', speaker: '师尊', speakerImage: 'assets/characters/character_04_master.jpg' },
                { text: '至于那个人是谁，为什么这么做……等你到了更高的境界，自然会知道的。', speaker: '师尊', speakerImage: 'assets/characters/character_04_master.jpg' }
            ]
        },

        // ===== 炼气境 · 环境叙事 =====
        {
            id: 'ambient_qi_first',
            title: '灵力的感觉',
            conditions: { realm: 1, stageRange: [1, 3], chance: 0.15 },
            pages: [
                { text: '突破炼气境后，你第一次真切感受到了灵力的流动。它如同温暖的溪流，在经脉中缓缓前行。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg', mood: 'warm' },
                { text: '这就是灵力……和武者的气血之力完全不同。它更加精微，也更加危险。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '记住，灵力是把双刃剑。用得好可斩断山河，用不好则会反噬自身。', speaker: '师兄', speakerImage: 'assets/characters/character_05_senior_brother.jpg' }
            ]
        },
        {
            id: 'ambient_beach_mystery',
            title: '海滩谜影',
            conditions: { realm: 1, stageRange: [3, 5], chance: 0.2 },
            pages: [
                { text: '海浪拍打着礁石，月光下的海面泛起银光。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg', mood: 'calm' },
                { text: '你隐约看到远处的海面上有一道身影，但那身影似乎并不在水面上——而是悬浮在空中。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '别盯着看。那不是你该招惹的存在。', speaker: '师兄', speakerImage: 'assets/characters/character_05_senior_brother.jpg' }
            ]
        },
        {
            id: 'ambient_sect_library',
            title: '藏经阁',
            conditions: { realm: 1, stageRange: [4, 7], chance: 0.15 },
            pages: [
                { text: '你来到了门派的藏经阁。数千卷经书静静陈列，记载着修仙界的历史和智慧。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg', mood: 'solemn' },
                { text: '在一本残破的古籍中，你发现了一段模糊的记载："……天道失衡，永恒封镇，唯化神可破……"', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '化神？那个传说中的境界？看来你走的路比想象中还要遥远。', speaker: '师兄', speakerImage: 'assets/characters/character_05_senior_brother.jpg' }
            ]
        },
        {
            id: 'ambient_resource_scarcity',
            title: '资源紧缺',
            conditions: { realm: 1, stageRange: [6, 9], chance: 0.2 },
            pages: [
                { text: '门派执事宣布，这个月的灵石份额减半。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg', mood: 'solemn' },
                { text: '北方灵脉异动，影响了整个区域的灵石产出。', speaker: '执事', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '师兄凑到你耳边："师弟，这是个机会。灵石越稀缺，会做生意的人越能发财。"', speaker: '师兄', speakerImage: 'assets/characters/character_05_senior_brother.jpg' },
                { text: '你看了他一眼，没有说话。修仙界的资源争夺，远比妖兽更加凶险。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },

        // ===== 筑基境 · 环境叙事 =====
        {
            id: 'ambient_foundation_danger',
            title: '洞府危机',
            conditions: { realm: 2, stageRange: [1, 4], chance: 0.2 },
            pages: [
                { text: '深夜，你的警戒阵法突然发出警报。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg', mood: 'intense' },
                { text: '你持剑冲出修炼室，却发现灵药圃里一片狼藉，但盗贼已经逃走。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '弟子战战兢兢地跑来："师尊，弟子什么都没看到……"', speaker: '弟子', speakerImage: 'assets/characters/character_06_disciple.jpg' },
                { text: '你安抚了弟子，心中却明白——有人盯上你了。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg', mood: 'dark' }
            ]
        },
        {
            id: 'ambient_elder_smile',
            title: '长老的笑容',
            conditions: { realm: 2, stageRange: [5, 9], chance: 0.15 },
            pages: [
                { text: '长老在门派议事中再次对你露出和蔼的笑容。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg', mood: 'calm' },
                { text: '师侄年轻有为，门派未来可期啊。', speaker: '长老', speakerImage: 'assets/characters/character_07_elder.jpg' },
                { text: '你回以微笑，心中却警铃大作。这个老人的每一句话都像是经过精心计算。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '弟子小声说："师尊，长老对您很好啊。"你摇了摇头："有时候，笑容比刀剑更危险。"', speaker: '玩家', speakerImage: 'assets/characters/character_01_narrator.jpg', mood: 'solemn' }
            ]
        },

        // ===== 金丹境 · 环境叙事 =====
        {
            id: 'ambient_golden_rune',
            title: '峡谷符文',
            conditions: { realm: 3, stageRange: [1, 4], chance: 0.2 },
            pages: [
                { text: '你在峡谷岩壁上发现了新的符文。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg', mood: 'mysterious' },
                { text: '那些符文比炼气境看到的更加完整，也更加古老。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '旁边刻着一行小字："第六人将至，封印或将松动。"', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '第六人？你心中疑窦丛生。这是巧合，还是某种预言？', speaker: '玩家', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        {
            id: 'ambient_evil_hint',
            title: '邪修暗线',
            conditions: { realm: 3, stageRange: [5, 9], chance: 0.2 },
            pages: [
                { text: '你击杀的邪修身上搜出了一块令牌。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg', mood: 'dark' },
                { text: '令牌背面刻着一个"周"字。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '你握紧令牌，心中翻涌。周家？那个在门派中权势滔天的周家？', speaker: '玩家', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '这件事，越来越不简单了。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },

        // ===== 元婴境 · 环境叙事 =====
        {
            id: 'ambient_old_friend_dream',
            title: '故友的梦境',
            conditions: { realm: 4, stageRange: [1, 4], chance: 0.15 },
            pages: [
                { text: '顾长青从梦中惊醒，额头上全是冷汗。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg', mood: 'mysterious' },
                { text: '我又梦到他了。', speaker: '故友', speakerImage: 'assets/characters/character_08_old_friend.jpg' },
                { text: '谁？', speaker: '玩家', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '苍玄子。他在梦里看着我，说："第六人已经来了，剩下的路，你自己选。"', speaker: '故友', speakerImage: 'assets/characters/character_08_old_friend.jpg' },
                { text: '你沉默了。那个传说中的存在，似乎一直在关注着一切。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' }
            ]
        },
        {
            id: 'ambient_sect_coup',
            title: '门派政变',
            conditions: { realm: 4, stageRange: [5, 9], chance: 0.2 },
            pages: [
                { text: '你收到消息：周家已经控制了青云宗的大权。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg', mood: 'intense' },
                { text: '长老公开宣布，要与"外部势力"合作，共同打破永恒寒冬。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '师尊传讯给你："不要回来，至少现在不要。他们在等你自投罗网。"', speaker: '师尊', speakerImage: 'assets/characters/character_04_master.jpg' },
                { text: '你握紧拳头。是时候做出选择了。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg', mood: 'dark' }
            ]
        },

        // ===== 化神境 · 环境叙事 =====
        {
            id: 'ambient_heavenly_voice_truth',
            title: '天道之音的真相',
            conditions: { realm: 5, stageRange: [1, 3], chance: 0.2 },
            pages: [
                { text: '天道之音再次在你脑海中响起。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg', mood: 'mysterious' },
                { text: '你到底是谁？', speaker: '玩家', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '我是封印的意志，也是苍玄子残留的执念。', speaker: '天道之音', speakerImage: 'assets/characters/character_09_heavenly_dao.jpg' },
                { text: '你心中一震。原来，那个一直引导你的声音，就是苍玄子本人。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '我等待了数万年，就是为了等一个能做出不同选择的人。', speaker: '天道之音', speakerImage: 'assets/characters/character_09_heavenly_dao.jpg', mood: 'solemn' }
            ]
        },
        {
            id: 'ambient_final_choice_pressure',
            title: '最终抉择的压力',
            conditions: { realm: 5, stageRange: [6, 9], chance: 0.2 },
            pages: [
                { text: '师尊、师兄、弟子都来到了寒渊。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg', mood: 'intense' },
                { text: '他们没有说话，只是看着你。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '你感到前所未有的压力。你的选择，将决定所有人的命运。', speaker: '旁白', speakerImage: 'assets/characters/character_01_narrator.jpg' },
                { text: '弟子忽然跪下："师尊，弟子相信您的选择。"', speaker: '弟子', speakerImage: 'assets/characters/character_06_disciple.jpg', mood: 'warm' },
                { text: '你深吸一口气。是啊，无论选择什么，至少要无愧于心。', speaker: '玩家', speakerImage: 'assets/characters/character_01_narrator.jpg', mood: 'solemn' }
            ]
        }
    ],

    // ========== 角色定义（好感度面板 + 描述）==========
    characters: {
        '村长': { name: '村长', image: 'assets/characters/character_02_village_chief.jpg', description: '山村的村长，关心村民安危。守护着一枚神秘的玉佩。' },
        '师尊': { name: '师尊', image: 'assets/characters/character_04_master.jpg', description: '门派长老，外表严厉内心温和。真实身份是上一代化神候选人。' },
        '师兄': { name: '师兄', image: 'assets/characters/character_05_senior_brother.jpg', description: '豪爽的同门师兄，实则暗中经营商会，曾与邪修有交易。' },
        '弟子': { name: '弟子', image: 'assets/characters/character_06_disciple.jpg', description: '你收的徒弟，聪明伶俐。家族是被灭门的修仙世家，为复仇而修仙。' },
        '长老': { name: '长老', image: 'assets/characters/character_07_elder.jpg', description: '门派智者，表面慈祥实则深不可测。真实目的是解除封印。' },
        '故友': { name: '故友', image: 'assets/characters/character_08_old_friend.jpg', description: '元婴期重逢的顾长青。真实身份是前代化神"青云真人"的转世。' },
        '天道之音': { name: '天道之音', image: 'assets/characters/character_09_heavenly_dao.jpg', description: '化神境听到的天道之声。实为封印意志，苍玄子残留的执念。' },
        '神秘旅者': { name: '神秘旅者', image: 'assets/characters/character_11_mysterious_traveler.jpg', description: '妖兽之夜出现的神秘人。真实身份是苍玄子的弟子，已流浪数千年。' },
        '小霜': { name: '小霜', image: 'assets/characters/character_01_narrator.jpg', description: '守护者后裔，追杀携带封印碎片的妖兽，肩负世代使命。' }
    },

    // ========== 支线故事（外传）==========
    // unlock: { realmMin, affinity: { '角色': 最低值 } }
    sideStories: [
        {
            id: 'master_past',
            title: '师尊的往事',
            unlock: { realmMin: 1, affinity: { '师尊': 3 } },
            reward: { loreEntry: 'master_origin' },
            chapters: [
                {
                    title: '雪夜入门',
                    pages: [
                        { text: '那是一个和今天一样寒冷的夜晚。', speaker: '师尊', speakerImage: 'assets/characters/character_04_master.jpg', mood: 'calm' },
                        { text: '我还是个普通弟子时，师父——你的师祖——在一个雪夜把我带回了门派。那天雪下得特别大，护山大阵都结了厚厚的冰。', speaker: '师尊', speakerImage: 'assets/characters/character_04_master.jpg' },
                        { text: '师父说，他在我身上看到了一种特别的东西——不是天赋，而是一种叫做"不服"的意志。', speaker: '师尊', speakerImage: 'assets/characters/character_04_master.jpg' },
                        { text: '后来我在你身上，也看到了同样的东西。', speaker: '师尊', speakerImage: 'assets/characters/character_04_master.jpg', mood: 'warm' }
                    ]
                },
                {
                    title: '剑断寒冰',
                    pages: [
                        { text: '我曾经尝试突破金丹境，但失败了。', speaker: '师尊', speakerImage: 'assets/characters/character_04_master.jpg', mood: 'solemn' },
                        { text: '不是因为天赋，而是心中有一道结——我有一个师妹叫苏晚晴。在一次历练中，我们遇到了强大的存在……她没有回来。', speaker: '师尊', speakerImage: 'assets/characters/character_04_master.jpg', mood: 'dark' },
                        { text: '从那以后，我的剑就再也无法真正突破。直到遇到你——你让我重新想起了修炼的意义。', speaker: '师尊', speakerImage: 'assets/characters/character_04_master.jpg', mood: 'warm' }
                    ]
                }
            ]
        },
        {
            id: 'winter_truth',
            title: '永恒寒冬之谜',
            unlock: { realmMin: 4, affinity: { '故友': 3 } },
            reward: { loreEntry: 'winter_seal' },
            chapters: [
                {
                    title: '被封印的时间',
                    pages: [
                        { text: '你知道永恒寒冬为什么不会结束吗？', speaker: '故友', speakerImage: 'assets/characters/character_08_old_friend.jpg' },
                        { text: '因为时间本身被封印了。不是季节的停滞，而是整个世界的时间——停在了"冬"这个节点。', speaker: '故友', speakerImage: 'assets/characters/character_08_old_friend.jpg' },
                        { text: '封印者是化神境大能苍玄子。而预言说："当第六位化神出现，封印将碎，世界将醒。"', speaker: '故友', speakerImage: 'assets/characters/character_08_old_friend.jpg', mood: 'solemn' }
                    ]
                },
                {
                    title: '第六位化神',
                    pages: [
                        { text: '你是这世界上第六个达到化神境的人。前五位……都不见了。', speaker: '故友', speakerImage: 'assets/characters/character_08_old_friend.jpg' },
                        { text: '第一位是苍玄子。第二位是我的前世青云真人。他们选择了不同的道路，但都留在了封印之内。', speaker: '故友', speakerImage: 'assets/characters/character_08_old_friend.jpg', mood: 'solemn' },
                        { text: '你的路注定不平静。但你已是这条路上最接近真相的人。', speaker: '故友', speakerImage: 'assets/characters/character_08_old_friend.jpg' }
                    ]
                }
            ]
        },
        {
            id: 'mysterious_traveler',
            title: '神秘旅者之谜',
            unlock: { realmMin: 3, affinity: { '神秘旅者': 2 } },
            reward: { loreEntry: 'traveler_origin' },
            chapters: [
                {
                    title: '苍玄子的弟子',
                    pages: [
                        { text: '你还记得第一次见到我的那晚吗？', speaker: '神秘旅者', speakerImage: 'assets/characters/character_11_mysterious_traveler.jpg', mood: 'calm' },
                        { text: '不是巧合。我是在你出生那天，就注意到了你身上与众不同的气息。', speaker: '神秘旅者', speakerImage: 'assets/characters/character_11_mysterious_traveler.jpg' },
                        { text: '我的师父，就是苍玄子。当年他封印世界时，让我活下去，等待第六位化神的出现。', speaker: '神秘旅者', speakerImage: 'assets/characters/character_11_mysterious_traveler.jpg', mood: 'solemn' },
                        { text: '所以我流浪了数千年。如今这份守望，终于有了终点。', speaker: '神秘旅者', speakerImage: 'assets/characters/character_11_mysterious_traveler.jpg', mood: 'warm' }
                    ]
                }
            ]
        },
        {
            id: 'senior_brother_merchant',
            title: '师兄的双面人生',
            unlock: { realmMin: 3, affinity: { '师兄': 4 } },
            reward: { loreEntry: 'senior_merchant' },
            chapters: [
                {
                    title: '商会背后',
                    pages: [
                        { text: '师弟，有些事我一直没告诉你。', speaker: '师兄', speakerImage: 'assets/characters/character_05_senior_brother.jpg', mood: 'solemn' },
                        { text: '你以为我只是个豪爽的炼气修士？其实我在门派外经营着一个小型商会。修仙界到处都要花钱，没商会我早被淘汰了。', speaker: '师兄', speakerImage: 'assets/characters/character_05_senior_brother.jpg' },
                        { text: '我曾经和邪修做过交易，被他们抓住了把柄。但现在，在师弟你的帮助下，我想做个了断。', speaker: '师兄', speakerImage: 'assets/characters/character_05_senior_brother.jpg', mood: 'intense' }
                    ]
                }
            ]
        }
    ],

    // ========== 世界观图鉴条目 ==========
    loreEntries: {
        'master_origin': { title: '师尊入门往事', category: '人物', text: '师尊年幼时被师祖在雪夜带回门派。师祖在他身上看到了"不服"的意志——不是天赋，而是不屈。' },
        'winter_seal': { title: '永恒寒冬的真相', category: '世界', text: '永恒寒冬并非自然现象，而是苍玄子施加的封印。整个世界的时间被停在"冬"。预言："当第六位化神出现，封印将碎，世界将醒。"' },
        'traveler_origin': { title: '神秘旅者', category: '人物', text: '神秘旅者是苍玄子的弟子，在师父封印世界时选择活下去，流浪数千年等待第六位化神。' },
        'senior_merchant': { title: '师兄的商会', category: '人物', text: '师兄暗中经营商会，曾与邪修交易。在玩家帮助下摆脱控制，重获自由。' },
        'six_deities': { title: '六位化神', category: '世界', text: '玩家是世界上的第六位化神。前五位分别是苍玄子、青云真人及三位命运未知的化神。' },
        'cangxuan_choice': { title: '苍玄子的选择', category: '世界', text: '苍玄子非自愿成为封印者。天道裂痕出现时，无数修仙者逃离，只有他用神魂封印世界。' }
    },

    // ========== 老存档好感度迁移映射 ==========
    // 旧存档玩家在新好感度系统上线前已看过剧情，按已观看的场景补发对应角色好感度，
    // 使外传等好感度门槛内容可被解锁。格式: { 'sceneId': { '角色': 数值 } }
    sceneAffinityMap: {
        // 武者卷
        '0_chapter_start': { '村长': 2 },
        'awaken_complete': { '神秘旅者': 2 },
        'seek_master_complete': { '师尊': 1 },
        'train_complete': { '师尊': 1 },
        'first_battle_complete': { '师尊': 1 },
        'warrior_peak_complete': { '师尊': 1 },
        'r0_boss_冰霜巨人': { '师尊': 1 },
        'r0_realm_final': { '师尊': 1 },
        // 炼气卷
        '1_chapter_start': { '师尊': 1 },
        'r1_stage_4_start': { '师兄': 1 },
        'r1_stage_7_start': { '师兄': 1 },
        'r1_stage_10_start': { '师兄': 1 },
        'r1_boss_龙王': { '师兄': 1 },
        'r1_boss_海怪': { '师兄': 1 },
        'r1_realm_final': { '师兄': 1 },
        // 筑基卷
        '2_chapter_start': { '长老': 1, '弟子': 1 },
        'r2_stage_4_start': { '弟子': 1 },
        'r2_stage_10_start': { '弟子': 1 },
        'r2_boss_草原之王': { '弟子': 1 },
        'r2_realm_final': { '弟子': 1 },
        // 金丹卷
        '3_chapter_start': { '师尊': 1 },
        'r3_stage_4_start': { '长老': 1 },
        'r3_stage_7_start': { '长老': 1 },
        'r3_stage_10_start': { '长老': 1 },
        'r3_boss_峡谷领主': { '长老': 1 },
        'r3_boss_沙漠之王': { '长老': 1 },
        'r3_realm_final': { '长老': 1 },
        // 元婴卷
        '4_chapter_start': { '故友': 1 },
        'r4_stage_4_start': { '故友': 1 },
        'r4_stage_7_start': { '故友': 1 },
        'r4_stage_10_start': { '故友': 1 },
        'r4_boss_湖龙王': { '故友': 1 },
        'r4_boss_妖狐王': { '故友': 1 },
        'r4_boss_火山领主': { '故友': 1 },
        'r4_realm_final': { '故友': 2 },
        // 化神卷
        '5_chapter_start': { '天道之音': 1 },
        'r5_stage_4_start': { '天道之音': 1 },
        'r5_stage_7_start': { '天道之音': 1 },
        'r5_stage_10_start': { '天道之音': 1 },
        'r5_realm_final': { '天道之音': 1 }
    }
};
