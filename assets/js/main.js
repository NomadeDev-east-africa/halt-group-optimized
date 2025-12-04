/**
 * ============================================
 * HALT GROUP - JavaScript Principal
 * Interactions et fonctionnalités dynamiques
 * ============================================ */

(function() {
    'use strict';

    // ============================================
    // INITIALISATION AU CHARGEMENT DE LA PAGE
    // ============================================
    document.addEventListener('DOMContentLoaded', function() {
        initMobileMenu();
        initSmoothScroll();
        initBackToTop();
        initHeaderScroll();
        initAnimateOnScroll();
        initStatsCounter();
        initAccordion(); // ACCORDION
        initImageSwitcher(); // IMAGE SWITCHER
        initGalleryFilters(); // GALLERY FILTERS
    });

    // ============================================
    // MENU MOBILE
    // ============================================
    function initMobileMenu() {
        const toggle = document.getElementById('mobile-menu-toggle');
        const mobileNav = document.getElementById('mobile-nav');
        
        if (!toggle || !mobileNav) return;

        toggle.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            toggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Animation du hamburger
            const lines = toggle.querySelectorAll('.hamburger-line');
            lines.forEach((line, index) => {
                line.style.transform = toggle.classList.contains('active')
                    ? index === 0 ? 'rotate(45deg) translateY(8px)'
                    : index === 1 ? 'opacity(0)'
                    : 'rotate(-45deg) translateY(-8px)'
                    : '';
            });
        });

        // Fermer le menu en cliquant sur un lien
        const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileNav.classList.remove('active');
                toggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Fermer le menu en cliquant à l'extérieur
        document.addEventListener('click', function(e) {
            if (!toggle.contains(e.target) && !mobileNav.contains(e.target)) {
                mobileNav.classList.remove('active');
                toggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // ============================================
    // SMOOTH SCROLL pour les liens d'ancrage
    // ============================================
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Ignorer les liens vides
                if (href === '#' || href === '#!') return;
                
                const target = document.querySelector(href);
                if (!target) return;
                
                e.preventDefault();
                
                const headerHeight = document.getElementById('main-header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    // ============================================
    // BOUTON RETOUR EN HAUT
    // ============================================
    function initBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;

        // Afficher/masquer le bouton selon le scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        // Scroll vers le haut au clic
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // HEADER STICKY avec effet de scroll
    // ============================================
    function initHeaderScroll() {
        const header = document.getElementById('main-header');
        if (!header) return;

        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            // Ajouter classe "scrolled" après 100px
            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Masquer le header en scrollant vers le bas, afficher en scrollant vers le haut
            if (currentScroll > lastScroll && currentScroll > 500) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
        });
    }

    // ============================================
    // ANIMATION AU SCROLL (Intersection Observer)
    // ============================================
    function initAnimateOnScroll() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        // Ne plus observer après animation
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
            });

            elements.forEach(el => observer.observe(el));
        } else {
            // Fallback pour les navigateurs anciens
            elements.forEach(el => el.classList.add('animated'));
        }
    }

    // ============================================
    // COMPTEUR ANIMÉ pour les statistiques
    // ============================================
    function initStatsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number');
        let hasAnimated = false;

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !hasAnimated) {
                        hasAnimated = true;
                        animateStats();
                        observer.disconnect();
                    }
                });
            }, {
                threshold: 0.5
            });

            if (statNumbers.length > 0) {
                observer.observe(statNumbers[0].closest('.stats-section'));
            }
        }

        function animateStats() {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                const duration = 2000; // 2 secondes
                const increment = target / (duration / 16); // 60 FPS
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        stat.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        stat.textContent = target;
                    }
                };

                updateCounter();
            });
        }
    }

    // ============================================
    // LAZY LOADING des images
    // ============================================
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback : charger toutes les images immédiatement
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    // ============================================
    // PARALLAX EFFECT (optionnel)
    // ============================================
    function initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(el => {
                const speed = el.dataset.parallax || 0.5;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // ============================================
    // FORMULAIRE - Validation et soumission
    // ============================================
    function initFormValidation() {
        const forms = document.querySelectorAll('form[data-validate]');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Reset des erreurs
                const errors = form.querySelectorAll('.error-message');
                errors.forEach(error => error.remove());
                
                // Validation
                let isValid = true;
                const requiredFields = form.querySelectorAll('[required]');
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        showError(field, 'This field is required');
                    } else if (field.type === 'email' && !isValidEmail(field.value)) {
                        isValid = false;
                        showError(field, 'Please enter a valid email address');
                    }
                });
                
                if (isValid) {
                    // Soumettre le formulaire
                    submitForm(form);
                }
            });
        });

        function showError(field, message) {
            const error = document.createElement('span');
            error.className = 'error-message';
            error.textContent = message;
            error.style.color = 'red';
            error.style.fontSize = '0.875rem';
            error.style.marginTop = '0.25rem';
            error.style.display = 'block';
            field.parentNode.insertBefore(error, field.nextSibling);
        }

        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        function submitForm(form) {
            const formData = new FormData(form);
            
            // Afficher un message de chargement
            const submitBtn = form.querySelector('[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Envoyer les données (à adapter selon votre backend)
            fetch(form.action, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showSuccess(form, 'Message sent successfully!');
                    form.reset();
                } else {
                    showError(form, data.message || 'An error occurred');
                }
            })
            .catch(error => {
                showError(form, 'An error occurred. Please try again.');
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        }

        function showSuccess(form, message) {
            const success = document.createElement('div');
            success.className = 'success-message';
            success.textContent = message;
            success.style.color = 'green';
            success.style.padding = '1rem';
            success.style.marginTop = '1rem';
            success.style.backgroundColor = '#d4edda';
            success.style.border = '1px solid #c3e6cb';
            success.style.borderRadius = '4px';
            form.appendChild(success);
            
            setTimeout(() => success.remove(), 5000);
        }
    }

    // ============================================
    // IMAGE SWITCHER
    // ============================================
    function initImageSwitcher() {
        const items = document.querySelectorAll('.features-service-item');
        const bgContainer = document.querySelector('.features-service-bg');
        
        if (!items.length || !bgContainer) return;
        
        items.forEach(item => {
            // Hover event
            item.addEventListener('mouseenter', function() {
                const imageUrl = this.getAttribute('data-image');
                
                if (imageUrl) {
                    // Remove active class from all items
                    items.forEach(i => i.classList.remove('active'));
                    
                    // Add active to current item
                    this.classList.add('active');
                    
                    // Change background image
                    bgContainer.style.backgroundImage = `url('${imageUrl}')`;
                }
            });
        });
        
        // Set first image on load
        const firstImage = items[0].getAttribute('data-image');
        if (firstImage) {
            bgContainer.style.backgroundImage = `url('${firstImage}')`;
        }
    }

    // ============================================
    // ACCORDION
    // ============================================
    function initAccordion() {
        const headers = document.querySelectorAll('.accordion-header');
        
        if (headers.length === 0) return;
        
        // Ouvrir le premier par défaut
        const items = document.querySelectorAll('.accordion-item');
        items[0].classList.add('active');
        
        // Ajouter les événements de clic
        headers.forEach((header, index) => {
            header.addEventListener('click', function(e) {
                e.preventDefault();
                
                const clickedItem = this.closest('.accordion-item');
                const wasActive = clickedItem.classList.contains('active');
                
                // Fermer tous les accordions
                items.forEach(item => item.classList.remove('active'));
                
                // Ouvrir celui cliqué s'il était fermé
                if (!wasActive) {
                    clickedItem.classList.add('active');
                }
            });
        });
    }

    // ============================================
    // GALLERY FILTERS
    // ============================================
    function initGalleryFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        if (filterBtns.length === 0 || galleryItems.length === 0) return;
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter gallery items
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        item.classList.remove('hide');
                        setTimeout(() => {
                            item.style.display = 'block';
                        }, 10);
                    } else {
                        item.classList.add('hide');
                    }
                });
            });
        });
    }

    // ============================================
    // UTILITAIRES
    // ============================================
    
    // Debounce pour optimiser les événements de scroll/resize
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

    // Throttle pour limiter la fréquence d'exécution
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

})();