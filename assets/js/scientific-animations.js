/**
 * Scientific Animations for the Scientific Breakthrough Section
 * Handles animations for the mechanism explanation, equation rendering, and interactive elements
 * @author Gravity Ion Thermoelectric Research Team
 * @version 1.0.0
 */

/**
 * Scientific Animation Manager
 * Coordinates all scientific visualizations and interactions
 */
class ScientificAnimationManager {
    constructor() {
        this.mathJaxLoaded = false;
        this.activeEquation = null;
        this.variableExplanations = new Map();
        this.init();
    }

    /**
     * Initialize scientific animations
     */
    async init() {
        // Wait for MathJax to load
        await this.waitForMathJax();

        // Initialize components
        this.setupBoltzmannEquation();
        this.setupVariableInteractions();
        this.setupMechanismAnimations();
        this.setupComparisonCardAnimations();
        this.setupTimelineAnimations();

        console.info('Scientific animations initialized');
    }

    /**
     * Wait for MathJax to be loaded and ready
     */
    async waitForMathJax() {
        return new Promise((resolve) => {
            const checkMathJax = () => {
                if (window.MathJax && window.MathJax.typesetPromise) {
                    this.mathJaxLoaded = true;
                    resolve();
                } else {
                    setTimeout(checkMathJax, 100);
                }
            };
            checkMathJax();
        });
    }

    /**
     * Setup Boltzmann equation rendering and animation
     */
    setupBoltzmannEquation() {
        const equationContainer = Utils.DOM.select('#boltzmann-equation');
        if (!equationContainer) {return;}

        // Define the Boltzmann equation with gravity and electric field terms
        const boltzmannEquation = `
            $$n(z) = n_0 \\exp\\left(\\frac{-(m G - q E) z}{k_B T}\\right)$$
        `;

        // Set the equation content
        equationContainer.innerHTML = boltzmannEquation;

        // Render with MathJax
        if (this.mathJaxLoaded) {
            window.MathJax.typesetPromise([equationContainer]).then(() => {
                this.animateEquation(equationContainer);
            });
        }

        // Setup variable explanations
        this.variableExplanations.set('n', {
            symbol: 'n(z)',
            description: '高度 z 處的離子濃度',
            unit: 'mol/L',
            color: '#ffd700'
        });

        this.variableExplanations.set('m', {
            symbol: 'm',
            description: '離子質量（重離子質量減去輕離子質量）',
            unit: 'kg',
            color: '#3b82f6'
        });

        this.variableExplanations.set('G', {
            symbol: 'G',
            description: '重力常數',
            unit: 'm³/kg⋅s²',
            color: '#8a2be2'
        });

        this.variableExplanations.set('E', {
            symbol: 'E',
            description: '自發產生的電場強度',
            unit: 'V/m',
            color: '#ffd700'
        });
    }

    /**
     * Animate equation appearance
     */
    animateEquation(container) {
        container.style.opacity = '0';
        container.style.transform = 'scale(0.8)';

        // Add animation class
        Utils.DOM.addClass(container, 'equation-animation');

        // Fade in animation
        setTimeout(() => {
            container.style.transition = 'all 1s ease-out';
            container.style.opacity = '1';
            container.style.transform = 'scale(1)';
        }, 500);
    }

    /**
     * Setup variable explanation interactions
     */
    setupVariableInteractions() {
        const variables = Utils.DOM.selectAll('.variable-explanations .variable');

        variables.forEach(variable => {
            const variableKey = variable.dataset.variable;
            const explanation = this.variableExplanations.get(variableKey);

            if (explanation) {
                // Hover effects
                Utils.DOM.on(variable, 'mouseenter', () => {
                    this.highlightVariable(variable, explanation);
                });

                Utils.DOM.on(variable, 'mouseleave', () => {
                    this.unhighlightVariable(variable);
                });

                // Click for detailed explanation
                Utils.DOM.on(variable, 'click', () => {
                    this.showVariableDetails(explanation);
                });
            }
        });
    }

    /**
     * Highlight variable in equation
     */
    highlightVariable(element, explanation) {
        Utils.DOM.addClass(element, 'active');

        // Show tooltip
        this.showTooltip(element, explanation);

        // Highlight corresponding term in equation
        this.highlightEquationTerm(explanation.symbol);
    }

