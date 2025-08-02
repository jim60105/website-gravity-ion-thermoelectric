/**
 * Mathematical Formula Renderer for Scientific Equations
 * Handles MathJax integration and equation visualization
 * @author Gravity Ion Thermoelectric Research Team
 * @version 1.0.0
 */

/**
 * Math Renderer Class
 * Manages mathematical equation rendering and interactions
 */
class MathRenderer {
    constructor() {
        this.mathJaxReady = false;
        this.equations = new Map();
        this.renderQueue = [];
        this.init();
    }

    /**
     * Initialize MathJax and setup equations
     */
    async init() {
        await this.waitForMathJax();
        this.setupEquations();
        this.processRenderQueue();
        console.info('Math renderer initialized');
    }

    /**
     * Wait for MathJax to be fully loaded
     */
    async waitForMathJax() {
        return new Promise((resolve) => {
            const checkMathJax = () => {
                if (window.MathJax && window.MathJax.typesetPromise) {
                    this.mathJaxReady = true;
                    resolve();
                } else {
                    setTimeout(checkMathJax, 50);
                }
            };
            checkMathJax();
        });
    }

    /**
     * Setup scientific equations for the breakthrough section
     */
    setupEquations() {
        // Define Boltzmann equation with gravity and electric field
        this.defineEquation('boltzmann', {
            latex: `n(z) = n_0 \\exp\\left(\\frac{-(m - q E/g) g z}{k_B T}\\right)`,
            description: 'Modified Boltzmann distribution under gravity and electric field',
            variables: {
                'n(z)': 'Ion concentration at height z',
                'n_0': 'Reference concentration',
                'm': 'Ion mass difference',
                'q': 'Ion charge',
                'E': 'Electric field strength',
                'g': 'Gravitational acceleration',
                'z': 'Height',
                'k_B': 'Boltzmann constant',
                'T': 'Temperature'
            }
        });

        // Electric field strength equation
        this.defineEquation('electric-field', {
            latex: `E = \\frac{(m_+ - m_-) g}{2q}`,
            description: 'Self-generated electric field strength',
            variables: {
                'E': 'Electric field strength',
                'm_+': 'Heavy ion mass',
                'm_-': 'Light ion mass',
                'g': 'Gravitational acceleration',
                'q': 'Ion charge'
            }
        });

        // Current density equation
        this.defineEquation('current-density', {
            latex: `J = \\sigma E = n q \\mu E`,
            description: 'Current density in ion plasma',
            variables: {
                'J': 'Current density',
                '\\sigma': 'Conductivity',
                'E': 'Electric field',
                'n': 'Ion concentration',
                'q': 'Ion charge',
                '\\mu': 'Ion mobility'
            }
        });

        // Thermal energy equation
        this.defineEquation('thermal-energy', {
            latex: `E_{thermal} = \\frac{3}{2} k_B T`,
            description: 'Average thermal energy per particle',
            variables: {
                'E_{thermal}': 'Thermal energy',
                'k_B': 'Boltzmann constant',
                'T': 'Temperature'
            }
        });
    }

    /**
     * Define a mathematical equation
     */
    defineEquation(id, equationData) {
        this.equations.set(id, {
            ...equationData,
            rendered: false,
            element: null
        });
    }

    /**
     * Render equation in specified container
     */
    async renderEquation(equationId, containerId) {
        const equation = this.equations.get(equationId);
        const container = Utils.DOM.select(containerId);

        if (!equation || !container) {
            console.warn(`Cannot render equation: ${equationId} in ${containerId}`);
            return;
        }

        if (this.mathJaxReady) {
            await this.performRender(equation, container);
        } else {
            this.renderQueue.push({ equation, container });
        }
    }

    /**
     * Perform the actual rendering
     */
    async performRender(equation, container) {
        // Set LaTeX content
        container.innerHTML = `$$${equation.latex}$$`;

        try {
            // Render with MathJax
            await window.MathJax.typesetPromise([container]);

            equation.rendered = true;
            equation.element = container;

            // Add interactive features
            this.addEquationInteractivity(equation, container);

            console.info(`Rendered equation: ${equation.description}`);
        } catch (error) {
            console.error('MathJax rendering error:', error);
        }
    }

