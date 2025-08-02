/**
 * Countdown Timer - Handle countdown timer for academic conference
 * @author Gravity Ion Thermoelectric Research Team
 * @version 1.0.0
 */

class CountdownTimer {
    constructor() {
        this.targetDate = this.calculateTargetDate();
        this.intervalId = null;
        this.elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };
        this.init();
    }

    /**
     * Initialize countdown timer
     */
    init() {
        if (!this.validateElements()) {
            console.warn('Countdown timer elements not found');
            return;
        }

        this.startCountdown();
        this.addVisualEffects();

        console.info('Countdown timer initialized for:', this.targetDate);
    }

    /**
     * Calculate target date (Spring 2025 International Energy Conference)
     */
    calculateTargetDate() {
        // Set target date to March 15, 2025 (Spring conference)
        const now = new Date();
        const currentYear = now.getFullYear();
        let targetYear = currentYear;

        // If we're past March 15 this year, target next year
        const targetThisYear = new Date(currentYear, 2, 15); // March 15
        if (now > targetThisYear) {
            targetYear = currentYear + 1;
        }

        return new Date(targetYear, 2, 15, 9, 0, 0); // March 15, 9:00 AM
    }

    /**
     * Validate that all required elements exist
     */
    validateElements() {
        return Object.values(this.elements).every(element => element !== null);
    }

    /**
     * Start the countdown timer
     */
    startCountdown() {
        // Update immediately
        this.updateCountdown();

        // Update every second
        this.intervalId = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }

    /**
     * Update countdown display
     */
    updateCountdown() {
        const now = new Date().getTime();
        const distance = this.targetDate.getTime() - now;

        if (distance < 0) {
            this.handleCountdownExpired();
            return;
        }

        const timeLeft = this.calculateTimeLeft(distance);
        this.updateDisplay(timeLeft);
        this.updateProgressIndicators(distance);
    }

    /**
     * Calculate time left from distance
     */
    calculateTimeLeft(distance) {
        return {
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
        };
    }

    /**
     * Update display elements
     */
    updateDisplay(timeLeft) {
        // Add animation class before updating
        Object.keys(this.elements).forEach(key => {
            const element = this.elements[key];
            const newValue = timeLeft[key];

            if (element.textContent !== newValue.toString()) {
                this.animateValueChange(element, newValue);
            }
        });
    }

    /**
     * Animate value change with flip effect
     */
    animateValueChange(element, newValue) {
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow

        element.textContent = newValue.toString().padStart(2, '0');
        element.style.animation = 'countdownPulse 0.5s ease-out';
    }

    /**
     * Update progress indicators based on time remaining
     */
    updateProgressIndicators(distance) {
        const totalTime = this.targetDate.getTime() - new Date(Date.now() - (365 * 24 * 60 * 60 * 1000)).getTime();
        const progress = Math.max(0, Math.min(100, ((totalTime - distance) / totalTime) * 100));

        // Update any progress bars that might be related to the countdown
        const progressBars = document.querySelectorAll('.countdown-progress');
        progressBars.forEach(bar => {
            bar.style.width = `${progress}%`;
        });
    }

    /**
     * Handle countdown expiration
     */
    handleCountdownExpired() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        // Show "Conference is Live!" message
        const countdownContainer = document.getElementById('countdown-display');
        if (countdownContainer) {
            countdownContainer.innerHTML = `
                <div class="text-center">
                    <div class="text-4xl font-bold text-energy-gold mb-2">🎉</div>
                    <div class="text-xl font-bold text-white">會議進行中!</div>
                    <div class="text-sm text-gray-200">Spring 2025 Energy Conference</div>
                </div>
            `;
        }

        console.info('Countdown expired - Conference is live!');
    }

    /**
     * Add visual effects to countdown
     */
    addVisualEffects() {
        // Add glow effect to countdown items
        const countdownItems = document.querySelectorAll('.countdown-item');
        countdownItems.forEach((item, index) => {
            // Stagger the glow animation
            item.style.animationDelay = `${index * 0.2}s`;

            // Add hover effects
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'scale(1.1)';
                item.style.transition = 'transform 0.3s ease';
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'scale(1)';
            });
        });

        // Add pulsing effect for urgency
        this.addUrgencyEffects();
    }

    /**
     * Add urgency effects based on time remaining
     */
    addUrgencyEffects() {
        const checkUrgency = () => {
            const now = new Date().getTime();
            const distance = this.targetDate.getTime() - now;
            const daysLeft = Math.floor(distance / (1000 * 60 * 60 * 24));

            const countdownContainer = document.querySelector('.countdown-timer');
            if (!countdownContainer) {return;}

            // Remove existing urgency classes
            countdownContainer.classList.remove('urgent-low', 'urgent-medium', 'urgent-high');

            // Add urgency based on days left
            if (daysLeft <= 7) {
                countdownContainer.classList.add('urgent-high');
                this.addHighUrgencyEffects();
            } else if (daysLeft <= 30) {
                countdownContainer.classList.add('urgent-medium');
                this.addMediumUrgencyEffects();
            } else if (daysLeft <= 90) {
                countdownContainer.classList.add('urgent-low');
                this.addLowUrgencyEffects();
            }
        };

        // Check urgency immediately and then every minute
        checkUrgency();
        setInterval(checkUrgency, 60000);
    }

    /**
     * Add high urgency effects (less than 7 days)
     */
    addHighUrgencyEffects() {
        const style = document.createElement('style');
        style.textContent = `
            .urgent-high .countdown-item {
                animation: countdownPulse 0.5s ease-in-out infinite alternate !important;
                border: 2px solid #ef4444 !important;
            }
            .urgent-high .countdown-item .text-2xl {
                color: #ef4444 !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Add medium urgency effects (less than 30 days)
     */
    addMediumUrgencyEffects() {
        const style = document.createElement('style');
        style.textContent = `
            .urgent-medium .countdown-item {
                animation: countdownPulse 1s ease-in-out infinite alternate !important;
                border: 2px solid #f59e0b !important;
            }
            .urgent-medium .countdown-item .text-2xl {
                color: #f59e0b !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Add low urgency effects (less than 90 days)
     */
    addLowUrgencyEffects() {
        const style = document.createElement('style');
        style.textContent = `
            .urgent-low .countdown-item {
                animation: countdownPulse 2s ease-in-out infinite alternate !important;
                border: 2px solid #10b981 !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Get countdown status
     */
    getStatus() {
        const now = new Date().getTime();
        const distance = this.targetDate.getTime() - now;

        if (distance < 0) {
            return {
                status: 'expired',
                message: '會議已開始',
                timeLeft: null
            };
        }

        const timeLeft = this.calculateTimeLeft(distance);
        const totalDays = timeLeft.days;

        let urgencyLevel = 'normal';
        if (totalDays <= 7) {urgencyLevel = 'high';}
        else if (totalDays <= 30) {urgencyLevel = 'medium';}
        else if (totalDays <= 90) {urgencyLevel = 'low';}

        return {
            status: 'active',
            timeLeft: timeLeft,
            urgencyLevel: urgencyLevel,
            targetDate: this.targetDate,
            totalDays: totalDays
        };
    }

    /**
     * Manually set target date (for testing)
     */
    setTargetDate(date) {
        this.targetDate = new Date(date);
        this.updateCountdown();
        console.info('Target date manually set to:', this.targetDate);
    }

    /**
     * Stop the countdown timer
     */
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.info('Countdown timer stopped');
        }
    }

    /**
     * Restart the countdown timer
     */
    restart() {
        this.stop();
        this.targetDate = this.calculateTargetDate();
        this.startCountdown();
        console.info('Countdown timer restarted');
    }
}

// Initialize Countdown Timer when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.countdownTimer = new CountdownTimer();
    });
} else {
    window.countdownTimer = new CountdownTimer();
}