// Main JavaScript for CRM Documentation
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Smooth scroll to target
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                }
            }
        });
    });
    
    // Update active navigation link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Throttle scroll events for better performance
    let ticking = false;
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateActiveNavLink);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Initialize active link
    updateActiveNavLink();
    
    // Add loading animation to buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('btn-outline')) {
                this.classList.add('loading');
                
                // Remove loading class after animation
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 1000);
            }
        });
    });
    
    // Add hover effects to tech cards
    const techCards = document.querySelectorAll('.tech-card');
    
    techCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add copy functionality to code blocks
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(codeBlock => {
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.className = 'copy-button';
        copyButton.title = 'Copiar código';
        
        // Style the copy button
        copyButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            padding: 8px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
        `;
        
        // Add hover effect
        copyButton.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        
        copyButton.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        
        // Add click functionality
        copyButton.addEventListener('click', function() {
            const textToCopy = codeBlock.textContent;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Show success feedback
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                this.style.background = 'rgba(16, 185, 129, 0.8)';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.background = 'rgba(255, 255, 255, 0.1)';
                }, 2000);
            }).catch(err => {
                console.error('Error copying text: ', err);
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                // Show success feedback
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                this.style.background = 'rgba(16, 185, 129, 0.8)';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.background = 'rgba(255, 255, 255, 0.1)';
                }, 2000);
            });
        });
        
        // Make code block container relative for absolute positioning
        const preElement = codeBlock.parentElement;
        preElement.style.position = 'relative';
        
        // Add copy button to pre element
        preElement.appendChild(copyButton);
    });
    
    // Add search functionality
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '🔍 Buscar en la documentación...';
    searchInput.className = 'search-input';
    
    // Style search input
    searchInput.style.cssText = `
        width: 100%;
        max-width: 400px;
        padding: 12px 16px;
        border: 2px solid var(--border-color);
        border-radius: var(--border-radius);
        font-size: 16px;
        margin: 20px auto;
        display: block;
        background: white;
        transition: all 0.3s ease;
    `;
    
    // Add search input to hero section
    const heroButtons = document.querySelector('.hero-buttons');
    if (heroButtons) {
        heroButtons.parentNode.insertBefore(searchInput, heroButtons);
    }
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const text = section.textContent.toLowerCase();
            const isVisible = text.includes(searchTerm);
            
            if (searchTerm === '') {
                section.style.display = 'block';
                section.style.opacity = '1';
            } else {
                if (isVisible) {
                    section.style.display = 'block';
                    section.style.opacity = '1';
                } else {
                    section.style.opacity = '0.3';
                }
            }
        });
    });
    
    // Add focus effect to search input
    searchInput.addEventListener('focus', function() {
        this.style.borderColor = 'var(--primary-color)';
        this.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
    });
    
    searchInput.addEventListener('blur', function() {
        this.style.borderColor = 'var(--border-color)';
        this.style.boxShadow = 'none';
    });
    
    // Add scroll to top button
    const scrollToTopButton = document.createElement('button');
    scrollToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopButton.className = 'scroll-to-top';
    scrollToTopButton.title = 'Volver arriba';
    
    // Style scroll to top button
    scrollToTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        box-shadow: var(--shadow-lg);
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        z-index: 1000;
    `;
    
    // Add hover effect
    scrollToTopButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 15px 25px rgba(37, 99, 235, 0.3)';
    });
    
    scrollToTopButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'var(--shadow-lg)';
    });
    
    // Add click functionality
    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add to body
    document.body.appendChild(scrollToTopButton);
    
    // Show/hide scroll to top button
    function toggleScrollToTopButton() {
        if (window.scrollY > 300) {
            scrollToTopButton.style.opacity = '1';
            scrollToTopButton.style.visibility = 'visible';
        } else {
            scrollToTopButton.style.opacity = '0';
            scrollToTopButton.style.visibility = 'hidden';
        }
    }
    
    window.addEventListener('scroll', toggleScrollToTopButton);
    
    // Add loading animation for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections for animation
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Escape to clear search
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
            searchInput.blur();
        }
    });
    
    console.log('🚀 CRM Documentation loaded successfully!');
});

