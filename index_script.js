// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced AI Cards Carousel
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.ai-cards-container');
    const cards = document.querySelectorAll('.ai-card');
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const currentCardSpan = document.getElementById('current-card');
    const totalCardsSpan = document.getElementById('total-cards');
    
    if (!container || !cards.length) return;
    
    // Set total cards count
    if (totalCardsSpan) totalCardsSpan.textContent = cards.length;
    
    // Create dots
    cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if(index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => scrollToCard(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    let isAnimating = false;
    let autoScroll;
    
    // Check if mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Mobile touch gallery behavior
        let touchStartX = 0;
        let touchEndX = 0;
        let isDragging = false;
        let startTransform = 0;
        
        const getCardWidth = () => {
            const cardStyle = window.getComputedStyle(cards[0]);
            const cardWidth = cards[0].offsetWidth;
            const gap = 20;
            return cardWidth + gap;
        };
        
        function updateMobileView() {
            const cardWidth = getCardWidth();
            const offset = -currentIndex * cardWidth;
            container.style.transform = `translateX(${offset}px)`;
            
            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
            
            // Update counter
            if (currentCardSpan) currentCardSpan.textContent = currentIndex + 1;
            
            // Update active card
            cards.forEach((card, i) => {
                card.classList.toggle('active', i === currentIndex);
            });
        }
        
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            isDragging = true;
            startTransform = currentIndex;
            container.style.transition = 'none';
        }, { passive: true });
        
        container.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            touchEndX = e.touches[0].clientX;
            const diff = touchStartX - touchEndX;
            const cardWidth = getCardWidth();
            const currentOffset = -startTransform * cardWidth;
            const newOffset = currentOffset - diff;
            
            container.style.transform = `translateX(${newOffset}px)`;
        }, { passive: true });
        
        container.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            isDragging = false;
            container.style.transition = 'transform 0.3s ease';
            
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0 && currentIndex < cards.length - 1) {
                    currentIndex++;
                } else if (diff < 0 && currentIndex > 0) {
                    currentIndex--;
                }
            }
            
            updateMobileView();
        }, { passive: true });
        
        // Initialize mobile view
        updateMobileView();
        
    } else {
        // Desktop behavior
        const getCardWidth = () => {
            const cardStyle = window.getComputedStyle(cards[0]);
            const cardWidth = cards[0].offsetWidth;
            const gap = 30;
            return cardWidth + gap;
        };
        
        // Auto-scroll every 4 seconds
        autoScroll = setInterval(() => {
            if (!isAnimating) {
                currentIndex = (currentIndex + 1) % cards.length;
                scrollToCard(currentIndex);
            }
        }, 4000);
        
        function scrollToCard(index, smooth = true) {
            if (isAnimating) return;
            
            isAnimating = true;
            currentIndex = index;
            
            cards[currentIndex].classList.add('slide-in');
            cards.forEach(card => card.classList.remove('active'));
            cards[currentIndex].classList.add('active');
            
            const cardWidth = getCardWidth();
            const offset = -index * cardWidth;
            
            container.style.transform = `translateX(${offset}px)`;
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            clearInterval(autoScroll);
            
            setTimeout(() => {
                isAnimating = false;
                cards[currentIndex].classList.remove('slide-in');
                
                autoScroll = setInterval(() => {
                    if (!isAnimating) {
                        currentIndex = (currentIndex + 1) % cards.length;
                        scrollToCard(currentIndex);
                    }
                }, 4000);
            }, 800);
        }
        
        // Manual controls
        prevBtn.addEventListener('click', () => {
            if (!isAnimating) {
                currentIndex = (currentIndex - 1 + cards.length) % cards.length;
                scrollToCard(currentIndex);
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (!isAnimating) {
                currentIndex = (currentIndex + 1) % cards.length;
                scrollToCard(currentIndex);
            }
        });
        
        // Pause auto-scroll on hover
        const aiSection = document.querySelector('.ai-section');
        aiSection.addEventListener('mouseenter', () => {
            clearInterval(autoScroll);
        });
        
        aiSection.addEventListener('mouseleave', () => {
            if (!isAnimating) {
                autoScroll = setInterval(() => {
                    if (!isAnimating) {
                        currentIndex = (currentIndex + 1) % cards.length;
                        scrollToCard(currentIndex);
                    }
                }, 4000);
            }
        });
        
        // Initial scroll positioning
        scrollToCard(currentIndex);
    }
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            location.reload(); // Simple solution to handle orientation change
        }, 500);
    });
});