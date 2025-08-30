/**
 * Educational Modules System
 * Interactive learning tools for gravity ion thermoelectric technology
 * Provides guided tours, tutorials, and educational content
 */

class EducationalModules {
    constructor() {
        this.currentModule = null;
        this.progress = {};
        this.achievements = [];
        this.isActive = false;

        // Educational content configuration
        this.modules = this.initializeModules();
        this.achievements = this.initializeAchievements();

        // UI elements
        this.overlay = null;
        this.tooltip = null;
        this.progressBar = null;
    }

    /**
     * Initialize educational modules
     */
    initializeModules() {
        return {
            'intro-physics': {
                id: 'intro-physics',
                title: '物理原理入門',
                description: '學習重力離子熱電技術的基礎物理概念',
                duration: 10, // minutes
                difficulty: 'beginner',
                steps: [
                    {
                        id: 'gravity-basics',
                        title: '重力場基礎',
                        content: '了解重力場如何影響不同質量的粒子',
                        target: '#scientific-particle-canvas',
                        action: 'highlight',
                        quiz: {
                            question: '在重力場中，較重的離子會往哪個方向移動？',
                            options: ['向上', '向下', '水平', '隨機'],
                            correct: 1,
                            explanation: '較重的離子受重力影響更大，會沉降至底部。'
                        }
                    },
                    {
                        id: 'boltzmann-distribution',
                        title: '波茲曼分布',
                        content: '學習離子在重力場中的濃度分布規律',
                        target: '#gravity-slider',
                        action: 'interact',
                        task: '調整重力強度並觀察粒子分布的變化',
                        quiz: {
                            question: '波茲曼分布公式中，哪個參數決定分布的陡峭程度？',
                            options: ['溫度 T', '重力 G', '質量 m', '高度 h'],
                            correct: 0,
                            explanation: '溫度 T 在分母中，溫度越高，分布越平緩。'
                        }
                    },
                    {
                        id: 'electric-field-generation',
                        title: '電場產生機制',
                        content: '理解離子分離如何產生電場',
                        target: '#visualization-mode',
                        action: 'change-mode',
                        task: '切換到電場力線模式觀察電場分布',
                        quiz: {
                            question: '電場強度公式 E = (m₊ - m₋)G / 2q 中，電場與什麼成正比？',
                            options: ['離子電荷', '質量差', '溫度', '濃度'],
                            correct: 1,
                            explanation: '電場強度與離子質量差 (m₊ - m₋) 成正比。'
                        }
                    }
                ]
            },

            'ion-systems': {
                id: 'ion-systems',
                title: '離子系統比較',
                description: '探索不同離子系統的特性和效能',
                duration: 15,
                difficulty: 'intermediate',
                steps: [
                    {
                        id: 'hi-system',
                        title: 'HI 氫碘酸系統',
                        content: '最高效率的離子系統，功率密度達 72.23 W/m³',
                        target: '#ion-system-select',
                        action: 'select-option',
                        value: 'HI',
                        quiz: {
                            question: '為什麼 HI 系統效率最高？',
                            options: ['離子濃度最高', '質量差最大', '導電性最好', '穩定性最佳'],
                            correct: 1,
                            explanation: 'H⁺ 和 I⁻ 的質量差最大，產生最強的電場。'
                        }
                    },
                    {
                        id: 'licl-system',
                        title: 'LiCl 氯化鋰系統',
                        content: '經過 Tolman 實驗驗證的離子系統',
                        target: '#ion-system-select',
                        action: 'select-option',
                        value: 'LiCl',
                        quiz: {
                            question: 'Tolman 1910 年實驗為什麼重要？',
                            options: ['首次發現重力電場', '證明熱力學定律', '測量離子質量', '發明離心機'],
                            correct: 0,
                            explanation: 'Tolman 首次在實驗中觀察到重力場產生的電位差。'
                        }
                    },
                    {
                        id: 'system-comparison',
                        title: '系統效能比較',
                        content: '比較三種離子系統的優缺點',
                        target: '#current-value',
                        action: 'observe',
                        task: '觀察不同系統的電流密度變化',
                        quiz: {
                            question: '選擇離子系統時最重要的考量是什麼？',
                            options: ['成本', '質量差異', '化學穩定性', '以上皆是'],
                            correct: 3,
                            explanation: '實際應用需要綜合考慮效率、成本、穩定性等因素。'
                        }
                    }
                ]
            },

            'advanced-concepts': {
                id: 'advanced-concepts',
                title: '進階概念與應用',
                description: '深入理解熱力學突破和實際應用',
                duration: 20,
                difficulty: 'advanced',
                steps: [
                    {
                        id: 'carnot-challenge',
                        title: '挑戰卡諾定理',
                        content: '理解如何在等溫條件下產生電能',
                        target: '#temperature-slider',
                        action: 'demonstrate',
                        task: '保持溫度不變，觀察是否仍有電流產生',
                        quiz: {
                            question: '為什麼這個技術挑戰了卡諾定理？',
                            options: ['超過了效率極限', '在等溫下產生功', '逆轉了熱流', '創造了能量'],
                            correct: 1,
                            explanation: '卡諾定理認為等溫系統無法產生功，但重力場改變了這個前提。'
                        }
                    },
                    {
                        id: 'entropy-reduction',
                        title: '熵值減少機制',
                        content: '探討重力場如何可能減少系統熵值',
                        target: '#show-formulas',
                        action: 'enable',
                        task: '開啟公式顯示，理解熵變計算',
                        quiz: {
                            question: '在什麼條件下系統熵可能減少？',
                            options: ['開放系統', '重力場存在', '外力作功', '以上皆可能'],
                            correct: 3,
                            explanation: '在特定條件下，局部熵減少是可能的，不違反熱力學第二定律。'
                        }
                    },
                    {
                        id: 'real-applications',
                        title: '實際應用前景',
                        content: '了解技術的商業化潛力和挑戰',
                        target: '#applications-impact',
                        action: 'scroll-to',
                        quiz: {
                            question: '這項技術最有前景的應用領域是什麼？',
                            options: ['太空探索', '偏遠地區供電', '大型發電廠', '電動汽車'],
                            correct: 1,
                            explanation: '對於無法建設電網的偏遠地區，這是理想的獨立電源。'
                        }
                    }
                ]
            }
        };
    }

