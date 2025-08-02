/**
 * Counter Animation for Academic Recognition Section
 * Handles animated counting up to target values
 */

class CounterAnimation {
  constructor() {
    this.counters = new Map();
    this.hasTriggered = false;
    this.init();
  }

  init() {
    // Set up intersection observer for trigger
    this.setupIntersectionObserver();

    // Define counter targets
    this.counterTargets = {
      'professor-counter': 5127,
      'response-count': 127,
      'country-count': 52,
      'university-count': 185,
      'days-count': 156
    };
  }

  setupIntersectionObserver() {
    const options = {
      threshold: 0.5,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasTriggered) {
          this.startAllCounters();
          this.hasTriggered = true;
        }
      });
    }, options);

    const counterSection = document.querySelector('.professor-challenge');
    if (counterSection) {
      observer.observe(counterSection);
    }
  }

  startAllCounters() {
    Object.entries(this.counterTargets).forEach(([id, target]) => {
      this.animateCounter(id, target);
    });
  }

  animateCounter(elementId, targetValue, duration = 2000) {
    const element = document.getElementById(elementId);
    if (!element) {return;}

    // Add easing for more natural animation
    this.easeInOutQuad(0, targetValue, duration, (value) => {
      element.textContent = this.formatNumber(Math.floor(value));
    }, () => {
      element.textContent = this.formatNumber(targetValue);
      this.addPlusSign(elementId, targetValue);
    });
  }

  easeInOutQuad(start, end, duration, callback, onComplete) {
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease in-out quad formula
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

      const currentValue = start + (end - start) * easeProgress;
      callback(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    requestAnimationFrame(animate);
  }

  formatNumber(num) {
    // Add comma separators for large numbers
    return num.toLocaleString();
  }

  addPlusSign(elementId, value) {
    const element = document.getElementById(elementId);
    if (!element) {return;}

    // Add plus sign for certain counters to indicate "more than"
    if (elementId === 'professor-counter' && value >= 5000) {
      element.textContent = this.formatNumber(value) + '+';
    }
  }

  // Method to trigger counter manually if needed
  triggerCounters() {
    if (!this.hasTriggered) {
      this.startAllCounters();
      this.hasTriggered = true;
    }
  }

  // Reset counters (for testing or re-triggering)
  resetCounters() {
    Object.keys(this.counterTargets).forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = '0';
      }
    });
    this.hasTriggered = false;
  }
}

// Initialize counter animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const counterAnimation = new CounterAnimation();

  // Make it globally accessible for debugging
  window.counterAnimation = counterAnimation;
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CounterAnimation;
}