    /**
     * Remove variable highlighting
     */
    unhighlightVariable(element) {
        Utils.DOM.removeClass(element, 'active');
        this.hideTooltip();
        this.unhighlightEquationTerm();
    }

    /**
     * Show tooltip with variable information
     */
    showTooltip(element, explanation) {
        // Remove existing tooltip
        this.hideTooltip();

        const tooltip = Utils.DOM.createElement('div', {
            className: 'variable-tooltip absolute z-50 bg-black/90 text-white p-3 rounded-lg shadow-lg border border-white/20',
            style: 'pointer-events: none; opacity: 0; transition: opacity 0.3s ease;'
        });

        tooltip.innerHTML = `
            <div class="font-bold text-${explanation.color.replace('#', '')} mb-1">${explanation.symbol}</div>
            <div class="text-sm text-gray-300 mb-1">${explanation.description}</div>
            <div class="text-xs text-gray-400">單位: ${explanation.unit}</div>
        `;

        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 10}px`;
        tooltip.style.transform = 'translateX(-50%) translateY(-100%)';

        document.body.appendChild(tooltip);

        // Fade in
        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 10);

        this.activeTooltip = tooltip;
    }

    /**
     * Hide tooltip
     */
    hideTooltip() {
        if (this.activeTooltip && this.activeTooltip.parentNode) {
            this.activeTooltip.style.opacity = '0';
            setTimeout(() => {
                if (this.activeTooltip && this.activeTooltip.parentNode) {
                    this.activeTooltip.parentNode.removeChild(this.activeTooltip);
                }
                this.activeTooltip = null;
            }, 300);
        }
    }

    /**
     * Highlight term in equation (placeholder for future enhancement)
     */
    highlightEquationTerm(_symbol) {
        // This would require more complex MathJax integration
        // For now, we just add a glow effect to the entire equation
        const equation = Utils.DOM.select('#boltzmann-equation');
        if (equation) {
            equation.style.textShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
        }
    }

    /**
     * Remove equation highlighting
     */
    unhighlightEquationTerm() {
        const equation = Utils.DOM.select('#boltzmann-equation');
        if (equation) {
            equation.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.3)';
        }
    }

    /**
     * Show detailed variable explanation
     */
    showVariableDetails(explanation) {
        // Create modal with detailed explanation
        const modal = Utils.DOM.createElement('div', {
            className: 'fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4',
            style: 'backdrop-filter: blur(5px);'
        });

        const content = Utils.DOM.createElement('div', {
            className: 'bg-gray-900 text-white p-8 rounded-xl max-w-md w-full border border-white/20'
        });

        content.innerHTML = `
            <div class="text-center mb-6">
                <div class="text-4xl font-bold mb-2" style="color: ${explanation.color}">${explanation.symbol}</div>
                <h3 class="text-xl font-semibold">${explanation.description}</h3>
            </div>
            <div class="space-y-4 text-gray-300">
                <div>
                    <strong>單位：</strong> ${explanation.unit}
                </div>
                <div>
                    <strong>物理意義：</strong> 
                    ${this.getPhysicalMeaning(explanation.symbol)}
                </div>
                <div>
                    <strong>在實驗中的作用：</strong>
                    ${this.getExperimentalRole(explanation.symbol)}
                </div>
            </div>
            <button class="w-full mt-6 bg-electric-blue hover:bg-electric-blue/80 text-white py-2 px-4 rounded-lg transition-colors duration-300">
                關閉
            </button>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Close modal
        const closeBtn = content.querySelector('button');
        const closeModal = () => {
            modal.style.opacity = '0';
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        };

        Utils.DOM.on(closeBtn, 'click', closeModal);
        Utils.DOM.on(modal, 'click', (e) => {
            if (e.target === modal) {closeModal();}
        });

