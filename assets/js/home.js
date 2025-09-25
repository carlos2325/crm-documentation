// ===== HOME PAGE FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initSmoothScrolling();
    initAnimations();
    initInteractiveElements();
    initHeaderScroll();
    initChartAnimations();
});

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Special handling for feature cards
                if (entry.target.classList.contains('feature-card')) {
                    animateFeatureCard(entry.target);
                }
                
                // Special handling for stats
                if (entry.target.classList.contains('hero-stats')) {
                    animateStats();
                }
                
                // Special handling for tech items
                if (entry.target.classList.contains('tech-item')) {
                    animateTechItem(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animatedElements = document.querySelectorAll('.feature-card, .quick-step, .tech-item, .hero-stats');
    animatedElements.forEach(el => observer.observe(el));
}

// ===== INTERACTIVE ELEMENTS =====
function initInteractiveElements() {
    // Feature cards hover effects
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px) scale(1)';
            this.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            if (this.classList.contains('btn-primary')) {
                this.style.transform = 'translateY(-3px) scale(1.05)';
                this.style.boxShadow = '0 10px 30px rgba(99, 102, 241, 0.5)';
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-2px) scale(1)';
            this.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.4)';
        });
    });
    
    // Tech items interaction
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach(item => {
        item.addEventListener('click', function() {
            // Add pulse animation
            this.style.animation = 'pulse 0.6s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
        });
    });
}

// ===== HEADER SCROLL EFFECT =====
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        // Hide/show header on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 300) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// ===== CHART ANIMATIONS =====
function initChartAnimations() {
    const chartBars = document.querySelectorAll('.chart-bar');
    
    // Animate chart bars when they come into view
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.chart-bar');
                bars.forEach((bar, index) => {
                    setTimeout(() => {
                        bar.style.transform = 'scaleY(1)';
                        bar.style.opacity = '1';
                    }, index * 200);
                });
            }
        });
    });
    
    const chartContainer = document.querySelector('.chart-container');
    if (chartContainer) {
        chartObserver.observe(chartContainer);
    }
}

// ===== FEATURE CARD ANIMATION =====
function animateFeatureCard(card) {
    const icon = card.querySelector('.feature-icon');
    const title = card.querySelector('h3');
    const description = card.querySelector('p');
    const link = card.querySelector('.feature-link');
    
    // Staggered animation
    setTimeout(() => {
        if (icon) icon.style.transform = 'scale(1.1) rotate(5deg)';
    }, 100);
    
    setTimeout(() => {
        if (title) title.style.transform = 'translateX(10px)';
    }, 200);
    
    setTimeout(() => {
        if (description) description.style.opacity = '1';
    }, 300);
    
    setTimeout(() => {
        if (link) link.style.transform = 'translateX(5px)';
    }, 400);
}

// ===== STATS ANIMATION =====
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach((stat, index) => {
        const finalValue = stat.textContent;
        let currentValue = 0;
        const increment = finalValue.includes('%') || finalValue.includes('.') ? 
            parseFloat(finalValue) / 50 : 
            parseInt(finalValue) / 50;
        
        const timer = setInterval(() => {
            currentValue += increment;
            
            if (finalValue.includes('%')) {
                stat.textContent = currentValue.toFixed(1) + '%';
                if (currentValue >= parseFloat(finalValue)) {
                    stat.textContent = finalValue;
                    clearInterval(timer);
                }
            } else if (finalValue.includes('+')) {
                stat.textContent = Math.floor(currentValue) + '+';
                if (currentValue >= parseInt(finalValue)) {
                    stat.textContent = finalValue;
                    clearInterval(timer);
                }
            } else {
                stat.textContent = Math.floor(currentValue);
                if (currentValue >= parseInt(finalValue)) {
                    stat.textContent = finalValue;
                    clearInterval(timer);
                }
            }
        }, 50);
    });
}

// ===== TECH ITEM ANIMATION =====
function animateTechItem(item) {
    const icon = item.querySelector('.tech-icon');
    
    if (icon) {
        icon.style.transform = 'scale(1.2) rotateY(360deg)';
        icon.style.transition = 'transform 0.6s ease';
        
        setTimeout(() => {
            icon.style.transform = 'scale(1) rotateY(0deg)';
        }, 600);
    }
}

// ===== DASHBOARD TAB FUNCTIONALITY =====
function initDashboardTabs() {
    const tabs = document.querySelectorAll('.tab');
    const chartBars = document.querySelectorAll('.chart-bar');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Animate chart bars with new data
            chartBars.forEach((bar, index) => {
                const newHeight = Math.random() * 80 + 20; // Random height between 20-100%
                bar.style.height = newHeight + '%';
                bar.style.transition = 'height 0.5s ease';
            });
        });
    });
}

// ===== PARALLAX EFFECT FOR HERO SHAPES =====
function initParallaxShapes() {
    const shapes = document.querySelectorAll('.shape');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.2;
            shape.style.transform = `translateY(${rate * speed}px)`;
        });
    });
}

// ===== TYPING ANIMATION FOR HERO TITLE =====
function initTypingAnimation() {
    const title = document.querySelector('.hero-title');
    if (!title) return;
    
    const text = title.textContent;
    title.textContent = '';
    
    let i = 0;
    const typeSpeed = 100;
    
    function typeWriter() {
        if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, typeSpeed);
        }
    }
    
    // Start typing animation after a delay
    setTimeout(typeWriter, 1000);
}

// ===== SCROLL TO TOP FUNCTIONALITY =====
function initScrollToTop() {
    // Create scroll to top button
    const scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top';
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: var(--gradient-primary);
        border: none;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
    `;
    
    document.body.appendChild(scrollButton);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== MOBILE MENU FUNCTIONALITY =====
function initMobileMenu() {
    // Create mobile menu button
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.className = 'mobile-menu-button';
    mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuButton.style.cssText = `
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--primary-color);
        cursor: pointer;
        padding: 0.5rem;
    `;
    
    // Add to navigation
    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
        navActions.appendChild(mobileMenuButton);
    }
    
    // Show mobile menu button on small screens
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    function handleMediaQuery(e) {
        if (e.matches) {
            mobileMenuButton.style.display = 'block';
        } else {
            mobileMenuButton.style.display = 'none';
        }
    }
    
    mediaQuery.addListener(handleMediaQuery);
    handleMediaQuery(mediaQuery);
}

// ===== PERFORMANCE OPTIMIZATIONS =====

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events
const optimizedScrollHandler = debounce(() => {
    // Your scroll handling code here
}, 16); // 60fps

// Preload critical resources
function preloadResources() {
    const criticalImages = [
        // Add any critical images here
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    preloadResources();
    initScrollToTop();
    initMobileMenu();
    initDashboardTabs();
    initParallaxShapes();
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.warn('Home page error caught:', e.error);
    // Handle gracefully without breaking the user experience
});

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}





