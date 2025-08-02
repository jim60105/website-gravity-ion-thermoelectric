/**
 * University Carousel for Academic Recognition Section
 * Displays rotating logos of famous universities
 */

class UniversityCarousel {
  constructor() {
    this.container = null;
    this.dotsContainer = null;
    this.universities = [];
    this.currentSlide = 0;
    this.isAutoPlaying = true;
    this.autoplayInterval = null;
    this.init();
  }

  init() {
    this.container = document.getElementById('university-logos');
    this.dotsContainer = document.getElementById('carousel-dots');

    if (!this.container) {return;}

    this.generateUniversityData();
    this.createCarousel();
    this.startAutoplay();
  }

  generateUniversityData() {
    // Famous universities that received the challenge
    this.universities = [
      {
        name: 'MIT',
        fullName: 'Massachusetts Institute of Technology',
        country: 'USA',
        responses: 12,
        logo: '🎓', // Using emoji as placeholder for logo
        color: '#8B1538'
      },
      {
        name: 'Harvard',
        fullName: 'Harvard University',
        country: 'USA',
        responses: 8,
        logo: '🏛️',
        color: '#A51C30'
      },
      {
        name: 'Stanford',
        fullName: 'Stanford University',
        country: 'USA',
        responses: 15,
        logo: '🌲',
        color: '#8C1515'
      },
      {
        name: 'Cambridge',
        fullName: 'University of Cambridge',
        country: 'UK',
        responses: 9,
        logo: '👑',
        color: '#003B71'
      },
      {
        name: 'Oxford',
        fullName: 'University of Oxford',
        country: 'UK',
        responses: 11,
        logo: '📚',
        color: '#002147'
      },
      {
        name: 'ETH Zurich',
        fullName: 'Swiss Federal Institute of Technology',
        country: 'Switzerland',
        responses: 6,
        logo: '⚗️',
        color: '#1F407A'
      },
      {
        name: 'Tokyo',
        fullName: 'University of Tokyo',
        country: 'Japan',
        responses: 18,
        logo: '🌸',
        color: '#003893'
      },
      {
        name: 'Tsinghua',
        fullName: 'Tsinghua University',
        country: 'China',
        responses: 23,
        logo: '🏮',
        color: '#660874'
      },
      {
        name: 'NTU',
        fullName: 'National Taiwan University',
        country: 'Taiwan',
        responses: 28,
        logo: '🏛️',
        color: '#660000'
      },
      {
        name: 'Caltech',
        fullName: 'California Institute of Technology',
        country: 'USA',
        responses: 7,
        logo: '🔬',
        color: '#FF6C0C'
      },
      {
        name: 'CERN',
        fullName: 'European Organization for Nuclear Research',
        country: 'Switzerland',
        responses: 4,
        logo: '⚛️',
        color: '#0033A0'
      },
      {
        name: 'Max Planck',
        fullName: 'Max Planck Institute',
        country: 'Germany',
        responses: 5,
        logo: '🧬',
        color: '#009639'
      }
    ];
  }

  createCarousel() {
    // Create slides (groups of 3 universities per slide)
    const slidesCount = Math.ceil(this.universities.length / 3);
    this.container.innerHTML = '';
    this.dotsContainer.innerHTML = '';

    for (let i = 0; i < slidesCount; i++) {
      const slide = this.createSlide(i);
      this.container.appendChild(slide);

      const dot = this.createDot(i);
      this.dotsContainer.appendChild(dot);
    }

    this.updateCarousel();
  }

  createSlide(slideIndex) {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide min-w-full flex justify-center items-center space-x-8 px-4';
    slide.setAttribute('data-slide', slideIndex);

    const startIndex = slideIndex * 3;
    const endIndex = Math.min(startIndex + 3, this.universities.length);

    for (let i = startIndex; i < endIndex; i++) {
      const university = this.universities[i];
      const universityCard = this.createUniversityCard(university);
      slide.appendChild(universityCard);
    }

    return slide;
  }

  createUniversityCard(university) {
    const card = document.createElement('div');
    card.className = 'university-card bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 cursor-pointer group min-w-0 flex-1 max-w-xs';

    card.innerHTML = `
      <div class="university-logo text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
        ${university.logo}
      </div>
      <h5 class="university-name text-lg font-bold text-white mb-2 truncate">
        ${university.name}
      </h5>
      <p class="university-full-name text-sm text-gray-300 mb-3 leading-tight">
        ${university.fullName}
      </p>
      <div class="university-stats flex justify-between items-center text-xs">
        <span class="country-badge bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
          ${university.country}
        </span>
        <span class="response-count text-green-400 font-semibold">
          ${university.responses} 回應
        </span>
      </div>
    `;

    // Add click interaction
    card.addEventListener('click', () => {
      this.showUniversityDetails(university);
    });

    return card;
  }

  createDot(index) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot w-3 h-3 rounded-full bg-white/30 hover:bg-white/50 transition-colors duration-300';
    dot.setAttribute('data-slide', index);
    dot.setAttribute('aria-label', `轉到第 ${index + 1} 頁`);

