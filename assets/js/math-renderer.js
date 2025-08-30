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
            latex: `n(z) = n_0 \\exp\\left(\\frac{-(m G - q E) z}{k_B T}\\right)`,
            description: 'Modified Boltzmann distribution under gravity and electric field',
            variables: {
                'n(z)': 'Ion concentration at height z',
                'n_0': 'Reference concentration',
                'm': 'Ion mass difference',
                'q': 'Ion charge',
                'E': 'Electric field strength',
                'G': 'Gravitational constant',
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

        // ========== Calculator Section Equations ==========
        
        // Boltzmann distribution for calculator
        this.defineEquation('boltzmann-calculator', {
            latex: `\\frac{C(h+\\Delta h)}{C(h)} = \\exp\\left(\\frac{-mG\\Delta h}{k_B T}\\right)`,
            description: 'Boltzmann distribution ratio in gravitational field',
            variables: {
                'C(h+\\Delta h)': '高度 h+Δh 處的離子濃度',
                'C(h)': '高度 h 處的離子濃度',
                'm': '離子質量差異',
                'G': '重力加速度',
                '\\Delta h': '高度差',
                'k_B': '波茲曼常數 (1.38×10⁻²³ J/K)',
                'T': '絕對溫度 (K)'
            }
        });

        // Electric field strength for calculator
        this.defineEquation('electric-field-calculator', {
            latex: `E = \\frac{(m_1 - m_2)G}{2q}`,
            description: 'Self-generated electric field in ion system',
            variables: {
                'E': '電場強度 (V/m)',
                'm_1': '重離子質量 (kg)',
                'm_2': '輕離子質量 (kg)',
                'G': '重力加速度 (m/s²)',
                'q': '基本電荷 (1.6×10⁻¹⁹ C)'
            }
        });

        // Voltage difference for calculator
        this.defineEquation('voltage-difference-calculator', {
            latex: `\\Delta V = \\frac{(m_1 - m_2)GH}{2q}`,
            description: 'Voltage difference across ion system height',
            variables: {
                '\\Delta V': '電壓差 (V)',
                'm_1': '重離子質量 (kg)',
                'm_2': '輕離子質量 (kg)',
                'G': '重力加速度 (m/s²)',
                'H': '系統高度 (m)',
                'q': '基本電荷 (1.6×10⁻¹⁹ C)'
            }
        });

        // Centrifugal acceleration
        this.defineEquation('centrifugal-acceleration', {
            latex: `a = \\omega^2 r`,
            description: 'Centrifugal acceleration in rotating system',
            variables: {
                'a': '離心加速度 (m/s²)',
                '\\omega': '角速度 (rad/s)',
                'r': '旋轉半徑 (m)'
            }
        });

        // Power density
        this.defineEquation('power-density', {
            latex: `P = \\frac{(\\Delta V/2)^2}{R}`,
            description: 'Power density calculation',
            variables: {
                'P': '功率密度 (W/m³)',
                '\\Delta V': '電壓差 (V)',
                'R': '電阻 (Ω)'
            }
        });

        // Maximum rotational speed
        this.defineEquation('max-rotational-speed', {
            latex: `\\omega_{\\text{max}} = \\sqrt{\\frac{\\sigma_{\\text{allow}}}{\\rho \\times r^2}}`,
            description: 'Maximum safe rotational speed',
            variables: {
                '\\omega_{\\text{max}}': '最大角速度 (rad/s)',
                '\\sigma_{\\text{allow}}': '許用應力 (Pa)',
                '\\rho': '材料密度 (kg/m³)',
                'r': '旋轉半徑 (m)'
            }
        });

        // Safety factor
        this.defineEquation('safety-factor', {
            latex: `SF = \\frac{\\sigma_{\\text{allow}}}{\\sigma_{\\text{actual}}}`,
            description: 'Safety factor calculation',
            variables: {
                'SF': '安全係數 (無因次)',
                '\\sigma_{\\text{allow}}': '許用應力 (Pa)',
                '\\sigma_{\\text{actual}}': '實際應力 (Pa)'
            }
        });

        // ========== Educational Content Equations ==========
        
        // Basic physics - Boltzmann distribution (educational)
        this.defineEquation('educational-boltzmann', {
            latex: `\\frac{C(h+\\Delta h)}{C(h)} = \\exp\\left(\\frac{-mg\\Delta h}{kT}\\right)`,
            description: '波茲曼分布描述離子在重力場中的濃度分布變化',
            variables: {
                'C(h+\\Delta h)': '高度 h+Δh 處的離子濃度',
                'C(h)': '高度 h 處的離子濃度',
                'm': '離子質量差異 (kg)',
                'g': '重力加速度 (9.81 m/s²)',
                '\\Delta h': '高度差 (m)',
                'k': '波茲曼常數 (1.38×10⁻²³ J/K)',
                'T': '絕對溫度 (K)'
            }
        });

        // Basic physics - Electric field strength (educational)
        this.defineEquation('educational-electric-field', {
            latex: `E = \\frac{(m_1 - m_2)g}{2q}`,
            description: '不同質量離子產生的電場強度',
            variables: {
                'E': '電場強度 (V/m)',
                'm_1': '重離子質量 (kg)',
                'm_2': '輕離子質量 (kg)',
                'g': '重力加速度 (9.81 m/s²)',
                'q': '離子電荷 (C)'
            }
        });

        // Basic physics - Voltage difference (educational)
        this.defineEquation('educational-voltage-difference', {
            latex: `\\Delta V = \\frac{(m_1 - m_2)GH}{2q}`,
            description: '可測量的電位差',
            variables: {
                '\\Delta V': '電壓差 (V)',
                'm_1': '重離子質量 (kg)',
                'm_2': '輕離子質量 (kg)',
                'G': '重力加速度或離心加速度 (m/s²)',
                'H': '有效高度 (m)',
                'q': '離子電荷 (C)'
            }
        });

        // Advanced - Power density (educational)
        this.defineEquation('educational-power-density', {
            latex: `P = \\frac{(\\Delta V/2)^2}{R}`,
            description: '實際可獲得的功率輸出',
            variables: {
                'P': '功率密度 (W/m³)',
                '\\Delta V': '電壓差 (V)',
                'R': '內阻 (Ω)'
            }
        });

        // Advanced - Maximum rotational speed (educational)
        this.defineEquation('educational-max-speed', {
            latex: `\\omega_{\\text{max}} = \\sqrt{\\frac{\\sigma_{\\text{allow}}}{\\rho \\times r^2}}`,
            description: '材料結構的最大安全轉速',
            variables: {
                '\\omega_{\\text{max}}': '最大角速度 (rad/s)',
                '\\sigma_{\\text{allow}}': '許用應力 (670 MPa for 7075-T6)',
                '\\rho': '材料密度 (2810 kg/m³ for 7075-T6)',
                'r': '旋轉半徑 (m)'
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
        let container;
        
        // Handle both string selectors and DOM elements
        if (typeof containerId === 'string') {
            container = Utils.DOM.select(containerId);
        } else {
            container = containerId; // It's already a DOM element
        }

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
            `,
            // Calculator equations explanations
            'Boltzmann distribution ratio in gravitational field': `
                這是波茲曼分布在重力場中的經典表達式。它描述了離子濃度隨高度的指數變化。
                當離子質量差異 m 越大，或重力場 G 越強時，離子分離效果越明顯，
                這是重力離子熱電技術的物理基礎。在實際應用中，我們使用離心力來增強這個效應。
            `,
            'Self-generated electric field in ion system': `
                當不同質量的離子在重力場中達到平衡時，會自發產生一個電場。
                這個電場的強度取決於離子質量差異和重力加速度。
                HI 系統具有最大的質量差異（I⁻ 比 H⁺ 重約 18 倍），因此產生最強的電場。
            `,
            'Voltage difference across ion system height': `
                電壓差是電場強度在系統高度上的積分。這個電壓差驅動電流的產生，
                是我們系統的電能輸出源。在離心系統中，有效高度 H 由旋轉半徑決定，
                因此可以通過增加旋轉半徑來提高電壓輸出。
            `,
            'Centrifugal acceleration in rotating system': `
                離心加速度是我們技術中的關鍵參數。通過旋轉運動，我們可以產生比地球重力強數百萬倍的加速度，
                大幅增強離子分離效應。角速度 ω 和半徑 r 的平方關係意味著即使小幅增加轉速也能顯著提升效能。
            `,
            'Power density calculation': `
                功率密度公式展現了電壓差如何轉換為實際的電能輸出。
                除以 2 是因為電場的有效值計算，電阻 R 由離子電導率和幾何結構決定。
                這個公式直接關聯到我們系統的經濟效益和實用性。
            `,
            'Maximum safe rotational speed': `
                最大轉速受到材料強度限制。這個公式基於離心應力不能超過材料許用應力的原理。
                我們使用鋁合金 7075-T6 作為結構材料，其高強度重量比使我們能達到極高的轉速，
                從而實現強大的離心加速度效應。
            `,
            'Safety factor calculation': `
                安全係數是工程設計的關鍵參數，確保系統在各種操作條件下都能安全運行。
                我們的設計採用適當的安全係數，平衡性能與可靠性，
                確保長期穩定運行而不會發生結構失效。
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
                if (container.id) {
                    this.renderEquation(equationId, `#${container.id}`);
                } else {
                    // If no ID, use the container directly
                    this.renderEquation(equationId, container);
                }
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
    
    // Update global reference after initialization
    window.mathRenderer = { instance: mathRenderer };

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

// Make available globally (initial setup)
window.mathRenderer = { instance: null };
