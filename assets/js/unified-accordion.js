/**
 * 統一手風琴組件
 * 處理包含標籤頁的手風琴展開/收合功能
 * 結合深度技術解析影片和實驗數據兩個內容區塊
 * @author Gravity Ion Thermoelectric Research Team
 * @version 2.0.0
 */

class UnifiedAccordion {
    constructor() {
        this.triggerButton = null;
        this.contentContainer = null;
        this.isExpanded = false;
        this.activeTab = 'tech-videos';
        this.tabButtons = new Map();
        this.tabContents = new Map();
        this.videosLoaded = false;
        this.imagesLoaded = false;

        this.init();
    }

    /**
     * 初始化組件
     */
    init() {
        if (!this.findElements()) {
            return;
        }
        this.setupEventListeners();
        this.setupAccessibility();
        this.setupTabSystem();
        this.setupLazyLoading();
    }

    /**
     * 找到 DOM 元素
     */
    findElements() {
        this.triggerButton = document.getElementById('unified-accordion-toggle');
        this.contentContainer = document.getElementById('unified-accordion-content');

        if (!this.triggerButton || !this.contentContainer) {
            console.error('UnifiedAccordion: Required elements not found');
            return false;
        }

        // 找到所有標籤頁按鈕和內容
        const tabButtons = this.contentContainer.querySelectorAll('.tab-button');
        const tabContents = this.contentContainer.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            const tabId = button.dataset.tab;
            this.tabButtons.set(tabId, button);
        });

        tabContents.forEach(content => {
            const tabId = content.id.replace('-content', '').replace('tech-videos', 'tech-videos').replace('experiment-data', 'experiment-data');
            this.tabContents.set(tabId, content);
        });

        return true;
    }

    /**
     * 設置事件監聽器
     */
    setupEventListeners() {
        // 手風琴主要觸發按鈕
        this.triggerButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggle();
        });

        this.triggerButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggle();
            }
        });

        // 標籤頁按鈕
        this.tabButtons.forEach((button, tabId) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(tabId);
            });

            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.switchTab(tabId);
                }
            });
        });

        // 視窗大小變化時重新計算高度
        window.addEventListener('resize', Utils.Performance.debounce(() => {
            if (this.isExpanded) {
                this.updateContentHeight();
            }
        }, 250));
    }

    /**
     * 設置無障礙功能
     */
    setupAccessibility() {
        // 設置主觸發按鈕的 ARIA 屬性
        this.triggerButton.setAttribute('role', 'button');
        this.triggerButton.setAttribute('aria-expanded', 'false');
        this.triggerButton.setAttribute('aria-controls', 'unified-accordion-content');

        this.contentContainer.setAttribute('role', 'region');
        this.contentContainer.setAttribute('aria-labelledby', 'unified-accordion-toggle');
        this.contentContainer.setAttribute('aria-hidden', 'true');

        // 設置標籤頁的 ARIA 屬性
        this.tabButtons.forEach((button, tabId) => {
            button.setAttribute('role', 'tab');
            button.setAttribute('aria-controls', `${tabId}-content`);
            button.setAttribute('aria-selected', tabId === this.activeTab ? 'true' : 'false');
        });

        this.tabContents.forEach((content, tabId) => {
            content.setAttribute('role', 'tabpanel');
            content.setAttribute('aria-labelledby', `${tabId}-tab`);
        });
    }

    /**
     * 設置標籤頁系統
     */
    setupTabSystem() {
        // 確保初始狀態正確
        this.switchTab(this.activeTab, false);
    }

    /**
     * 設置圖片延遲載入
     */
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            img.classList.add('loaded');
                            observer.unobserve(img);
                        }
                    }
                });
            });

            // 觀察所有延遲載入的圖片
            const lazyImages = this.contentContainer.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * 切換展開/收合狀態
     */
    toggle() {
        if (this.isExpanded) {
            this.collapse();
        } else {
            this.expand();
        }
    }

    /**
     * 展開手風琴
     */
    expand() {
        if (this.isExpanded) {
            return;
        }

        this.isExpanded = true;
        
        // 更新按鈕狀態
        this.updateButtonState();
        
        // 計算內容高度並展開
        this.updateContentHeight();
        
        // 更新可及性屬性
        this.triggerButton.setAttribute('aria-expanded', 'true');
        this.contentContainer.setAttribute('aria-hidden', 'false');
        
        // 平滑動畫
        this.contentContainer.style.opacity = '1';
        
        // 載入對應標籤頁的內容
        this.loadTabContent(this.activeTab);
        
        // 添加展開後的動畫效果
        setTimeout(() => {
            this.animateContentIn();
        }, 300);
    }

    /**
     * 收合手風琴
     */
    collapse() {
        if (!this.isExpanded) {
            return;
        }

        this.isExpanded = false;
        
        // 更新按鈕狀態
        this.updateButtonState();
        
        // 收合動畫
        this.contentContainer.style.maxHeight = '0';
        this.contentContainer.style.opacity = '0';
        
        // 更新可及性屬性
        this.triggerButton.setAttribute('aria-expanded', 'false');
        this.contentContainer.setAttribute('aria-hidden', 'true');
    }

    /**
     * 切換標籤頁
     * @param {string} targetTab - 目標標籤頁 ID
     * @param {boolean} animate - 是否需要動畫效果
     */
    switchTab(targetTab, animate = true) {
        if (targetTab === this.activeTab) {
            return;
        }

        // 更新標籤頁按鈕狀態
        this.tabButtons.forEach((button, tabId) => {
            const isActive = tabId === targetTab;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-selected', isActive ? 'true' : 'false');
            
            if (isActive) {
                button.classList.add('text-energy-gold', 'bg-white/10', 'border-energy-gold');
                button.classList.remove('text-gray-300', 'border-transparent');
            } else {
                button.classList.remove('text-energy-gold', 'bg-white/10', 'border-energy-gold');
                button.classList.add('text-gray-300', 'border-transparent');
            }
        });

        // 更新標籤頁內容顯示狀態
        this.tabContents.forEach((content, tabId) => {
            const isActive = tabId === targetTab;
            
            if (animate) {
                if (isActive) {
                    content.classList.remove('hidden');
                    content.classList.add('active');
                    // 淡入動畫
                    content.style.opacity = '0';
                    content.style.transform = 'translateY(10px)';
                    
                    requestAnimationFrame(() => {
                        content.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        content.style.opacity = '1';
                        content.style.transform = 'translateY(0)';
                    });
                } else {
                    content.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                    content.style.opacity = '0';
                    content.style.transform = 'translateY(-10px)';
                    
                    setTimeout(() => {
                        content.classList.add('hidden');
                        content.classList.remove('active');
                    }, 200);
                }
            } else {
                content.classList.toggle('hidden', !isActive);
                content.classList.toggle('active', isActive);
            }
        });

        this.activeTab = targetTab;
        
        // 載入對應內容
        if (this.isExpanded) {
            this.loadTabContent(targetTab);
            setTimeout(() => {
                this.updateContentHeight();
            }, 300);
        }
    }

    /**
     * 載入標籤頁內容
     * @param {string} tabId - 標籤頁 ID
     */
    loadTabContent(tabId) {
        switch (tabId) {
            case 'tech-videos':
                this.loadVideos();
                break;
            case 'experiment-data':
                this.loadExperimentImages();
                break;
        }
    }

    /**
     * 載入影片內容
     */
    loadVideos() {
        if (this.videosLoaded) {
            return;
        }
        
        // 影片已經在 HTML 中直接嵌入，這裡主要是確保載入狀態
        this.videosLoaded = true;
    }

    /**
     * 載入實驗圖片
     */
    loadExperimentImages() {
        if (this.imagesLoaded) {
            return;
        }
        
        const images = this.tabContents.get('experiment-data').querySelectorAll('.experiment-image-item');
        
        images.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 150);
        });
        
        this.imagesLoaded = true;
    }

    /**
     * 更新按鈕狀態
     */
    updateButtonState() {
        const buttonText = this.triggerButton.querySelector('.accordion-text');
        if (buttonText) {
            buttonText.textContent = this.isExpanded ? '收合' : '詳細資料';
        }
    }

    /**
     * 更新內容高度
     */
    updateContentHeight() {
        if (!this.isExpanded) {
            return;
        }
        
        const innerContent = this.contentContainer.querySelector('.accordion-inner-content');
        if (innerContent) {
            const height = innerContent.scrollHeight;
            this.contentContainer.style.maxHeight = `${height + 40}px`; // 加一些餘量
        }
    }

    /**
     * 內容進入動畫
     */
    animateContentIn() {
        const activeContent = this.tabContents.get(this.activeTab);
        if (!activeContent) {
            return;
        }
        
        const elements = activeContent.querySelectorAll('.video-wrapper, .experiment-image-item');
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}

// 當 DOM 載入完成時初始化組件
let accordionInstance = null;
document.addEventListener('DOMContentLoaded', () => {
    accordionInstance = new UnifiedAccordion();
});

/**
 * 全域函數：開啟實驗數據標籤頁
 * 從研究成果卡片點擊時呼叫
 */
window.openExperimentDataTab = function() {
    if (!accordionInstance) {
        console.error('Accordion instance not initialized');
        return;
    }
    
    // 如果手風琴未展開，先展開它
    if (!accordionInstance.isExpanded) {
        accordionInstance.toggle();
    }
    
    // 切換到實驗數據標籤頁
    setTimeout(() => {
        accordionInstance.switchTab('experiment-data');
    }, accordionInstance.isExpanded ? 0 : 300); // 如果需要展開，等待動畫完成
};

// 導出給其他模組使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnifiedAccordion;
}
