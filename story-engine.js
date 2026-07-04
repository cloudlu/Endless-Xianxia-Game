// 无尽修仙 - 剧情播放引擎
// 负责剧情触发、显示、翻页、打字机效果、选择记录

class StoryEngine {
    constructor(game) {
        this.game = game;
        this.storyPageIndex = 0;
        this.typewriterTimer = null;
        this.currentScene = null;
        this.currentSceneId = null;
    }

    /**
     * 获取场景数据
     */
    getScene(sceneId) {
        return this.game.metadata.storyScenes?.scenes?.[sceneId]
            || (typeof window !== 'undefined' && window.StoryData?.mainStoryScenes?.[sceneId]);
    }

    /**
     * 触发剧情
     */
    triggerStory(sceneId) {
        if (this.game.persistentState.mainStory.currentScene) return;

        const scene = this.getScene(sceneId);
        if (!scene) return;

        this.currentScene = scene;
        this.currentSceneId = sceneId;
        this.game.persistentState.mainStory.currentScene = sceneId;
        this.storyPageIndex = 0;

        this.showStoryOverlay(scene, 0);
    }

    /**
     * 解析页面（支持 pages 数组或 _pageMap 中的字符串 key）
     */
    resolvePage(scene, pageIndex) {
        if (!scene) return null;
        if (typeof pageIndex === 'string') {
            return scene._pageMap?.[pageIndex] || null;
        }
        return scene.pages?.[pageIndex] || null;
    }

    /**
     * 显示剧情覆盖层
     */
    showStoryOverlay(scene, pageIndex) {
        const overlay = document.getElementById('story-overlay');
        const titleEl = document.getElementById('story-chapter-title');
        const speakerEl = document.getElementById('story-speaker');
        const textEl = document.getElementById('story-text');
        const indicatorEl = document.getElementById('story-page-indicator');
        const speakerImageEl = document.getElementById('story-speaker-image');

        const page = this.resolvePage(scene, pageIndex);
        if (!overlay || !page) return;

        overlay.classList.remove('hidden');

        if (titleEl) {
            titleEl.textContent = scene.title || '';
        }

        if (speakerEl) {
            speakerEl.textContent = page.speaker || '';
        }

        if (textEl) {
            this.typewriterEffect(textEl, page.text, 25);
        }

        // 计算总页数（pages 长度，_pageMap 中的页面不计入线性页数）
        const totalPages = scene.pages?.length || 0;
        if (indicatorEl) {
            const displayIndex = typeof pageIndex === 'number' ? pageIndex + 1 : 1;
            indicatorEl.textContent = `${displayIndex} / ${totalPages}`;
        }

        // 显示角色立绘
        if (speakerImageEl) {
            if (page.speakerImage) {
                speakerImageEl.src = page.speakerImage;
                speakerImageEl.style.display = 'block';
                speakerImageEl.style.animation = 'none';
                speakerImageEl.offsetHeight; // 触发重排
                speakerImageEl.style.animation = 'fadeIn 0.5s ease-out';
            } else {
                speakerImageEl.style.display = 'none';
            }
        }

        // 渲染分支选项（Phase 3）
        this.renderChoices(page);

        // 有选项时隐藏"点击继续"提示
        const continueHint = document.getElementById('story-continue-hint');
        if (continueHint) {
            if (page.choices && page.choices.length > 0) {
                continueHint.style.visibility = 'hidden';
            } else {
                continueHint.style.visibility = '';
            }
        }

        this.storyPageIndex = pageIndex;
        this.currentScene = scene;
    }

