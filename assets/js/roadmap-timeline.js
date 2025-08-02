/**
 * Development Roadmap Timeline Interactive Component
 * Handles the interactive timeline for technology development milestones
 * @author Gravity Ion Thermoelectric Research Team
 */

class RoadmapTimeline {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.milestones = [
            {
                year: '2025',
                title: '小規模驗證',
                description: '完成實驗室原型驗證，建立基礎生產流程',
                achievements: ['實驗室原型完成', '效率參數確認', '專利申請完成'],
                progress: 75,
                color: '#059669'
            },
            {
                year: '2027',
                title: '商業化原型',
                description: '開發可商業化原型，進行市場測試',
                achievements: ['原型機量產', '市場驗證完成', '合作伙伴建立'],
                progress: 45,
                color: '#0EA5E9'
            },
            {
                year: '2030',
                title: '大規模部署',
                description: '實現規模化生產，開始商業部署',
                achievements: ['工廠建設完成', '產品標準化', '市場占有率5%'],
                progress: 20,
                color: '#8B5CF6'
            },
            {
                year: '2035',
                title: '全球推廣',
                description: '全球範圍推廣應用，成為主流能源技術',
                achievements: ['全球市場進入', '技術標準確立', '市場占有率25%'],
                progress: 5,
                color: '#F59E0B'
            }
        ];

        this.currentMilestone = 0;

