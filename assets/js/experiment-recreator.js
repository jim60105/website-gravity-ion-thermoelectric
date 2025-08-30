/**
 * Experiment Recreator Module
 * Recreates historical physics experiments (Tolman 1910) and modern validations
 * Provides interactive simulation of real experimental conditions
 */

/* global PhysicsEngine, alert */

class ExperimentRecreator {
    constructor() {
        this.experiments = this.initializeExperiments();
        this.currentExperiment = null;
        this.isRunning = false;
        this.experimentData = [];
        this.timer = null;

        // Virtual laboratory setup
        this.labEquipment = {
            centrifuge: { rpm: 0, maxRpm: 5000, acceleration: 0 },
            voltmeter: { precision: 0.1, range: '±50mV' },
            thermometer: { temperature: 298, stability: 0.1 },
            samples: [],
            dataLogger: { recording: false, interval: 1000 }
        };

        // Experimental conditions
        this.conditions = {
            temperature: 298, // K
            pressure: 101325, // Pa
            humidity: 45, // %
            vibration: 0.001, // m/s²
            electromagnetic: 'shielded'
        };
    }

    /**
     * Initialize available experiments
     */
    initializeExperiments() {
        return {
            'tolman-1910': {
                id: 'tolman-1910',
                title: 'Tolman 1910 重現實驗',
                description: '重現 Tolman 的原始實驗，觀察電解質溶液在重力場中的電位差',
                duration: 30, // minutes
                difficulty: 'intermediate',
                historicalContext: {
                    year: 1910,
                    scientist: 'Richard C. Tolman',
                    institution: 'University of California',
                    significance: '首次在實驗中觀察到重力場產生的電位差現象'
                },
                procedure: [
                    {
                        step: 1,
                        title: '樣品準備',
                        description: '準備 LiI 和 KI 電解質溶液',
                        duration: 5,
                        equipment: ['電解質溶液', '測量電極', '絕緣容器'],
                        parameters: {
                            concentration: '0.1 M',
                            volume: '50 mL',
                            temperature: '25°C'
                        }
                    },
                    {
                        step: 2,
                        title: '基線測量',
                        description: '在靜止狀態下測量初始電位差',
                        duration: 5,
                        equipment: ['高精度電壓表', '參考電極'],
                        expectedResult: '接近零電位差',
                        tolerance: '±0.5 mV'
                    },
                    {
                        step: 3,
                        title: '加速度實驗',
                        description: '將樣品置於旋轉離心機中進行測量',
                        duration: 15,
                        equipment: ['離心機', '旋轉電極', '數據記錄器'],
                        parameters: {
                            acceleration: '100-1000 m/s²',
                            duration: '10 分鐘',
                            dataPoints: '600 個'
                        }
                    },
                    {
                        step: 4,
                        title: '數據分析',
                        description: '分析電位差與加速度的關係',
                        duration: 5,
                        analysis: ['線性回歸', '統計分析', '誤差計算'],
                        expectedSlope: '與離子質量差成正比'
                    }
                ],
                results: {
                    LiI: { slope: 2.3e-8, unit: 'V⋅s²/m', correlation: 0.95 },
                    KI: { slope: 1.1e-8, unit: 'V⋅s²/m', correlation: 0.93 }
                }
            },

            'chen-2024-validation': {
                id: 'chen-2024-validation',
                title: 'Chen 2024 驗證實驗',
                description: '驗證 Chen 博士論文中的理論預測和實驗結果',
                duration: 45,
                difficulty: 'advanced',
                historicalContext: {
                    year: 2024,
                    scientist: 'Kuo Tso Chen',
                    institution: 'OPTROMAX Co. Taiwan',
                    significance: '首次證實重力場下的持續電流產生'
                },
                procedure: [
                    {
                        step: 1,
                        title: '高效率離子系統準備',
                        description: '準備 HI 氫碘酸系統以獲得最大功率密度',
                        duration: 10,
                        equipment: ['HI 溶液', '特製電極', '密封容器'],
                        parameters: {
                            concentration: '1.0 M',
                            purity: '>99.9%',
                            degassed: true
                        }
                    },
                    {
                        step: 2,
                        title: '環境控制設置',
                        description: '建立嚴格控制的實驗環境',
                        duration: 10,
                        equipment: ['溫控系統', '電磁屏蔽', '振動隔離'],
                        parameters: {
                            temperature: '25.0 ± 0.1°C',
                            humidity: '45 ± 5%',
                            emShielding: '>60 dB'
                        }
                    },
                    {
                        step: 3,
                        title: '長期穩定性測試',
                        description: '進行為期三個月的連續測量',
                        duration: 20,
                        equipment: ['數據記錄系統', '自動測量'],
                        parameters: {
                            samplingRate: '1 Hz',
                            duration: '90 天',
                            automation: '24/7'
                        }
                    },
                    {
                        step: 4,
                        title: '翻轉驗證實驗',
                        description: '通過樣品翻轉驗證重力效應',
                        duration: 5,
                        equipment: ['旋轉裝置', '即時監測'],
                        expectedResult: '電壓極性反轉',
                        responseTime: '<1 秒'
                    }
                ],
                results: {
                    steadyVoltage: { value: 12.0, unit: 'mV', stability: '±2%' },
                    currentDensity: { value: 1e-8, unit: 'A/cm²', duration: '90 天' },
                    flipResponse: { reversal: true, time: 0.8, unit: '秒' }
                }
            },

            'centrifuge-enhancement': {
                id: 'centrifuge-enhancement',
                title: '離心強化實驗',
                description: '測試離心力對電壓輸出的放大效應',
                duration: 20,
                difficulty: 'intermediate',
                procedure: [
                    {
                        step: 1,
                        title: '離心機校準',
                        description: '校準離心機轉速和加速度關係',
                        duration: 5,
                        equipment: ['離心機', '轉速計', '加速度計'],
                        calibration: 'a = ω²r'
                    },
                    {
                        step: 2,
                        title: '漸進式加速測試',
                        description: '逐步增加轉速，測量電壓變化',
                        duration: 10,
                        parameters: {
                            startRpm: 100,
                            endRpm: 3000,
                            increment: 100,
                            dwellTime: 30 // seconds
                        }
                    },
                    {
                        step: 3,
                        title: '高加速度驗證',
                        description: '在 10G 加速度下驗證電壓放大',
                        duration: 5,
                        parameters: {
                            acceleration: '10G',
                            expectedGain: '10×',
                            safetyLimit: '15G'
                        }
                    }
                ],
                results: {
                    linearRelation: true,
                    maxGain: 10.2,
                    maxAcceleration: '10G',
                    safetyMargin: '50%'
                }
            }
        };
    }