    /**
     * 渲染分支选项按钮
     */
    renderChoices(page) {
        const choicesEl = document.getElementById('story-choices');
        if (!choicesEl) return;

        if (page.choices && page.choices.length > 0) {
            choicesEl.classList.remove('hidden');
            choicesEl.innerHTML = page.choices.map((c, i) =>
                `<button class="story-choice-btn w-full text-left px-4 py-3 bg-white/5 hover:bg-gold/15 border border-gold/30 hover:border-gold/60 rounded-lg text-white/90 transition-colors text-sm" data-index="${i}">${c.text}</button>`
            ).join('');

            choicesEl.querySelectorAll('.story-choice-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation(); // 防止冒泡触发 overlay 翻页
                    this.handleChoice(page, parseInt(btn.dataset.index, 10));
                });
            });
        } else {
            choicesEl.classList.add('hidden');
            choicesEl.innerHTML = '';
        }
    }

    /**
     * 剧情页面切换
     */
    nextStoryPage() {
        const sceneId = this.game.persistentState.mainStory.currentScene;
        if (!sceneId) return;

        const scene = this.getScene(sceneId);
        if (!scene) return;

        const currentPage = this.resolvePage(scene, this.storyPageIndex);

        // 如果当前页面有选项，且玩家还没选择，不翻页
        if (currentPage?.choices && currentPage.choices.length > 0) {
            return;
        }

        let nextIndex;
        if (typeof this.storyPageIndex === 'string') {
            // 当前是 _pageMap 页面，回到线性流程的下一页
            // 通过 currentPage.linearReturn 指定返回位置，否则默认回到选择页+1
            nextIndex = currentPage?.linearReturn ?? (this._lastLinearIndex !== undefined ? this._lastLinearIndex + 1 : scene.pages.length);
        } else {
            nextIndex = this.storyPageIndex + 1;
        }

        if (nextIndex >= scene.pages.length) {
            this.closeStoryOverlay();

            if (!this.game.persistentState.mainStory.viewedScenes.includes(sceneId)) {
                this.game.persistentState.mainStory.viewedScenes.push(sceneId);
            }

            this.game.persistentState.mainStory.currentScene = null;
            this.currentScene = null;
            this.currentSceneId = null;
            this.game.saveGameState();
        } else {
            this.showStoryOverlay(scene, nextIndex);
        }
    }

    /**
     * 关闭剧情覆盖层
     */
    closeStoryOverlay() {
        const overlay = document.getElementById('story-overlay');
        const speakerImageEl = document.getElementById('story-speaker-image');

        if (overlay) {
            overlay.classList.add('hidden');
        }

        if (speakerImageEl) {
            speakerImageEl.style.display = 'none';
        }

        if (this.typewriterTimer) {
            clearInterval(this.typewriterTimer);
            this.typewriterTimer = null;
        }
    }

    /**
     * 打字机效果
     */
    typewriterEffect(element, text, speed = 30) {
        if (this.typewriterTimer) {
            clearInterval(this.typewriterTimer);
        }

        let i = 0;
        element.textContent = '';

        this.typewriterTimer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text[i];
                i++;
            } else {
                clearInterval(this.typewriterTimer);
                this.typewriterTimer = null;
            }
        }, speed);
    }

    /**
     * 记录选择（Phase 3 使用）
     */
    recordChoice(sceneId, pageIndex, choiceText) {
        const ms = this.game.persistentState.mainStory;
        if (!ms.choices) ms.choices = {};
        const key = `${sceneId}:${pageIndex}`;
        ms.choices[key] = choiceText;
    }

    /**
     * 设置标记（Phase 3 使用）
     */
    setFlag(flagName, value = true) {
        const ms = this.game.persistentState.mainStory;
        if (!ms.flags) ms.flags = {};
        ms.flags[flagName] = value;
    }

    /**
     * 处理选项（Phase 3 使用）
     */
    handleChoice(page, choiceIndex) {
        const choice = page.choices?.[choiceIndex];
        if (!choice) return;

        const sceneId = this.currentSceneId;
        this.recordChoice(sceneId, this.storyPageIndex, choice.text);

        // 应用好感度
        if (choice.affinity) {
            const affinity = this.game.persistentState.mainStory.affinity;
            for (const [char, amount] of Object.entries(choice.affinity)) {
                if (affinity[char] !== undefined) {
                    affinity[char] = (affinity[char] || 0) + amount;
                }
            }
        }

        // 设置标记
        if (choice.flags) {
            for (const [flag, value] of Object.entries(choice.flags)) {
                this.setFlag(flag, value);
            }
        }

        // 跳转
        if (choice.next) {
            const nextPage = this.resolvePage(this.currentScene, choice.next);
            if (nextPage) {
                this._lastLinearIndex = typeof this.storyPageIndex === 'number' ? this.storyPageIndex : this._lastLinearIndex;
                this.showStoryOverlay(this.currentScene, choice.next);
                return;
            }
        }

        this.nextStoryPage();
    }
}

window.StoryEngine = StoryEngine;