        this.init();
    }

    init() {
        if (!this.container) {return;}

        this.renderTimeline();
        this.setupInteractivity();
        this.setupProgressAnimation();
    }

    renderTimeline() {
        const timelineHTML = `
            <div class="roadmap-timeline-container relative">
                <!-- Timeline Line -->
                <div class="timeline-line absolute left-8 top-16 bottom-0 w-1 bg-gradient-to-b from-green-500 via-blue-500 via-purple-500 to-yellow-500 opacity-30"></div>
                
                <!-- Milestones -->
                <div class="milestones-container space-y-12">
                    ${this.milestones.map((milestone, index) => this.renderMilestone(milestone, index)).join('')}
                </div>
                
                <!-- Interactive Controls -->
                <div class="timeline-controls mt-12 flex justify-center space-x-4">
                    <button id="timeline-prev" class="control-btn bg-gray-600 hover:bg-gray-700 text-gray-800 px-4 py-2 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    <button id="timeline-play" class="control-btn bg-green-600 hover:bg-green-700 text-gray-800 px-6 py-2 rounded-lg transition-colors">
                        自動播放
                    </button>
                    <button id="timeline-next" class="control-btn bg-gray-600 hover:bg-gray-700 text-gray-800 px-4 py-2 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        this.container.innerHTML = timelineHTML;
    }

    renderMilestone(milestone, index) {
        return `
            <div class="milestone-item relative flex items-start space-x-6 opacity-60 transition-opacity duration-500" data-milestone="${index}">
                <!-- Milestone Marker -->
                <div class="milestone-marker relative z-10 w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-gray-600 font-bold text-lg transition-all duration-300"
                     style="background: linear-gradient(135deg, ${milestone.color}, ${this.adjustBrightness(milestone.color, -20)})">
                    ${milestone.year.slice(-2)}
                </div>
                
                <!-- Milestone Content -->
                <div class="milestone-content flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <!-- Header -->
                    <div class="milestone-header mb-4">
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-2xl font-bold text-gray-800">${milestone.year} - ${milestone.title}</h3>
                            <div class="progress-indicator text-sm text-gray-600">
                                進度: ${milestone.progress}%
                            </div>
                        </div>
                        <p class="text-gray-800 text-lg">${milestone.description}</p>
                    </div>
                    
                    <!-- Progress Bar -->
                    <div class="progress-bar-container mb-4">
                        <div class="progress-bar bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div class="progress-fill h-full rounded-full transition-all duration-1000 ease-out"
                                 style="width: 0%; background: linear-gradient(90deg, ${milestone.color}, ${this.adjustBrightness(milestone.color, 20)})">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Achievements -->
                    <div class="achievements">
                        <h4 class="text-lg font-semibold text-gray-800 mb-3">關鍵成果</h4>
                        <ul class="space-y-2">
                            ${milestone.achievements.map(achievement => `
                                <li class="flex items-center space-x-3 text-gray-800">
                                    <div class="achievement-icon w-2 h-2 rounded-full" style="background-color: ${milestone.color}"></div>
                                    <span>${achievement}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    setupInteractivity() {
        // Previous/Next buttons
        const prevBtn = this.container.querySelector('#timeline-prev');
        const nextBtn = this.container.querySelector('#timeline-next');
        const playBtn = this.container.querySelector('#timeline-play');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousMilestone());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextMilestone());
        }

        if (playBtn) {
            playBtn.addEventListener('click', () => this.toggleAutoPlay());
        }

        // Milestone click events
        this.container.querySelectorAll('.milestone-item').forEach((item, index) => {
            item.addEventListener('click', () => this.goToMilestone(index));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isTimelineVisible()) {return;}

            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousMilestone();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextMilestone();
                    break;
                case ' ':
                    e.preventDefault();
                    this.toggleAutoPlay();
                    break;
            }
        });
    }

    setupProgressAnimation() {
        // Intersection Observer for scroll-triggered animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProgressBars();
                    this.highlightCurrentMilestone();
                }
            });
        }, {
            threshold: 0.3
        });

        observer.observe(this.container);
    }

    animateProgressBars() {
        this.container.querySelectorAll('.milestone-item').forEach((item, index) => {
            const progressFill = item.querySelector('.progress-fill');
            const milestone = this.milestones[index];

            setTimeout(() => {
                if (progressFill) {
                    progressFill.style.width = `${milestone.progress}%`;
                }
            }, index * 200);
        });
    }

    goToMilestone(index) {
        if (index < 0 || index >= this.milestones.length) {return;}

        this.currentMilestone = index;
        this.highlightCurrentMilestone();
        this.updateControls();
    }

    highlightCurrentMilestone() {
        this.container.querySelectorAll('.milestone-item').forEach((item, index) => {
            if (index === this.currentMilestone) {
                item.classList.remove('opacity-60');
                item.classList.add('opacity-100');
                item.querySelector('.milestone-marker').style.transform = 'scale(1.1)';
                item.querySelector('.milestone-marker').style.boxShadow = `0 0 20px ${this.milestones[index].color}`;
            } else {
                item.classList.remove('opacity-100');
                item.classList.add('opacity-60');
                item.querySelector('.milestone-marker').style.transform = 'scale(1)';
                item.querySelector('.milestone-marker').style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }
        });

        // Scroll to current milestone
        const currentItem = this.container.querySelector(`[data-milestone="${this.currentMilestone}"]`);
        if (currentItem) {
            currentItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    previousMilestone() {
        if (this.currentMilestone > 0) {
            this.goToMilestone(this.currentMilestone - 1);
        }
    }

    nextMilestone() {
        if (this.currentMilestone < this.milestones.length - 1) {
            this.goToMilestone(this.currentMilestone + 1);
        }
    }

    toggleAutoPlay() {
        const playBtn = this.container.querySelector('#timeline-play');

        if (this.autoPlayInterval) {
            // Stop auto play
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
            if (playBtn) {playBtn.textContent = '自動播放';}
        } else {
            // Start auto play
            this.autoPlayInterval = setInterval(() => {
                if (this.currentMilestone < this.milestones.length - 1) {
                    this.nextMilestone();
                } else {
                    this.goToMilestone(0); // Loop back to start
                }
            }, 3000);
            if (playBtn) {playBtn.textContent = '停止播放';}
        }
    }

    updateControls() {
        const prevBtn = this.container.querySelector('#timeline-prev');
        const nextBtn = this.container.querySelector('#timeline-next');

        if (prevBtn) {
            prevBtn.disabled = this.currentMilestone === 0;
            prevBtn.classList.toggle('opacity-50', this.currentMilestone === 0);
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentMilestone === this.milestones.length - 1;
            nextBtn.classList.toggle('opacity-50', this.currentMilestone === this.milestones.length - 1);
        }
    }

    isTimelineVisible() {
        const rect = this.container.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    adjustBrightness(color, percent) {
        // Simple color brightness adjustment
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    // Public method to get current milestone data
    getCurrentMilestone() {
        return this.milestones[this.currentMilestone];
    }

    // Public method to add new milestone
    addMilestone(milestone) {
        this.milestones.push(milestone);
        this.renderTimeline();
        this.setupInteractivity();
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const timelineContainer = document.getElementById('development-roadmap');
    if (timelineContainer) {
        window.roadmapTimeline = new RoadmapTimeline('development-roadmap');
    }
});
