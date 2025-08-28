// ===== GITHUB STYLE DOCUMENTATION FUNCTIONALITY ===== 

// Simple search functionality
const searchInput = document.getElementById('search-input');

if (searchInput) {
    let searchTimeout;
    
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = e.target.value.toLowerCase();
            if (query.length > 1) {
                performSearch(query);
            } else {
                clearSearch();
            }
        }, 300);
    });
}

function performSearch(query) {
    const sections = document.querySelectorAll('h2, h3, .card-link a, .reference-item a, .guide-item a');
    sections.forEach(section => {
        section.style.backgroundColor = '';
        if (section.textContent.toLowerCase().includes(query)) {
            section.style.backgroundColor = '#fff3cd';
            section.style.padding = '2px 4px';
            section.style.borderRadius = '3px';
        }
    });
}

function clearSearch() {
    const highlighted = document.querySelectorAll('[style*="background-color"]');
    highlighted.forEach(el => {
        if (el.style.backgroundColor === 'rgb(255, 243, 205)') {
            el.style.backgroundColor = '';
            el.style.padding = '';
            el.style.borderRadius = '';
        }
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Simple copy code functionality
document.querySelectorAll('.code-block').forEach(block => {
    const copyButton = document.createElement('button');
    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
    copyButton.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        background: #f6f8fa;
        border: 1px solid #d1d9e0;
        border-radius: 4px;
        padding: 6px 8px;
        font-size: 12px;
        cursor: pointer;
        color: #1f2328;
        line-height: 1;
    `;
    
    block.style.position = 'relative';
    block.appendChild(copyButton);
    
    copyButton.addEventListener('click', function() {
        const code = block.querySelector('code').textContent;
        navigator.clipboard.writeText(code).then(() => {
            copyButton.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyButton.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
        });
    });
});

// Update breadcrumbs based on current section
function updateBreadcrumbs() {
    const sections = document.querySelectorAll('.content-section[id]');
    const breadcrumbCurrent = document.querySelector('.breadcrumbs .current');
    
    if (!breadcrumbCurrent) return;
    
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            
            if (scrollPos >= top && scrollPos <= bottom) {
                const sectionTitle = section.querySelector('h2')?.textContent || 'API GraphQL';
                breadcrumbCurrent.textContent = sectionTitle;
            }
        });
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    updateBreadcrumbs();
    
    // Add simple fade-in animation to cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.card, .reference-item, .guide-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        observer.observe(item);
    });
    
    console.log('📖 GitHub-style documentation loaded');
});

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
    clearSearch();
});