    /**
     * Initialize achievement system
     */
    initializeAchievements() {
        return [
            {
                id: 'first-simulation',
                title: '初次模擬',
                description: '完成第一次粒子模擬',
                icon: '🔬',
                points: 10
            },
            {
                id: 'physics-expert',
                title: '物理專家',
                description: '完成所有物理原理模組',
                icon: '⚛️',
                points: 50
            },
            {
                id: 'ion-master',
                title: '離子大師',
                description: '測試所有離子系統',
                icon: '⚡',
                points: 30
            },
            {
                id: 'quiz-champion',
                title: '測驗冠軍',
                description: '所有測驗答對率達 90%',
                icon: '🏆',
                points: 100
            },
            {
                id: 'carnot-challenger',
                title: '卡諾挑戰者',
                description: '理解並演示卡諾定理的突破',
                icon: '🌟',
                points: 75
            }
        ];
    }

    /**
     * Initialize educational system
     */
    init() {
        this.createUI();
        this.loadProgress();
        this.setupEventListeners();
        console.log('Educational Modules initialized');
    }

    /**
     * Create educational UI elements
     */
    createUI() {
        // Create overlay for guided tours
        this.overlay = document.createElement('div');
        this.overlay.className = 'educational-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: none;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(this.overlay);

        // Create tooltip for explanations
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'educational-tooltip';
        this.tooltip.style.cssText = `
            position: absolute;
            background: linear-gradient(135deg, #1e3a8a, #3b82f6);
            color: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            z-index: 10001;
            display: none;
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        document.body.appendChild(this.tooltip);

        // Create progress bar
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'educational-progress';
        this.progressBar.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 8px;
            padding: 12px;
            z-index: 10002;
            display: none;
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        document.body.appendChild(this.progressBar);

        // Create module selector
        this.createModuleSelector();
    }

    /**
     * Create module selector interface
     */
    createModuleSelector() {
        const selector = document.createElement('div');
        selector.id = 'educational-module-selector';
        selector.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: linear-gradient(135deg, #0f172a, #1e293b);
            border-radius: 12px;
            padding: 16px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            z-index: 9999;
            min-width: 280px;
        `;

        selector.innerHTML = `
            <h3 style="color: #f1f5f9; margin: 0 0 12px 0; font-size: 16px;">
                🎓 教育模組
            </h3>
            <div id="module-buttons" style="display: flex; flex-direction: column; gap: 8px;">
                ${Object.values(this.modules).map(module => `
                    <button class="module-btn" data-module="${module.id}" 
                            style="background: linear-gradient(135deg, #3b82f6, #6366f1);
                                   color: white; border: none; padding: 10px 12px;
                                   border-radius: 8px; cursor: pointer; font-size: 14px;
                                   transition: all 0.2s ease;">
                        ${this.getDifficultyIcon(module.difficulty)} ${module.title}
                        <div style="font-size: 12px; opacity: 0.8; margin-top: 2px;">
                            ${module.duration} 分鐘 · ${module.steps.length} 步驟
                        </div>
                    </button>
                `).join('')}
            </div>
            <button id="close-modules" style="background: #ef4444; color: white; 
                    border: none; padding: 8px 12px; border-radius: 6px; 
                    cursor: pointer; font-size: 12px; margin-top: 12px; width: 100%;">
                關閉教育模組
            </button>
        `;

        document.body.appendChild(selector);
    }