// ===== SISTEMA DE BÚSQUEDA INTELIGENTE =====

class IntelligentSearch {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
        this.searchOverlay = document.getElementById('search-overlay');
        this.searchIndex = this.buildSearchIndex();
        this.currentResults = [];
        this.debounceTimer = null;
        
        this.init();
    }

    init() {
        if (!this.searchInput) return;
        
        // Event listeners
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.searchInput.addEventListener('focus', () => this.showResults());
        this.searchInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideResults();
            }
        });

        // Global search shortcut (Ctrl/Cmd + K)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.searchInput.focus();
            }
        });
    }

    buildSearchIndex() {
        const sections = document.querySelectorAll('.section');
        const index = [];

        sections.forEach(section => {
            const sectionId = section.id;
            const sectionTitle = section.querySelector('.section-title')?.textContent?.trim() || '';
            const sectionContent = section.textContent?.trim() || '';
            
            // Extraer palabras clave del título
            const titleKeywords = this.extractKeywords(sectionTitle);
            
            // Extraer palabras clave del contenido
            const contentKeywords = this.extractKeywords(sectionContent);
            
            // Extraer enlaces y referencias
            const links = Array.from(section.querySelectorAll('a')).map(a => ({
                text: a.textContent.trim(),
                href: a.href,
                type: 'link'
            }));

            // Extraer ejemplos de código
            const codeExamples = Array.from(section.querySelectorAll('pre code')).map(code => ({
                text: code.textContent.trim(),
                language: code.className.replace('language-', ''),
                type: 'code'
            }));

            index.push({
                id: sectionId,
                title: sectionTitle,
                content: sectionContent,
                keywords: [...titleKeywords, ...contentKeywords],
                links: links,
                codeExamples: codeExamples,
                type: 'section'
            });
        });

        return index;
    }

    extractKeywords(text) {
        if (!text) return [];
        
        // Limpiar texto y extraer palabras relevantes
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2)
            .filter(word => !this.isStopWord(word))
            .slice(0, 20); // Limitar a 20 palabras clave
    }

    isStopWord(word) {
        const stopWords = [
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
            'before', 'after', 'above', 'below', 'between', 'among', 'within',
            'this', 'that', 'these', 'those', 'is', 'are', 'was', 'were', 'be',
            'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
            'would', 'could', 'should', 'may', 'might', 'can', 'must', 'shall'
        ];
        return stopWords.includes(word);
    }

    handleSearch(query) {
        if (!query || query.length < 2) {
            this.hideResults();
            return;
        }

        // Debounce para mejorar performance
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.performSearch(query);
        }, 300);
    }

    performSearch(query) {
        const results = this.searchIndex
            .map(item => {
                const score = this.calculateRelevanceScore(item, query);
                return { ...item, score };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10); // Top 10 resultados

        this.currentResults = results;
        this.displayResults(results, query);
    }

    calculateRelevanceScore(item, query) {
        const queryLower = query.toLowerCase();
        let score = 0;

        // Búsqueda en título (peso alto)
        if (item.title.toLowerCase().includes(queryLower)) {
            score += 100;
        }

        // Búsqueda en palabras clave (peso medio)
        const keywordMatches = item.keywords.filter(keyword => 
            keyword.includes(queryLower)
        ).length;
        score += keywordMatches * 10;

        // Búsqueda en contenido (peso bajo)
        if (item.content.toLowerCase().includes(queryLower)) {
            score += 5;
        }

        // Búsqueda en enlaces
        const linkMatches = item.links.filter(link => 
            link.text.toLowerCase().includes(queryLower)
        ).length;
        score += linkMatches * 8;

        // Búsqueda en código
        const codeMatches = item.codeExamples.filter(code => 
            code.text.toLowerCase().includes(queryLower)
        ).length;
        score += codeMatches * 15;

        return score;
    }

    displayResults(results, query) {
        if (!this.searchResults) return;

        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No se encontraron resultados para "${query}"</p>
                    <small>Intenta con términos más específicos</small>
                </div>
            `;
        } else {
            const resultsHTML = results.map(result => this.renderResultItem(result, query)).join('');
            this.searchResults.innerHTML = resultsHTML;
        }

        this.showResults();
    }

    renderResultItem(result, query) {
        const highlightedTitle = this.highlightText(result.title, query);
        const highlightedContent = this.highlightText(
            result.content.substring(0, 200) + '...',
            query
        );

        let badges = '';
        if (result.links.length > 0) {
            badges += `<span class="badge badge-links">${result.links.length} enlaces</span>`;
        }
        if (result.codeExamples.length > 0) {
            badges += `<span class="badge badge-code">${result.codeExamples.length} ejemplos</span>`;
        }

        return `
            <div class="search-result-item" data-section="${result.id}">
                <div class="result-header">
                    <h4 class="result-title">
                        <a href="#${result.id}">${highlightedTitle}</a>
                    </h4>
                    <div class="result-badges">
                        ${badges}
                    </div>
                </div>
                <p class="result-content">${highlightedContent}</p>
                <div class="result-meta">
                    <span class="result-type">${result.type}</span>
                    <span class="result-score">Relevancia: ${Math.round(result.score)}</span>
                </div>
            </div>
        `;
    }

    highlightText(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    handleKeydown(e) {
        if (e.key === 'Escape') {
            this.hideResults();
            this.searchInput.blur();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (this.currentResults.length > 0) {
                this.navigateToFirstResult();
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateResults('down');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateResults('up');
        }
    }

    navigateResults(direction) {
        const currentActive = this.searchResults.querySelector('.search-result-item.active');
        const items = this.searchResults.querySelectorAll('.search-result-item');
        
        if (items.length === 0) return;

        let nextIndex = 0;
        if (currentActive) {
            const currentIndex = Array.from(items).indexOf(currentActive);
            if (direction === 'down') {
                nextIndex = (currentIndex + 1) % items.length;
            } else {
                nextIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
            }
        }

        // Remover clase activa anterior
        if (currentActive) {
            currentActive.classList.remove('active');
        }

        // Activar nuevo elemento
        items[nextIndex].classList.add('active');
        items[nextIndex].scrollIntoView({ block: 'nearest' });
    }

    navigateToFirstResult() {
        if (this.currentResults.length > 0) {
            const firstResult = this.currentResults[0];
            this.navigateToSection(firstResult.id);
            this.hideResults();
        }
    }

    navigateToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Resaltar sección temporalmente
            section.classList.add('highlighted');
            setTimeout(() => {
                section.classList.remove('highlighted');
            }, 2000);
        }
    }

    showResults() {
        if (this.searchResults && this.searchOverlay) {
            this.searchResults.style.display = 'block';
            this.searchOverlay.style.display = 'block';
        }
    }

    hideResults() {
        if (this.searchResults && this.searchOverlay) {
            this.searchResults.style.display = 'none';
            this.searchOverlay.style.display = 'none';
        }
    }
}

// ===== SISTEMA DE NAVEGACIÓN INTELIGENTE =====

class SmartNavigation {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.navItems = document.querySelectorAll('.nav-item');
        this.currentSection = null;
        
        this.init();
    }

    init() {
        // Intersection Observer para detectar sección activa
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.setActiveSection(entry.target.id);
                }
            });
        }, observerOptions);

        this.sections.forEach(section => {
            observer.observe(section);
        });

        // Smooth scrolling para enlaces internos
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });
    }

    setActiveSection(sectionId) {
        if (this.currentSection === sectionId) return;
        
        this.currentSection = sectionId;
        
        // Actualizar navegación
        this.navItems.forEach(item => {
            const link = item.querySelector('a');
            if (link && link.getAttribute('href') === `#${sectionId}`) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Actualizar breadcrumb si existe
        this.updateBreadcrumb(sectionId);
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = document.querySelector('header')?.offsetHeight || 0;
            const targetPosition = section.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    updateBreadcrumb(sectionId) {
        const breadcrumb = document.querySelector('.breadcrumb');
        if (!breadcrumb) return;

        const section = document.getElementById(sectionId);
        if (section) {
            const title = section.querySelector('.section-title')?.textContent?.trim() || sectionId;
            breadcrumb.innerHTML = `
                <a href="#home">Inicio</a>
                <span class="separator">/</span>
                <span class="current">${title}</span>
            `;
        }
    }
}

// ===== SISTEMA DE FILTROS AVANZADOS =====

class AdvancedFilters {
    constructor() {
        this.filterContainer = document.querySelector('.filter-container');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.filteredSections = new Set();
        
        this.init();
    }

    init() {
        if (!this.filterContainer) return;

        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.toggleFilter(btn);
                this.applyFilters();
            });
        });
    }

    toggleFilter(button) {
        button.classList.toggle('active');
    }

    applyFilters() {
        const activeFilters = Array.from(this.filterButtons)
            .filter(btn => btn.classList.contains('active'))
            .map(btn => btn.dataset.filter);

        if (activeFilters.length === 0) {
            // Mostrar todas las secciones
            this.sections.forEach(section => {
                section.style.display = 'block';
            });
            return;
        }

        // Filtrar secciones
        this.sections.forEach(section => {
            const sectionTags = this.getSectionTags(section);
            const shouldShow = activeFilters.some(filter => 
                sectionTags.includes(filter)
            );
            
            section.style.display = shouldShow ? 'block' : 'none';
        });

        // Actualizar contador de resultados
        this.updateResultsCount();
    }

    getSectionTags(section) {
        const tags = [];
        const tagElements = section.querySelectorAll('[data-tags]');
        
        tagElements.forEach(element => {
            const elementTags = element.dataset.tags.split(',').map(tag => tag.trim());
            tags.push(...elementTags);
        });

        return [...new Set(tags)]; // Eliminar duplicados
    }

    updateResultsCount() {
        const visibleSections = document.querySelectorAll('.section[style*="block"], .section:not([style*="none"])');
        const countElement = document.querySelector('.filter-results-count');
        
        if (countElement) {
            countElement.textContent = `${visibleSections.length} secciones encontradas`;
        }
    }
}