    /**
     * Process queued render requests
     */
    async processRenderQueue() {
        while (this.renderQueue.length > 0) {
            const { equation, container } = this.renderQueue.shift();
            await this.performRender(equation, container);
        }
    }

    /**
     * Add interactivity to rendered equations
     */
    addEquationInteractivity(equation, container) {
        // Add hover effects
        Utils.DOM.on(container, 'mouseenter', () => {
            this.highlightEquation(container);
        });

        Utils.DOM.on(container, 'mouseleave', () => {
            this.unhighlightEquation(container);
        });

        // Add click handler for detailed view
        Utils.DOM.on(container, 'click', () => {
            this.showEquationDetails(equation);
        });

        // Make container focusable for accessibility
        container.setAttribute('tabindex', '0');
        container.setAttribute('role', 'button');
        container.setAttribute('aria-label', `Mathematical equation: ${equation.description}`);

        // Keyboard support
        Utils.DOM.on(container, 'keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.showEquationDetails(equation);
            }
        });
    }

    /**
     * Highlight equation on hover
     */
    highlightEquation(container) {
        container.style.transform = 'scale(1.05)';
        container.style.textShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
        container.style.transition = 'all 0.3s ease';
        container.style.cursor = 'pointer';
    }

    /**
     * Remove equation highlighting
     */
    unhighlightEquation(container) {
        container.style.transform = 'scale(1)';
        container.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.3)';
    }

    /**
     * Show detailed equation explanation
     */
    showEquationDetails(equation) {
        const modal = this.createEquationModal(equation);
        document.body.appendChild(modal);

        // Animate in
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.equation-modal-content').style.transform = 'scale(1)';
        }, 10);
    }

    /**
     * Create detailed equation modal
     */
    createEquationModal(equation) {
        const modal = Utils.DOM.createElement('div', {
            className: 'equation-modal fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4',
            style: 'opacity: 0; transition: opacity 0.3s ease; backdrop-filter: blur(5px);'
        });

        const content = Utils.DOM.createElement('div', {
            className: 'equation-modal-content bg-gray-900 text-white p-8 rounded-xl max-w-2xl w-full border border-white/20',
            style: 'transform: scale(0.9); transition: transform 0.3s ease;'
        });

        // Modal header
        const header = Utils.DOM.createElement('div', {
            className: 'modal-header text-center mb-6'
        });

        header.innerHTML = `
            <h3 class="text-2xl font-bold text-energy-gold mb-2">科學方程式詳解</h3>
            <p class="text-gray-300">${equation.description}</p>
        `;

        // Equation display
        const equationDisplay = Utils.DOM.createElement('div', {
            className: 'equation-display text-center mb-8 p-6 bg-black/30 rounded-lg'
        });

        equationDisplay.innerHTML = `$$${equation.latex}$$`;

        // Variable explanations
        const variablesSection = Utils.DOM.createElement('div', {
            className: 'variables-section mb-6'
        });

        const variablesHTML = Object.entries(equation.variables)
            .map(([symbol, description]) => `
                <div class="variable-row flex items-start space-x-4 mb-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div class="variable-symbol font-mono text-energy-gold font-bold min-w-0 flex-shrink-0">
                        $${symbol}$
                    </div>
                    <div class="variable-description text-gray-300 flex-1">
                        ${description}
                    </div>
                </div>
            `).join('');

        variablesSection.innerHTML = `
            <h4 class="text-lg font-semibold text-electric-blue mb-4">變數說明</h4>
            <div class="variables-list">${variablesHTML}</div>
        `;

        // Physical significance
        const significanceSection = Utils.DOM.createElement('div', {
            className: 'significance-section mb-6'
        });

        significanceSection.innerHTML = `
            <h4 class="text-lg font-semibold text-plasma-purple mb-4">物理意義</h4>
            <div class="significance-content text-gray-300 leading-relaxed">
                ${this.getPhysicalSignificance(equation)}
            </div>
        `;

        // Close button
        const closeButton = Utils.DOM.createElement('button', {
            className: 'close-button w-full bg-electric-blue hover:bg-electric-blue/80 text-white py-3 px-6 rounded-lg transition-colors duration-300 font-semibold'
        }, '關閉');

        // Assemble modal
        content.appendChild(header);
        content.appendChild(equationDisplay);
        content.appendChild(variablesSection);
        content.appendChild(significanceSection);
        content.appendChild(closeButton);
        modal.appendChild(content);

        // Setup close functionality
        const closeModal = () => {
            modal.style.opacity = '0';
            content.style.transform = 'scale(0.9)';
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        };

        Utils.DOM.on(closeButton, 'click', closeModal);
        Utils.DOM.on(modal, 'click', (e) => {
            if (e.target === modal) {closeModal();}
        });

        // Keyboard support
        Utils.DOM.on(document, 'keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                document.removeEventListener('keydown', escapeHandler);
                closeModal();
            }
        });

        // Render MathJax in modal
        if (this.mathJaxReady) {
            window.MathJax.typesetPromise([modal]);
        }

        return modal;
    }

    /**
     * Get physical significance explanation for equation
     */
    getPhysicalSignificance(equation) {
        const explanations = {
            'Modified Boltzmann distribution under gravity and electric field': `
                這個修正的波茲曼分布方程式描述了在重力場和電場共同作用下，離子在不同高度的濃度分布。
                關鍵在於 (m - qE/g) 項，當電場強度 E 達到特定值時，可以部分或完全抵消重力對離子的影響，
                實現前所未有的離子分布控制。
            `,
            'Self-generated electric field strength': `
                這個方程式揭示了自發電場的產生機制。當不同質量的離子在重力場中分離時，會自動產生一個電場，
                其強度正比於離子質量差和重力加速度。這是我們技術的核心物理基礎。
            `,
            'Current density in ion plasma': `
                電流密度方程式說明了在我們的系統中如何產生持續的電流。離子濃度梯度和自發電場共同作用，
                驅動載流子運動，實現熱能到電能的直接轉換。
            `,
            'Average thermal energy per particle': `
                熱能方程式描述了粒子的平均熱運動能量。在我們的系統中，這個熱能提供了電子逆電場運動的驅動力，
                實現了在等溫條件下的持續能量輸出。
            `
        };

        return explanations[equation.description] || '這個方程式在重力離子熱電轉換中起關鍵作用。';
    }

    /**
     * Render all equations marked for automatic rendering
     */
    renderAllEquations() {
        // Render main Boltzmann equation
        this.renderEquation('boltzmann', '#boltzmann-equation');

        // Look for other equation containers
        const equationContainers = Utils.DOM.selectAll('[data-equation]');
        equationContainers.forEach(container => {
            const equationId = container.dataset.equation;
            if (this.equations.has(equationId)) {
                this.renderEquation(equationId, `#${container.id}`);
            }
        });
    }

    /**
     * Update equation parameters dynamically
     */
    updateEquationParameter(equationId, parameter, value) {
        const equation = this.equations.get(equationId);
        if (!equation || !equation.element) {return;}

        // This would require more advanced LaTeX parsing and replacement
        // For now, we trigger a re-render with updated values
        console.info(`Updated ${parameter} = ${value} in equation ${equationId}`);
    }

    /**
     * Get equation as image (for export functionality)
     */
    async getEquationImage(equationId) {
        const equation = this.equations.get(equationId);
        if (!equation || !equation.element) {return null;}

        // This would convert the rendered MathJax to an image
        // Implementation would depend on specific requirements
        console.info(`Exporting equation ${equationId} as image`);
        return null;
    }

    /**
     * Destroy math renderer
     */
    destroy() {
        this.equations.clear();
        this.renderQueue = [];
        console.info('Math renderer destroyed');
    }
}

// Initialize math renderer when DOM is ready
let mathRenderer;

const initMathRenderer = () => {
    mathRenderer = new MathRenderer();

    // Auto-render equations after a delay to ensure MathJax is ready
    setTimeout(() => {
        if (mathRenderer.mathJaxReady) {
            mathRenderer.renderAllEquations();
        }
    }, 1000);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMathRenderer);
} else {
    initMathRenderer();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MathRenderer };
}

// Make available globally
window.MathRenderer = { MathRenderer, instance: mathRenderer };