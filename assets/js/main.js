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

// ===== BÚSQUEDA FLOTANTE =====
class FloatingSearch {
    constructor() {
        this.searchBtn = document.getElementById('nav-search-btn');
        this.floatingSearch = document.getElementById('floating-search');
        this.searchInput = document.getElementById('floating-search-input');
        this.clearBtn = document.getElementById('floating-clear-search');
        this.filters = {
            types: document.getElementById('floating-filter-types'),
            queries: document.getElementById('floating-filter-queries'),
            mutations: document.getElementById('floating-filter-mutations'),
            fields: document.getElementById('floating-filter-fields')
        };
        this.searchResults = document.getElementById('floating-search-results');
        this.searchData = this.initializeSearchData();
        this.init();
    }
    
    init() {
        if (!this.searchBtn || !this.floatingSearch) return;
        
        this.searchBtn.addEventListener('click', () => this.toggleSearch());
        this.searchInput.addEventListener('input', () => this.performSearch());
        this.clearBtn.addEventListener('click', () => this.clearSearch());
        
        // Atajo de teclado Ctrl+K
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.toggleSearch();
            }
        });
        
        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!this.floatingSearch.contains(e.target) && !this.searchBtn.contains(e.target)) {
                this.hideSearch();
            }
        });
    }
    
    toggleSearch() {
        if (this.floatingSearch.classList.contains('active')) {
            this.hideSearch();
        } else {
            this.showSearch();
        }
    }
    
    showSearch() {
        this.floatingSearch.classList.add('active');
        this.searchInput.focus();
        this.searchBtn.style.background = 'var(--primary-dark)';
    }
    
    hideSearch() {
        this.floatingSearch.classList.remove('active');
        this.searchBtn.style.background = 'var(--primary-color)';
        this.clearSearch();
    }
    
    performSearch() {
        const query = this.searchInput.value.trim().toLowerCase();
        if (query.length < 2) {
            this.hideResults();
            return;
        }
        
        const results = this.searchData.filter(item => {
            const matchesQuery = item.title.toLowerCase().includes(query) ||
                               item.description.toLowerCase().includes(query) ||
                               item.type.toLowerCase().includes(query);
            
            const matchesFilter = this.filters[item.category].checked;
            
            return matchesQuery && matchesFilter;
        });
        
        this.displayResults(results);
    }
    
    displayResults(results) {
        if (results.length === 0) {
            this.searchResults.innerHTML = '<div class="no-results">No se encontraron resultados</div>';
            this.searchResults.style.display = 'block';
            return;
        }
        
        this.searchResults.innerHTML = results.slice(0, 8).map(item => `
            <div class="search-result-item" onclick="scrollToSection('${item.section}')">
                <div class="search-result-title">${item.title}</div>
                <div class="search-result-type">${item.type}</div>
                <div class="search-result-description">${item.description}</div>
            </div>
        `).join('');
        
        this.searchResults.style.display = 'block';
    }
    
    hideResults() {
        this.searchResults.style.display = 'none';
    }
    
    clearSearch() {
        this.searchInput.value = '';
        this.hideResults();
    }
    
    initializeSearchData() {
        return [
            { title: 'CRM_Lead', type: 'Tipo', description: 'Gestión de leads y pipeline', category: 'types', section: 'crm-leads' },
            { title: 'CRM_Contact', type: 'Tipo', description: 'Gestión de contactos', category: 'types', section: 'crm-contacts' },
            { title: 'getLeads', type: 'Query', description: 'Obtener lista de leads', category: 'queries', section: 'crm-leads' },
            { title: 'createLead', type: 'Mutation', description: 'Crear nuevo lead', category: 'mutations', section: 'crm-leads' },
            { title: 'name', type: 'Campo', description: 'Nombre del lead', category: 'fields', section: 'crm-leads' },
            { title: 'email', type: 'Campo', description: 'Email del lead', category: 'fields', section: 'crm-leads' },
            { title: 'EVT_Event', type: 'Tipo', description: 'Gestión de eventos', category: 'types', section: 'evt-events' },
            { title: 'getEvents', type: 'Query', description: 'Obtener eventos', category: 'queries', section: 'evt-events' }
        ];
    }
}

// ===== MENÚ MÓVIL =====
class MobileMenu {
    constructor() {
        this.toggle = document.getElementById('nav-toggle');
        this.menu = document.getElementById('nav-menu');
        this.init();
    }
    
    init() {
        if (!this.toggle || !this.menu) return;
        
        this.toggle.addEventListener('click', () => this.toggleMenu());
    }
    
    toggleMenu() {
        this.menu.classList.toggle('active');
        this.toggle.classList.toggle('active');
    }
}

// ===== FUNCIÓN GLOBAL PARA SCROLL =====
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Cerrar búsqueda flotante
        const floatingSearch = document.getElementById('floating-search');
        if (floatingSearch) {
            floatingSearch.classList.remove('active');
        }
    }
}

// ===== INICIALIZAR NUEVAS FUNCIONALIDADES =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar búsqueda flotante
    new FloatingSearch();
    
    // Inicializar menú móvil
    new MobileMenu();
    
    // Inicializar botón Quick Start
    const quickStartBtn = document.getElementById('quick-start-btn');
    if (quickStartBtn) {
        quickStartBtn.addEventListener('click', () => {
            const apiSection = document.getElementById('api');
            if (apiSection) {
                apiSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});