    /**
     * Get difficulty icon
     */
    getDifficultyIcon(difficulty) {
        const icons = {
            beginner: '🌱',
            intermediate: '⚡',
            advanced: '🚀'
        };
        return icons[difficulty] || '📚';
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Module selection
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('module-btn')) {
                const moduleId = e.target.dataset.module;
                this.startModule(moduleId);
            }

            if (e.target.id === 'close-modules') {
                this.hideModuleSelector();
            }
        });

        // Overlay click to close
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.stopCurrentModule();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.isActive) {
                if (e.key === 'Escape') {
                    this.stopCurrentModule();
                } else if (e.key === 'Enter' || e.key === ' ') {
                    this.nextStep();
                }
            }
        });
    }

    /**
     * Start an educational module
     */
    startModule(moduleId) {
        if (!this.modules[moduleId]) {
            console.error(`Module ${moduleId} not found`);
            return;
        }

        this.currentModule = this.modules[moduleId];
        this.currentStepIndex = 0;
        this.isActive = true;

        this.showOverlay();
        this.updateProgress();
        this.executeCurrentStep();

        console.log(`Started educational module: ${moduleId}`);
    }

    /**
     * Execute current step
     */
    executeCurrentStep() {
        const step = this.getCurrentStep();
        if (!step) {
            this.completeModule();
            return;
        }

        this.highlightTarget(step.target);
        this.showTooltip(step);

        // Execute step action
        this.executeStepAction(step);
    }

    /**
     * Execute step-specific action
     */
    executeStepAction(step) {
        switch (step.action) {
            case 'highlight':
                this.highlightElement(step.target);
                break;
            case 'interact':
                this.enableInteraction(step.target);
                break;
            case 'change-mode':
                this.suggestModeChange(step.target, step.value);
                break;
            case 'select-option':
                this.suggestOptionSelection(step.target, step.value);
                break;
            case 'demonstrate':
                this.demonstrateFeature(step.target, step.task);
                break;
            case 'scroll-to':
                this.scrollToElement(step.target);
                break;
            default:
                console.log(`Unknown action: ${step.action}`);
        }
    }

    /**
     * Show tooltip with step information
     */
    showTooltip(step) {
        this.tooltip.innerHTML = `
            <h4 style="margin: 0 0 12px 0; color: #fbbf24; font-size: 18px;">
                ${step.title}
            </h4>
            <p style="margin: 0 0 16px 0; line-height: 1.5; color: #e2e8f0;">
                ${step.content}
            </p>
            ${step.task ? `
                <div style="background: rgba(255, 255, 255, 0.1); padding: 12px; 
                            border-radius: 8px; margin: 12px 0; border-left: 4px solid #fbbf24;">
                    <strong style="color: #fbbf24;">任務：</strong> ${step.task}
                </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; margin-top: 16px;">
                <button onclick="window.educationalModules.previousStep()" 
                        style="background: #6b7280; color: white; border: none; 
                               padding: 8px 16px; border-radius: 6px; cursor: pointer;"
                        ${this.currentStepIndex === 0 ? 'disabled' : ''}>
                    上一步
                </button>
                <span style="color: #a1a1aa; font-size: 14px;">
                    ${this.currentStepIndex + 1} / ${this.currentModule.steps.length}
                </span>
                <button onclick="window.educationalModules.nextStep()" 
                        style="background: #10b981; color: white; border: none; 
                               padding: 8px 16px; border-radius: 6px; cursor: pointer;">
                    ${step.quiz ? '開始測驗' : '下一步'}
                </button>
            </div>
        `;

        this.positionTooltip(step.target);
        this.tooltip.style.display = 'block';
    }

    /**
     * Position tooltip near target element
     */
    positionTooltip(targetSelector) {
        const target = document.querySelector(targetSelector);
        if (!target) {return;}

        const rect = target.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();

        let top = rect.bottom + 10;
        let left = rect.left;

        // Adjust if tooltip goes off screen
        if (left + tooltipRect.width > window.innerWidth) {
            left = window.innerWidth - tooltipRect.width - 20;
        }

        if (top + tooltipRect.height > window.innerHeight) {
            top = rect.top - tooltipRect.height - 10;
        }

        this.tooltip.style.top = `${top}px`;
        this.tooltip.style.left = `${left}px`;
    }

    /**
     * Highlight target element
     */
    highlightTarget(targetSelector) {
        // Remove previous highlights
        document.querySelectorAll('.educational-highlight').forEach(el => {
            el.classList.remove('educational-highlight');
        });

        const target = document.querySelector(targetSelector);
        if (target) {
            target.classList.add('educational-highlight');

            // Add CSS for highlighting if not exists
            if (!document.getElementById('educational-styles')) {
                const style = document.createElement('style');
                style.id = 'educational-styles';
                style.textContent = `
                    .educational-highlight {
                        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5) !important;
                        border-radius: 8px !important;
                        transition: box-shadow 0.3s ease !important;
                        position: relative !important;
                        z-index: 9998 !important;
                    }
                    .educational-highlight::before {
                        content: '';
                        position: absolute;
                        top: -2px;
                        left: -2px;
                        right: -2px;
                        bottom: -2px;
                        background: linear-gradient(45deg, #3b82f6, #6366f1);
                        border-radius: 10px;
                        z-index: -1;
                        animation: educational-pulse 2s infinite;
                    }
                    @keyframes educational-pulse {
                        0%, 100% { opacity: 0.7; }
                        50% { opacity: 0.3; }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }

    /**
     * Go to next step
     */
    nextStep() {
        const step = this.getCurrentStep();

        // Show quiz if exists
        if (step && step.quiz && !step.quizCompleted) {
            this.showQuiz(step.quiz);
            return;
        }

        this.currentStepIndex++;
        this.updateProgress();
        this.executeCurrentStep();
    }

    /**
     * Go to previous step
     */
    previousStep() {
        if (this.currentStepIndex > 0) {
            this.currentStepIndex--;
            this.updateProgress();
            this.executeCurrentStep();
        }
    }

    /**
     * Show quiz for current step
     */
    showQuiz(quiz) {
        this.tooltip.innerHTML = `
            <h4 style="margin: 0 0 16px 0; color: #fbbf24; font-size: 18px;">
                💡 知識測驗
            </h4>
            <p style="margin: 0 0 16px 0; line-height: 1.5; color: #e2e8f0; font-weight: 500;">
                ${quiz.question}
            </p>
            <div style="margin: 16px 0;">
                ${quiz.options.map((option, index) => `
                    <button class="quiz-option" data-index="${index}" 
                            style="display: block; width: 100%; text-align: left; 
                                   background: rgba(255, 255, 255, 0.1); color: white; 
                                   border: 1px solid rgba(255, 255, 255, 0.2); 
                                   padding: 12px; margin: 8px 0; border-radius: 8px; 
                                   cursor: pointer; transition: all 0.2s ease;">
                        ${String.fromCharCode(65 + index)}. ${option}
                    </button>
                `).join('')}
            </div>
            <div id="quiz-feedback" style="margin-top: 16px; display: none;"></div>
        `;

        // Add quiz event listeners
        this.tooltip.querySelectorAll('.quiz-option').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleQuizAnswer(parseInt(e.target.dataset.index), quiz);
            });
        });
    }

    /**
     * Handle quiz answer
     */
    handleQuizAnswer(selectedIndex, quiz) {
        const feedbackDiv = this.tooltip.querySelector('#quiz-feedback');
        const correct = selectedIndex === quiz.correct;

        // Update progress
        if (!this.progress[this.currentModule.id]) {
            this.progress[this.currentModule.id] = {};
        }
        this.progress[this.currentModule.id].quizScore =
            (this.progress[this.currentModule.id].quizScore || 0) + (correct ? 1 : 0);

        feedbackDiv.innerHTML = `
            <div style="background: ${correct ? '#10b981' : '#ef4444'}; 
                        color: white; padding: 12px; border-radius: 8px;">
                <strong>${correct ? '✅ 正確！' : '❌ 不正確'}</strong>
                <p style="margin: 8px 0 0 0; font-size: 14px;">${quiz.explanation}</p>
            </div>
            <button onclick="window.educationalModules.nextStep()" 
                    style="background: #3b82f6; color: white; border: none; 
                           padding: 10px 20px; border-radius: 6px; cursor: pointer; 
                           margin-top: 12px; width: 100%;">
                繼續下一步
            </button>
        `;
        feedbackDiv.style.display = 'block';

        // Mark quiz as completed
        this.getCurrentStep().quizCompleted = true;

        // Check for achievements
        this.checkAchievements();
    }

    /**
     * Get current step
     */
    getCurrentStep() {
        if (!this.currentModule || this.currentStepIndex >= this.currentModule.steps.length) {
            return null;
        }
        return this.currentModule.steps[this.currentStepIndex];
    }

    /**
     * Complete current module
     */
    completeModule() {
        // Record completion
        this.progress[this.currentModule.id] = {
            ...this.progress[this.currentModule.id],
            completed: true,
            completedAt: new Date().toISOString()
        };

        // Show completion message
        this.tooltip.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: #10b981; margin: 0 0 16px 0; font-size: 24px;">
                    🎉 模組完成！
                </h3>
                <h4 style="color: #fbbf24; margin: 0 0 12px 0;">
                    ${this.currentModule.title}
                </h4>
                <p style="color: #e2e8f0; margin: 0 0 20px 0;">
                    恭喜您完成了這個教育模組！您已經掌握了重要的科學概念。
                </p>
                <div style="background: rgba(16, 185, 129, 0.1); padding: 16px; 
                            border-radius: 8px; margin: 16px 0; 
                            border: 1px solid rgba(16, 185, 129, 0.3);">
                    <p style="margin: 0; color: #34d399;">
                        🏆 獲得 ${this.currentModule.steps.length * 10} 學習積分
                    </p>
                </div>
                <button onclick="window.educationalModules.stopCurrentModule()" 
                        style="background: #3b82f6; color: white; border: none; 
                               padding: 12px 24px; border-radius: 8px; cursor: pointer; 
                               font-size: 16px;">
                    完成學習
                </button>
            </div>
        `;

        this.saveProgress();
        this.checkAchievements();
    }

    /**
     * Check and award achievements
     */
    checkAchievements() {
        // Implementation for achievement checking
        // This would check various conditions and award achievements
        console.log('Checking achievements...');
    }

    /**
     * Stop current module
     */
    stopCurrentModule() {
        this.isActive = false;
        this.currentModule = null;
        this.currentStepIndex = 0;

        this.hideOverlay();
        this.hideTooltip();
        this.hideProgress();
        this.clearHighlights();
    }

    /**
     * Show module selector
     */
    showModuleSelector() {
        const selector = document.getElementById('educational-module-selector');
        if (selector) {
            selector.style.display = 'block';
        }
    }

    /**
     * Hide module selector
     */
    hideModuleSelector() {
        const selector = document.getElementById('educational-module-selector');
        if (selector) {
            selector.style.display = 'none';
        }
    }

    /**
     * Show overlay
     */
    showOverlay() {
        this.overlay.style.display = 'block';
        setTimeout(() => {
            this.overlay.style.opacity = '1';
        }, 10);
    }

    /**
     * Hide overlay
     */
    hideOverlay() {
        this.overlay.style.opacity = '0';
        setTimeout(() => {
            this.overlay.style.display = 'none';
        }, 300);
    }

    /**
     * Hide tooltip
     */
    hideTooltip() {
        this.tooltip.style.display = 'none';
    }

    /**
     * Update progress display
     */
    updateProgress() {
        if (!this.currentModule) {return;}

        const progress = ((this.currentStepIndex + 1) / this.currentModule.steps.length) * 100;

        this.progressBar.innerHTML = `
            <div style="color: #f1f5f9; font-size: 14px; margin-bottom: 8px;">
                ${this.currentModule.title}
            </div>
            <div style="background: rgba(255, 255, 255, 0.2); height: 6px; border-radius: 3px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, #10b981, #34d399); 
                           height: 100%; width: ${progress}%; transition: width 0.3s ease;"></div>
            </div>
            <div style="color: #a1a1aa; font-size: 12px; margin-top: 4px;">
                步驟 ${this.currentStepIndex + 1} / ${this.currentModule.steps.length}
            </div>
        `;

        this.progressBar.style.display = 'block';
    }

    /**
     * Hide progress
     */
    hideProgress() {
        this.progressBar.style.display = 'none';
    }

    /**
     * Clear all highlights
     */
    clearHighlights() {
        document.querySelectorAll('.educational-highlight').forEach(el => {
            el.classList.remove('educational-highlight');
        });
    }

    /**
     * Save progress to localStorage
     */
    saveProgress() {
        localStorage.setItem('educationalProgress', JSON.stringify(this.progress));
    }

    /**
     * Load progress from localStorage
     */
    loadProgress() {
        const saved = localStorage.getItem('educationalProgress');
        if (saved) {
            this.progress = JSON.parse(saved);
        }
    }

    /**
     * Get learning statistics
     */
    getStats() {
        const completed = Object.values(this.progress).filter(p => p.completed).length;
        const totalQuizzes = Object.values(this.progress).reduce((sum, p) => sum + (p.quizScore || 0), 0);

        return {
            modulesCompleted: completed,
            totalModules: Object.keys(this.modules).length,
            quizScore: totalQuizzes,
            achievements: this.achievements.length,
            progress: this.progress
        };
    }
}

// Initialize and export
window.EducationalModules = EducationalModules;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.educationalModules = new EducationalModules();
        window.educationalModules.init();
    });
} else {
    window.educationalModules = new EducationalModules();
    window.educationalModules.init();
}