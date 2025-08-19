/**
 * 研究成果標籤頁組件
 * 處理研究成果區塊的標籤頁切換功能
 * 永久展開模式，符合 "Always Stay Expand" 設計原則
 * 結合深度技術解析影片和實驗數據兩個內容區塊
 * @author Gravity Ion Thermoelectric Research Team
 * @version 3.0.0
 */

class ResearchResultsTabs {
    constructor() {
        this.contentContainer = null;
        this.activeTab = 'academic-paper';
        this.tabButtons = new Map();
        this.tabContents = new Map();
        this.videosLoaded = false;
        this.imagesLoaded = false;
        this.paperLoaded = false;

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
        this.initializeTabs(); // 立即初始化標籤頁內容
    }

    /**
     * 找到 DOM 元素
     */
    findElements() {
        this.contentContainer = document.getElementById('unified-accordion-content');

        if (!this.contentContainer) {
            console.error('ResearchResultsTabs: Content container not found');
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
            const tabId = content.id.replace('-content', '').replace('tech-videos', 'tech-videos').replace('experiment-data', 'experiment-data').replace('academic-paper', 'academic-paper');
            this.tabContents.set(tabId, content);
        });

        return true;
    }

    /**
     * 設置事件監聽器
     */
    setupEventListeners() {
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

        // 視窗大小變化時重新計算高度（雖然不再需要手風琴高度，但保留以防萬一）
        window.addEventListener('resize', Utils.Performance.debounce(() => {
            // 可在此處添加響應式邏輯
        }, 250));
    }

    /**
     * 設置無障礙功能
     */
    setupAccessibility() {
        // 設置內容容器的基本 ARIA 屬性
        this.contentContainer.setAttribute('role', 'region');
        this.contentContainer.setAttribute('aria-label', '研究成果詳細內容');

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
     * 初始化標籤頁內容（立即載入所有內容）
     */
    initializeTabs() {
        // 立即載入所有標籤頁內容，因為現在永久可見
        this.loadTabContent(this.activeTab);
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

        // 載入對應內容（立即載入，因為內容永久可見）
        this.loadTabContent(targetTab);
    }

    /**
     * 載入標籤頁內容
     * @param {string} tabId - 標籤頁 ID
     */
    loadTabContent(tabId) {
        switch (tabId) {
            case 'academic-paper':
                this.loadAcademicPaper();
                break;
            case 'tech-videos':
                this.loadVideos();
                break;
            case 'experiment-data':
                this.loadExperimentImages();
                break;
        }
    }

    /**
     * 載入學術論文 PDF
     */
    loadAcademicPaper() {
        if (this.paperLoaded) {
            return;
        }

        const pdfContainer = this.tabContents.get('academic-paper').querySelector('.pdf-viewer-container');
        const iframe = document.getElementById('academic-paper-pdf');

        if (pdfContainer && iframe) {
            // 添加載入動畫
            pdfContainer.style.opacity = '0';
            pdfContainer.style.transform = 'translateY(20px)';
            pdfContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

            // 確保 PDF 載入
            iframe.onload = () => {
                setTimeout(() => {
                    pdfContainer.style.opacity = '1';
                    pdfContainer.style.transform = 'translateY(0)';
                }, 200);
            };

            // 錯誤處理
            iframe.onerror = () => {
                this.handlePdfError(pdfContainer);
            };

            this.paperLoaded = true;
        }
    }

    /**
     * 處理 PDF 載入錯誤
     */
    handlePdfError(container) {
        console.error('PDF loading failed');
        
        const errorMessage = document.createElement('div');
        errorMessage.className = 'pdf-error flex flex-col items-center justify-center h-full text-gray-400 text-center p-8';
        errorMessage.innerHTML = `
            <div class="mb-4 text-4xl">📄</div>
            <div class="text-lg mb-2">PDF 載入失敗</div>
            <div class="text-sm mb-4">請嘗試重新整理頁面或直接下載檔案</div>
            <a href="assets/docs/5-an-exception-to-carnots-theorem-inferred-from-tolmans-experiment-ion-containing-fluids-driving-continuous-heat-to-electricity-conversion-under-acceleration-jci-web-c.pdf" 
               target="_blank"
               class="text-energy-gold hover:underline">
                直接下載 PDF
            </a>
        `;
        
        const iframe = container.querySelector('iframe');
        if (iframe) {
            iframe.style.display = 'none';
            container.appendChild(errorMessage);
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
}

// 當 DOM 載入完成時初始化組件
let tabsInstance = null;
document.addEventListener('DOMContentLoaded', () => {
    tabsInstance = new ResearchResultsTabs();
});



// 導出給其他模組使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResearchResultsTabs;
}