    dot.addEventListener('click', () => {
      this.goToSlide(index);
    });

    return dot;
  }

  updateCarousel() {
    const slideWidth = this.container.clientWidth;
    const translateX = -this.currentSlide * slideWidth;

    this.container.style.transform = `translateX(${translateX}px)`;

    // Update dots
    const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
      if (index === this.currentSlide) {
        dot.classList.add('bg-white/80');
        dot.classList.remove('bg-white/30');
      } else {
        dot.classList.add('bg-white/30');
        dot.classList.remove('bg-white/80');
      }
    });
  }

  goToSlide(index) {
    const maxSlide = Math.ceil(this.universities.length / 3) - 1;
    this.currentSlide = Math.max(0, Math.min(index, maxSlide));
    this.updateCarousel();
    this.resetAutoplay();
  }

  nextSlide() {
    const maxSlide = Math.ceil(this.universities.length / 3) - 1;
    this.currentSlide = this.currentSlide >= maxSlide ? 0 : this.currentSlide + 1;
    this.updateCarousel();
  }

  prevSlide() {
    const maxSlide = Math.ceil(this.universities.length / 3) - 1;
    this.currentSlide = this.currentSlide <= 0 ? maxSlide : this.currentSlide - 1;
    this.updateCarousel();
  }

  startAutoplay() {
    if (!this.isAutoPlaying) {return;}

    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  resetAutoplay() {
    this.stopAutoplay();
    if (this.isAutoPlaying) {
      this.startAutoplay();
    }
  }

  showUniversityDetails(university) {
    // Create modal or tooltip with university details
    const modal = this.createUniversityModal(university);
    document.body.appendChild(modal);

    // Show modal with animation
    setTimeout(() => {
      modal.classList.add('opacity-100');
      modal.classList.remove('opacity-0');
    }, 10);
  }

  createUniversityModal(university) {
    const modal = document.createElement('div');
    modal.className = 'university-modal fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center opacity-0 transition-opacity duration-300';

    modal.innerHTML = `
      <div class="modal-content bg-gray-900 rounded-xl p-8 max-w-md mx-4 text-center">
        <div class="university-logo text-6xl mb-4">${university.logo}</div>
        <h3 class="text-2xl font-bold text-white mb-2">${university.name}</h3>
        <p class="text-gray-300 mb-4">${university.fullName}</p>
        <div class="stats-grid grid grid-cols-2 gap-4 mb-6">
          <div class="stat-item bg-white/10 rounded-lg p-3">
            <div class="stat-value text-xl font-bold text-blue-400">${university.country}</div>
            <div class="stat-label text-sm text-gray-400">國家</div>
          </div>
          <div class="stat-item bg-white/10 rounded-lg p-3">
            <div class="stat-value text-xl font-bold text-green-400">${university.responses}</div>
            <div class="stat-label text-sm text-gray-400">教授回應</div>
          </div>
        </div>
        <button class="close-modal bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-300">
          關閉
        </button>
      </div>
    `;

    // Add close functionality
    const closeBtn = modal.querySelector('.close-modal');
    const closeModal = () => {
      modal.classList.add('opacity-0');
      modal.classList.remove('opacity-100');
      setTimeout(() => {
        document.body.removeChild(modal);
      }, 300);
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    return modal;
  }

  // Handle window resize
  handleResize() {
    this.updateCarousel();
  }

  // Pause autoplay on hover
  pauseOnHover() {
    const carousel = this.container.closest('.university-carousel');
    if (!carousel) {return;}

    carousel.addEventListener('mouseenter', () => {
      this.stopAutoplay();
    });

    carousel.addEventListener('mouseleave', () => {
      if (this.isAutoPlaying) {
        this.startAutoplay();
      }
    });
  }

  // Add keyboard navigation
  addKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      const carousel = document.querySelector('.university-carousel');
      if (!carousel || !carousel.contains(document.activeElement)) {return;}

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.prevSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.nextSlide();
          break;
      }
    });
  }

  // Get carousel statistics
  getStats() {
    const totalResponses = this.universities.reduce((sum, uni) => sum + uni.responses, 0);
    const avgResponses = totalResponses / this.universities.length;
    const topUniversity = this.universities.reduce((max, uni) =>
      uni.responses > max.responses ? uni : max
    );

    return {
      totalUniversities: this.universities.length,
      totalResponses,
      averageResponses: Math.round(avgResponses),
      topUniversity: topUniversity.name
    };
  }

  // Destroy carousel
  destroy() {
    this.stopAutoplay();
    if (this.container) {
      this.container.innerHTML = '';
    }
    if (this.dotsContainer) {
      this.dotsContainer.innerHTML = '';
    }
  }
}

// Initialize university carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const universityCarousel = new UniversityCarousel();

  // Handle window resize
  window.addEventListener('resize', () => {
    universityCarousel.handleResize();
  });

  // Enable pause on hover
  universityCarousel.pauseOnHover();

  // Add keyboard navigation
  universityCarousel.addKeyboardNavigation();

  // Make it globally accessible
  window.universityCarousel = universityCarousel;
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UniversityCarousel;
}