// ===== SISTEMA DE PERFORMANCE Y OPTIMIZACIÓN =====

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Lazy loading para imágenes
        this.setupLazyLoading();
        
        // Preload de recursos críticos
        this.preloadCriticalResources();
        
        // Optimización de scroll
        this.optimizeScroll();
        
        // Service Worker para cache
        this.setupServiceWorker();
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    preloadCriticalResources() {
        // Preload de fuentes críticas
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
        fontLink.as = 'style';
        document.head.appendChild(fontLink);

        // Preload de CSS crítico
        const cssLink = document.createElement('link');
        cssLink.rel = 'preload';
        cssLink.href = 'assets/css/style.css';
        cssLink.as = 'style';
        document.head.appendChild(cssLink);
    }

    optimizeScroll() {
        let ticking = false;
        
        const updateScroll = () => {
            // Actualizar elementos que dependen del scroll
            this.updateScrollDependentElements();
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateScroll);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    updateScrollDependentElements() {
        // Actualizar scroll to top button
        const scrollTopBtn = document.getElementById('scroll-top');
        if (scrollTopBtn) {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }

        // Actualizar header sticky
        const header = document.querySelector('header');
        if (header) {
            if (window.pageYOffset > 100) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        }
    }

    async setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registrado:', registration);
            } catch (error) {
                console.log('Error al registrar Service Worker:', error);
            }
        }
    }
}

// ===== SISTEMA DE TEMAS Y PERSONALIZACIÓN =====

class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupThemeToggle();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
                this.applyTheme(newTheme);
            });
        }
    }
}

// ===== INICIALIZACIÓN =====

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todos los sistemas
    new IntelligentSearch();
    new SmartNavigation();
    new AdvancedFilters();
    new PerformanceOptimizer();
    new ThemeManager();

    // Scroll to top functionality
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section, .feature-card, .component-card').forEach(el => {
        revealObserver.observe(el);
    });

    console.log('🚀 CRM Documentation System inicializado correctamente');
});