    /**
     * Initialize experiment recreator
     */
    init() {
        this.createLabInterface();
        this.setupVirtualEquipment();
        console.log('Experiment Recreator initialized');
    }

    /**
     * Create virtual laboratory interface
     */
    createLabInterface() {
        const labInterface = document.createElement('div');
        labInterface.id = 'virtual-laboratory';
        labInterface.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90vw;
            max-width: 1200px;
            height: 80vh;
            background: linear-gradient(135deg, #0f172a, #1e293b);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: none;
            padding: 24px;
            overflow-y: auto;
        `;

        labInterface.innerHTML = `
            <div class="lab-header" style="margin-bottom: 24px;">
                <h2 style="color: #f1f5f9; margin: 0 0 8px 0; display: flex; align-items: center; gap: 12px;">
                    🧪 虛擬物理實驗室
                    <button id="close-lab" style="margin-left: auto; background: #ef4444; 
                            color: white; border: none; padding: 8px 16px; 
                            border-radius: 8px; cursor: pointer;">關閉</button>
                </h2>
                <p style="color: #94a3b8; margin: 0;">重現歷史實驗，驗證科學理論</p>
            </div>

            <div class="lab-content" style="display: grid; grid-template-columns: 1fr 300px; gap: 24px;">
                <div class="experiment-area">
                    <div class="experiment-selector" style="margin-bottom: 20px;">
                        <h3 style="color: #fbbf24; margin: 0 0 12px 0;">選擇實驗</h3>
                        <div class="experiment-cards" style="display: grid; gap: 12px;">
                            ${Object.values(this.experiments).map(exp => `
                                <div class="experiment-card" data-experiment="${exp.id}"
                                     style="background: rgba(255, 255, 255, 0.05); padding: 16px; 
                                            border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);
                                            cursor: pointer; transition: all 0.2s ease;">
                                    <h4 style="color: #60a5fa; margin: 0 0 8px 0;">${exp.title}</h4>
                                    <p style="color: #cbd5e1; margin: 0 0 8px 0; font-size: 14px;">
                                        ${exp.description}
                                    </p>
                                    <div style="display: flex; justify-content: space-between; font-size: 12px; color: #94a3b8;">
                                        <span>⏱️ ${exp.duration} 分鐘</span>
                                        <span>📊 ${this.getDifficultyIcon(exp.difficulty)} ${exp.difficulty}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div id="experiment-workspace" style="background: rgba(0, 0, 0, 0.3); 
                         border-radius: 12px; padding: 20px; min-height: 300px; display: none;">
                        <div id="experiment-content"></div>
                    </div>
                </div>

                <div class="lab-equipment">
                    <h3 style="color: #fbbf24; margin: 0 0 12px 0;">實驗設備</h3>
                    
                    <div class="equipment-panel" style="background: rgba(255, 255, 255, 0.05); 
                         padding: 16px; border-radius: 12px; margin-bottom: 16px;">
                        <h4 style="color: #34d399; margin: 0 0 12px 0;">離心機</h4>
                        <div style="margin-bottom: 8px;">
                            <label style="color: #cbd5e1; font-size: 12px;">轉速 (RPM)</label>
                            <input type="range" id="centrifuge-rpm" min="0" max="5000" value="0"
                                   style="width: 100%; margin: 4px 0;">
                            <span id="rpm-display" style="color: #60a5fa; font-family: monospace;">0 RPM</span>
                        </div>
                        <div>
                            <span style="color: #fbbf24; font-size: 12px;">加速度：</span>
                            <span id="acceleration-display" style="color: #60a5fa; font-family: monospace;">0.0 G</span>
                        </div>
                    </div>

                    <div class="equipment-panel" style="background: rgba(255, 255, 255, 0.05); 
                         padding: 16px; border-radius: 12px; margin-bottom: 16px;">
                        <h4 style="color: #f87171; margin: 0 0 12px 0;">電壓表</h4>
                        <div style="background: #000; padding: 12px; border-radius: 8px; 
                                    font-family: monospace; text-align: center;">
                            <div id="voltage-reading" style="color: #00ff00; font-size: 18px; font-weight: bold;">
                                +0.000 mV
                            </div>
                            <div style="color: #888; font-size: 10px; margin-top: 4px;">
                                RANGE: ±50mV | PRECISION: 0.1mV
                            </div>
                        </div>
                    </div>

                    <div class="equipment-panel" style="background: rgba(255, 255, 255, 0.05); 
                         padding: 16px; border-radius: 12px;">
                        <h4 style="color: #a78bfa; margin: 0 0 12px 0;">環境控制</h4>
                        <div style="font-size: 12px; color: #cbd5e1;">
                            <div>🌡️ 溫度: <span style="color: #60a5fa;">25.0°C</span></div>
                            <div>💧 濕度: <span style="color: #60a5fa;">45%</span></div>
                            <div>🛡️ 電磁屏蔽: <span style="color: #34d399;">啟用</span></div>
                            <div>📳 振動隔離: <span style="color: #34d399;">啟用</span></div>
                        </div>
                    </div>

                    <button id="start-experiment" disabled
                            style="width: 100%; background: #10b981; color: white; 
                                   border: none; padding: 12px; border-radius: 8px; 
                                   cursor: pointer; font-weight: bold; margin-top: 16px;">
                        開始實驗
                    </button>
                </div>
            </div>

            <div id="experiment-results" style="margin-top: 24px; display: none;">
                <h3 style="color: #fbbf24; margin: 0 0 16px 0;">實驗結果</h3>
                <div id="results-content"></div>
            </div>
        `;

        document.body.appendChild(labInterface);
        this.setupLabEventListeners();
    }

    /**
     * Setup virtual equipment controls
     */
    setupVirtualEquipment() {
        // Centrifuge control
        const rpmSlider = document.getElementById('centrifuge-rpm');
        const rpmDisplay = document.getElementById('rpm-display');
        const accelerationDisplay = document.getElementById('acceleration-display');

        if (rpmSlider) {
            rpmSlider.addEventListener('input', (e) => {
                const rpm = parseInt(e.target.value);
                this.labEquipment.centrifuge.rpm = rpm;

                // Calculate acceleration (assuming 5cm radius)
                const radius = 0.05; // meters
                const omega = (rpm * 2 * Math.PI) / 60; // rad/s
                const acceleration = (omega * omega * radius) / 9.81; // in G

                this.labEquipment.centrifuge.acceleration = acceleration;

                if (rpmDisplay) {rpmDisplay.textContent = `${rpm} RPM`;}
                if (accelerationDisplay) {accelerationDisplay.textContent = `${acceleration.toFixed(1)} G`;}

                // Update voltage reading if experiment is running
                if (this.isRunning) {
                    this.updateVoltageReading();
                }
            });
        }
    }

    /**
     * Setup laboratory event listeners
     */
    setupLabEventListeners() {
        // Close laboratory
        document.getElementById('close-lab')?.addEventListener('click', () => {
            this.hideLaboratory();
        });

        // Experiment selection
        document.querySelectorAll('.experiment-card').forEach(card => {
            card.addEventListener('click', () => {
                const experimentId = card.dataset.experiment;
                this.selectExperiment(experimentId);
            });
        });

        // Start experiment button
        document.getElementById('start-experiment')?.addEventListener('click', () => {
            this.startCurrentExperiment();
        });
    }

    /**
     * Select an experiment
     */
    selectExperiment(experimentId) {
        this.currentExperiment = this.experiments[experimentId];

        // Update UI
        document.querySelectorAll('.experiment-card').forEach(card => {
            card.style.background = card.dataset.experiment === experimentId
                ? 'rgba(59, 130, 246, 0.2)'
                : 'rgba(255, 255, 255, 0.05)';
        });

        // Show workspace
        const workspace = document.getElementById('experiment-workspace');
        const content = document.getElementById('experiment-content');

        if (workspace && content) {
            workspace.style.display = 'block';
            content.innerHTML = this.generateExperimentContent(this.currentExperiment);
        }

        // Enable start button
        const startButton = document.getElementById('start-experiment');
        if (startButton) {
            startButton.disabled = false;
            startButton.style.background = '#10b981';
        }
    }

    /**
     * Generate experiment content
     */
    generateExperimentContent(experiment) {
        return `
            <h3 style="color: #60a5fa; margin: 0 0 16px 0;">${experiment.title}</h3>
            
            ${experiment.historicalContext ? `
                <div style="background: rgba(255, 215, 0, 0.1); padding: 16px; 
                            border-radius: 8px; margin: 16px 0; border-left: 4px solid #fbbf24;">
                    <h4 style="color: #fbbf24; margin: 0 0 8px 0;">歷史背景</h4>
                    <p style="color: #e2e8f0; margin: 0; font-size: 14px;">
                        <strong>${experiment.historicalContext.scientist}</strong> 
                        (${experiment.historicalContext.year}) - 
                        ${experiment.historicalContext.institution}<br>
                        <em>${experiment.historicalContext.significance}</em>
                    </p>
                </div>
            ` : ''}

            <div style="margin: 20px 0;">
                <h4 style="color: #34d399; margin: 0 0 12px 0;">實驗程序</h4>
                <div class="procedure-steps">
                    ${experiment.procedure.map((step, index) => `
                        <div class="procedure-step" style="background: rgba(255, 255, 255, 0.03); 
                             padding: 12px; margin: 8px 0; border-radius: 8px; 
                             border-left: 4px solid #60a5fa;">
                            <h5 style="color: #60a5fa; margin: 0 0 8px 0;">
                                步驟 ${step.step}: ${step.title}
                            </h5>
                            <p style="color: #cbd5e1; margin: 0 0 8px 0; font-size: 14px;">
                                ${step.description}
                            </p>
                            ${step.parameters ? `
                                <div style="font-size: 12px; color: #94a3b8;">
                                    參數: ${Object.entries(step.parameters).map(([key, value]) =>
                                        `${key}: ${value}`).join(' | ')}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>

            <div style="background: rgba(16, 185, 129, 0.1); padding: 16px; 
                        border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.3);">
                <h4 style="color: #34d399; margin: 0 0 8px 0;">預期結果</h4>
                <p style="color: #e2e8f0; margin: 0; font-size: 14px;">
                    根據理論計算和歷史數據，此實驗應該觀察到與重力場強度成正比的電位差。
                </p>
            </div>
        `;
    }

    /**
     * Start current experiment
     */
    startCurrentExperiment() {
        if (!this.currentExperiment || this.isRunning) {return;}

        this.isRunning = true;
        this.experimentData = [];

        // Update UI
        const startButton = document.getElementById('start-experiment');
        if (startButton) {
            startButton.textContent = '實驗進行中...';
            startButton.style.background = '#f59e0b';
            startButton.disabled = true;
        }

        // Start data collection
        this.startDataCollection();

        // Show progress
        this.showExperimentProgress();

        console.log(`Started experiment: ${this.currentExperiment.id}`);
    }

    /**
     * Start data collection
     */
    startDataCollection() {
        this.timer = setInterval(() => {
            if (!this.isRunning) {return;}

            const dataPoint = this.collectDataPoint();
            this.experimentData.push(dataPoint);

            // Update real-time displays
            this.updateVoltageReading();
            this.updateDataChart();

        }, this.labEquipment.dataLogger.interval);
    }

    /**
     * Collect a single data point
     */
    collectDataPoint() {
        const timestamp = Date.now();
        const acceleration = this.labEquipment.centrifuge.acceleration;

        // Calculate voltage based on physics
        const voltage = this.calculateTheoreticalVoltage(acceleration);

        // Add realistic noise
        const noise = (Math.random() - 0.5) * 0.2; // ±0.1 mV noise
        const measuredVoltage = voltage + noise;

        return {
            timestamp,
            acceleration,
            voltage: measuredVoltage,
            temperature: this.conditions.temperature,
            rpm: this.labEquipment.centrifuge.rpm
        };
    }

    /**
     * Calculate theoretical voltage based on acceleration
     */
    calculateTheoreticalVoltage(acceleration) {
        if (!this.currentExperiment) {return 0;}

        // Use PhysicsEngine for calculation
        const physicsEngine = new PhysicsEngine();

        // Get ion masses for current experiment
        let anionMass, cationMass;

        switch (this.currentExperiment.id) {
            case 'tolman-1910':
                anionMass = physicsEngine.CONSTANTS.ION_MASSES['I-'];
                cationMass = physicsEngine.CONSTANTS.ION_MASSES['Li+'];
                break;
            case 'chen-2024-validation':
                anionMass = physicsEngine.CONSTANTS.ION_MASSES['I-'];
                cationMass = physicsEngine.CONSTANTS.ION_MASSES['H+'];
                break;
            default:
                anionMass = physicsEngine.CONSTANTS.ION_MASSES['I-'];
                cationMass = physicsEngine.CONSTANTS.ION_MASSES['H+'];
        }

        // Calculate electric field
        const electricField = physicsEngine.calculateElectricField(
            anionMass, cationMass, acceleration * 9.81
        );

        // Convert to voltage (assuming 1cm height)
        const height = 0.01; // meters
        const voltage = electricField * height * 1000; // convert to mV

        return voltage;
    }

    /**
     * Update voltage reading display
     */
    updateVoltageReading() {
        const voltageDisplay = document.getElementById('voltage-reading');
        if (!voltageDisplay || !this.isRunning) {return;}

        const voltage = this.calculateTheoreticalVoltage(this.labEquipment.centrifuge.acceleration);
        const noise = (Math.random() - 0.5) * 0.1; // Small noise for realism
        const displayVoltage = voltage + noise;

        voltageDisplay.textContent = `${displayVoltage >= 0 ? '+' : ''}${displayVoltage.toFixed(3)} mV`;
        voltageDisplay.style.color = displayVoltage >= 0 ? '#00ff00' : '#ff4444';
    }

    /**
     * Show experiment progress
     */
    showExperimentProgress() {
        // Create progress overlay
        const progressDiv = document.createElement('div');
        progressDiv.id = 'experiment-progress';
        progressDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            z-index: 10001;
            min-width: 300px;
        `;

        progressDiv.innerHTML = `
            <h4 style="margin: 0 0 12px 0; color: #fbbf24;">實驗進行中</h4>
            <div style="margin: 8px 0;">
                <div style="color: #94a3b8; font-size: 12px;">數據點收集:</div>
                <div id="data-count" style="color: #60a5fa; font-family: monospace;">0 個</div>
            </div>
            <div style="margin: 8px 0;">
                <div style="color: #94a3b8; font-size: 12px;">實時電壓:</div>
                <div id="live-voltage" style="color: #34d399; font-family: monospace;">0.000 mV</div>
            </div>
            <button id="stop-experiment" style="background: #ef4444; color: white; 
                    border: none; padding: 8px 16px; border-radius: 6px; 
                    cursor: pointer; margin-top: 12px; width: 100%;">
                停止實驗
            </button>
        `;

        document.body.appendChild(progressDiv);

        // Update progress periodically
        const progressTimer = setInterval(() => {
            if (!this.isRunning) {
                clearInterval(progressTimer);
                return;
            }

            const dataCount = document.getElementById('data-count');
            const liveVoltage = document.getElementById('live-voltage');

            if (dataCount) {dataCount.textContent = `${this.experimentData.length} 個`;}
            if (liveVoltage && this.experimentData.length > 0) {
                const lastVoltage = this.experimentData[this.experimentData.length - 1].voltage;
                liveVoltage.textContent = `${lastVoltage.toFixed(3)} mV`;
            }
        }, 1000);

        // Stop experiment button
        document.getElementById('stop-experiment')?.addEventListener('click', () => {
            this.stopCurrentExperiment();
        });
    }

    /**
     * Stop current experiment
     */
    stopCurrentExperiment() {
        if (!this.isRunning) {return;}

        this.isRunning = false;

        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        // Update UI
        const startButton = document.getElementById('start-experiment');
        if (startButton) {
            startButton.textContent = '重新開始實驗';
            startButton.style.background = '#10b981';
            startButton.disabled = false;
        }

        // Remove progress overlay
        const progressDiv = document.getElementById('experiment-progress');
        if (progressDiv) {
            progressDiv.remove();
        }

        // Show results
        this.showExperimentResults();

        console.log(`Stopped experiment: ${this.currentExperiment.id}`);
    }

    /**
     * Show experiment results
     */
    showExperimentResults() {
        const resultsDiv = document.getElementById('experiment-results');
        const resultsContent = document.getElementById('results-content');

        if (!resultsDiv || !resultsContent || this.experimentData.length === 0) {return;}

        // Analyze data
        const analysis = this.analyzeExperimentData();

        resultsContent.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                <div>
                    <h4 style="color: #34d399; margin: 0 0 12px 0;">數據統計</h4>
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 16px; border-radius: 8px;">
                        <div style="margin: 8px 0; color: #cbd5e1;">
                            數據點數量: <span style="color: #60a5fa;">${this.experimentData.length}</span>
                        </div>
                        <div style="margin: 8px 0; color: #cbd5e1;">
                            平均電壓: <span style="color: #60a5fa;">${analysis.avgVoltage.toFixed(3)} mV</span>
                        </div>
                        <div style="margin: 8px 0; color: #cbd5e1;">
                            標準偏差: <span style="color: #60a5fa;">${analysis.stdDev.toFixed(3)} mV</span>
                        </div>
                        <div style="margin: 8px 0; color: #cbd5e1;">
                            相關係數: <span style="color: #60a5fa;">${analysis.correlation.toFixed(3)}</span>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 style="color: #f87171; margin: 0 0 12px 0;">理論比較</h4>
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 16px; border-radius: 8px;">
                        <div style="margin: 8px 0; color: #cbd5e1;">
                            理論預測: <span style="color: #60a5fa;">${analysis.theoretical.toFixed(3)} mV</span>
                        </div>
                        <div style="margin: 8px 0; color: #cbd5e1;">
                            實驗測量: <span style="color: #60a5fa;">${analysis.avgVoltage.toFixed(3)} mV</span>
                        </div>
                        <div style="margin: 8px 0; color: #cbd5e1;">
                            誤差百分比: <span style="color: ${Math.abs(analysis.error) < 5 ? '#34d399' : '#f87171'}">
                                ${analysis.error.toFixed(1)}%
                            </span>
                        </div>
                        <div style="margin: 8px 0; color: #cbd5e1;">
                            結果評估: <span style="color: ${analysis.valid ? '#34d399' : '#f87171'}">
                                ${analysis.valid ? '✅ 符合理論' : '❌ 需要檢查'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 20px;">
                <h4 style="color: #a78bfa; margin: 0 0 12px 0;">實驗結論</h4>
                <div style="background: rgba(167, 139, 250, 0.1); padding: 16px; 
                            border-radius: 8px; border-left: 4px solid #a78bfa;">
                    <p style="color: #e2e8f0; margin: 0; line-height: 1.6;">
                        ${this.generateConclusion(analysis)}
                    </p>
                </div>
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
                <button onclick="window.experimentRecreator.exportResults()" 
                        style="background: #3b82f6; color: white; border: none; 
                               padding: 12px 24px; border-radius: 8px; cursor: pointer; 
                               margin-right: 12px;">
                    📊 匯出數據
                </button>
                <button onclick="window.experimentRecreator.shareResults()" 
                        style="background: #10b981; color: white; border: none; 
                               padding: 12px 24px; border-radius: 8px; cursor: pointer;">
                    🔗 分享結果
                </button>
            </div>
        `;

        resultsDiv.style.display = 'block';
    }

    /**
     * Analyze experiment data
     */
    analyzeExperimentData() {
        if (this.experimentData.length === 0) {return null;}

        const voltages = this.experimentData.map(d => d.voltage);
        const accelerations = this.experimentData.map(d => d.acceleration);

        // Basic statistics
        const avgVoltage = voltages.reduce((a, b) => a + b, 0) / voltages.length;
        const avgAcceleration = accelerations.reduce((a, b) => a + b, 0) / accelerations.length;

        const variance = voltages.reduce((sum, v) => sum + Math.pow(v - avgVoltage, 2), 0) / voltages.length;
        const stdDev = Math.sqrt(variance);

        // Correlation calculation
        const correlation = this.calculateCorrelation(accelerations, voltages);

        // Theoretical prediction
        const theoretical = this.calculateTheoreticalVoltage(avgAcceleration);

        // Error calculation
        const error = ((avgVoltage - theoretical) / theoretical) * 100;

        // Validation
        const valid = Math.abs(error) < 10 && correlation > 0.8;

        return {
            avgVoltage,
            avgAcceleration,
            stdDev,
            correlation,
            theoretical,
            error,
            valid
        };
    }

    /**
     * Calculate correlation coefficient
     */
    calculateCorrelation(x, y) {
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
        const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);

        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

        return denominator === 0 ? 0 : numerator / denominator;
    }

    /**
     * Generate experiment conclusion
     */
    generateConclusion(analysis) {
        if (!analysis) {return '實驗數據不足，無法得出結論。';}

        if (analysis.valid) {
            return `實驗結果成功驗證了理論預測。測量的電壓 (${analysis.avgVoltage.toFixed(3)} mV) 與理論計算值 (${analysis.theoretical.toFixed(3)} mV) 的誤差僅為 ${Math.abs(analysis.error).toFixed(1)}%，在實驗誤差範圍內。高相關係數 (${analysis.correlation.toFixed(3)}) 證實了電壓與加速度的線性關係，支持重力離子熱電技術的物理原理。`;
        } else {
            return `實驗結果與理論預測存在顯著差異 (誤差: ${Math.abs(analysis.error).toFixed(1)}%)。這可能是由於實驗條件、測量精度或環境因素造成的。建議檢查實驗設置並重新進行測量。`;
        }
    }

    /**
     * Show virtual laboratory
     */
    showLaboratory() {
        const lab = document.getElementById('virtual-laboratory');
        if (lab) {
            lab.style.display = 'block';
        }
    }

    /**
     * Hide virtual laboratory
     */
    hideLaboratory() {
        const lab = document.getElementById('virtual-laboratory');
        if (lab) {
            lab.style.display = 'none';
        }

        // Stop any running experiment
        if (this.isRunning) {
            this.stopCurrentExperiment();
        }
    }

    /**
     * Export experiment results
     */
    exportResults() {
        if (this.experimentData.length === 0) {return;}

        const data = {
            experiment: this.currentExperiment.title,
            timestamp: new Date().toISOString(),
            data: this.experimentData,
            analysis: this.analyzeExperimentData()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `experiment-${this.currentExperiment.id}-${Date.now()}.json`;
        a.click();

        URL.revokeObjectURL(url);
    }

    /**
     * Share experiment results
     */
    shareResults() {
        const analysis = this.analyzeExperimentData();
        if (!analysis) {return;}

        const shareText = `🧪 實驗結果分享\n\n` +
            `實驗: ${this.currentExperiment.title}\n` +
            `測量電壓: ${analysis.avgVoltage.toFixed(3)} mV\n` +
            `理論預測: ${analysis.theoretical.toFixed(3)} mV\n` +
            `準確度: ${(100 - Math.abs(analysis.error)).toFixed(1)}%\n\n` +
            `#重力離子熱電技術 #物理實驗 #科學驗證`;

        if (navigator.share) {
            navigator.share({
                title: '實驗結果',
                text: shareText
            });
        } else {
            navigator.clipboard.writeText(shareText);
            alert('結果已複製到剪貼簿');
        }
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
}

// Initialize and export
window.ExperimentRecreator = ExperimentRecreator;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.experimentRecreator = new ExperimentRecreator();
        window.experimentRecreator.init();
    });
} else {
    window.experimentRecreator = new ExperimentRecreator();
    window.experimentRecreator.init();
}