        // Fade in
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }

    /**
     * Get physical meaning of variable
     */
    getPhysicalMeaning(symbol) {
        const meanings = {
            'n(z)': '表示在不同高度處離子的分佈密度，反映重力場對離子分離的影響程度。',
            'm': '質量差決定了重力分離的強度，質量差越大，分離效果越明顯。',
            'g': '重力場提供分離離子的驅動力，是整個機制的基礎。',
            'E': '由離子分離自發產生的電場，這個電場是持續電流產生的關鍵。'
        };
        return meanings[symbol] || '這個變數在重力離子分離機制中起重要作用。';
    }

    /**
     * Get experimental role of variable
     */
    getExperimentalRole(symbol) {
        const roles = {
            'n(z)': '通過測量不同高度的離子濃度，我們可以驗證理論預測的分離模式。',
            'm': '選擇合適的離子對（如鋰離子和鉀離子）來最大化質量差效應。',
            'g': '可以通過離心實驗來增強重力效應，驗證機制的有效性。',
            'E': '電場強度的測量直接證明了自發電場的存在和持續性。'
        };
        return roles[symbol] || '此變數的實驗測量有助於驗證理論模型。';
    }

    /**
     * Setup mechanism step animations
     */
    setupMechanismAnimations() {
        const stepCards = Utils.DOM.selectAll('.mechanism-steps .step-card');

        stepCards.forEach((card, index) => {
            // Add staggered entrance animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';

            setTimeout(() => {
                card.style.transition = 'all 0.6s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200 + 500);

            // Add interactive animations
            Utils.DOM.on(card, 'mouseenter', () => {
                if (!Utils.Device.prefersReducedMotion()) {
                    this.animateStepCard(card);
                }
            });
        });
    }

    /**
     * Animate step card on hover
     */
    animateStepCard(card) {
        const stepNumber = card.querySelector('.step-number');
        if (stepNumber) {
            stepNumber.style.animation = 'scientific-pulse 1s ease-in-out';
            setTimeout(() => {
                stepNumber.style.animation = '';
            }, 1000);
        }
    }

    /**
     * Setup comparison card animations
     */
    setupComparisonCardAnimations() {
        const comparisonCards = Utils.DOM.selectAll('.comparison-cards .comparison-card');

        comparisonCards.forEach((card, index) => {
            // Staggered entrance
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';

            setTimeout(() => {
                card.style.transition = 'all 0.8s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 300 + 800);

            // Interactive image switching
            const traditionalImg = card.querySelector('.traditional-view img');
            const breakthroughImg = card.querySelector('.breakthrough-view img');

            if (traditionalImg && breakthroughImg) {
                Utils.DOM.on(card, 'mouseenter', () => {
                    this.switchComparisonImages(traditionalImg, breakthroughImg);
                });

                Utils.DOM.on(card, 'mouseleave', () => {
                    this.resetComparisonImages(traditionalImg, breakthroughImg);
                });
            }
        });
    }

    /**
     * Switch comparison images on hover
     */
    switchComparisonImages(traditionalImg, breakthroughImg) {
        traditionalImg.style.transform = 'scale(0.95)';
        traditionalImg.style.opacity = '0.6';
        breakthroughImg.style.transform = 'scale(1.05)';
        breakthroughImg.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.3)';
    }

    /**
     * Reset comparison images
     */
    resetComparisonImages(traditionalImg, breakthroughImg) {
        traditionalImg.style.transform = 'scale(1)';
        traditionalImg.style.opacity = '1';
        breakthroughImg.style.transform = 'scale(1)';
        breakthroughImg.style.boxShadow = 'none';
    }

    /**
     * Setup timeline animations
     */
    setupTimelineAnimations() {
        const timelineItems = Utils.DOM.selectAll('.timeline-item');

        // Animate timeline items in sequence
        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';

            setTimeout(() => {
                item.style.transition = 'all 0.6s ease-out';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 400 + 300);
        });

        // Animate timeline line
        const timelineLine = Utils.DOM.select('.timeline-line');
        if (timelineLine) {
            timelineLine.style.height = '0';
            timelineLine.style.transition = 'height 2s ease-out';

            setTimeout(() => {
                timelineLine.style.height = '100%';
            }, 800);
        }
    }

    /**
     * Destroy scientific animations
     */
    destroy() {
        this.hideTooltip();
        this.variableExplanations.clear();
        console.info('Scientific animations destroyed');
    }
}

// Initialize when DOM is ready
let scientificAnimationManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        scientificAnimationManager = new ScientificAnimationManager();
    });
} else {
    scientificAnimationManager = new ScientificAnimationManager();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ScientificAnimationManager };
}

// Make available globally
window.ScientificAnimations = { ScientificAnimationManager, instance: scientificAnimationManager };
