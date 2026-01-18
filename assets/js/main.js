/**
 * ============================================
 * HALT GROUP - JavaScript Principal
 * Interactions et fonctionnalités dynamiques
 * Version corrigée et responsive
 * ============================================ */

(function() {
    'use strict';

    // ============================================
    // INITIALISATION AU CHARGEMENT DE LA PAGE
    // ============================================
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Halt Group JS - Initialisation');
        
        initMobileMenu();
        initSmoothScroll();
        initBackToTop();
        initHeaderScroll();
        initAnimateOnScroll();
        initStatsCounter();
        initAccordion();
        initImageSwitcher();
        initGalleryFilters();
        initProgressBar();
    });

    // ============================================
    // MENU MOBILE - CORRIGÉ
    // ============================================
    function initMobileMenu() {
        const toggle = document.getElementById('mobile-menu-toggle');
        const mobileNav = document.getElementById('mobile-nav');
        const body = document.body;
        
        if (!toggle || !mobileNav) {
            console.warn('Éléments du menu mobile non trouvés');
            return;
        }

        console.log('Menu mobile initialisé');

        // Fonction pour fermer le menu
        function closeMenu() {
            mobileNav.classList.remove('active');
            toggle.classList.remove('active');
            body.classList.remove('menu-open');
            toggle.setAttribute('aria-expanded', 'false');
            mobileNav.setAttribute('aria-hidden', 'true');
            console.log('Menu fermé');
        }

        // Fonction pour ouvrir le menu
        function openMenu() {
            mobileNav.classList.add('active');
            toggle.classList.add('active');
            body.classList.add('menu-open');
            toggle.setAttribute('aria-expanded', 'true');
            mobileNav.setAttribute('aria-hidden', 'false');
            console.log('Menu ouvert');
        }

        // Toggle au clic sur le bouton
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            if (mobileNav.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Fermer le menu en cliquant sur un lien
        const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                
                closeMenu();
                
                // Navigation différée
                setTimeout(() => {
                    if (href.startsWith('#')) {
                        // Lien d'ancre
                        const target = document.querySelector(href);
                        if (target) {
                            const headerHeight = document.getElementById('main-header').offsetHeight;
                            const targetPosition = target.offsetTop - headerHeight;
                            
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                        }
                    } else {
                        // Lien normal
                        window.location.href = href;
                    }
                }, 300);
            });
        });

        // Fermer le menu en cliquant à l'extérieur
        document.addEventListener('click', function(e) {
            if (mobileNav.classList.contains('active') && 
                !mobileNav.contains(e.target) && 
                !toggle.contains(e.target)) {
                closeMenu();
            }
        });

        // Fermer le menu avec la touche Échap
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                closeMenu();
                toggle.focus(); // Retourner le focus sur le bouton
            }
        });

        // Gérer le focus dans le menu pour l'accessibilité
        const firstLink = mobileLinks[0];
        const lastLink = mobileLinks[mobileLinks.length - 1];

        mobileNav.addEventListener('keydown', function(e) {
            if (!mobileNav.classList.contains('active')) return;

            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstLink) {
                    // Shift + Tab depuis le premier lien
                    e.preventDefault();
                    toggle.focus();
                } else if (!e.shiftKey && document.activeElement === lastLink) {
                    // Tab depuis le dernier lien
                    e.preventDefault();
                    toggle.focus();
                }
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
                
                // Si c'est un lien de navigation mobile, laisser le menu mobile le gérer
                if (this.classList.contains('mobile-nav-link')) {
                    return;
                }
                
                const target = document.querySelector(href);
                if (!target) return;
                
                e.preventDefault();
                
                const header = document.getElementById('main-header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                console.log('Scroll smooth vers:', href);
            });
        });
    }

    // ============================================
    // BOUTON RETOUR EN HAUT - CORRIGÉ
    // ============================================
    function initBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;

        console.log('Bouton retour en haut initialisé');

        // Afficher/masquer le bouton selon le scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
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

        console.log('Header sticky initialisé');

        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            // Ajouter classe "scrolled" après 50px
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Effet de shrink sur le header
            if (currentScroll > 100) {
                header.style.padding = '0.5rem 0';
                const logo = header.querySelector('.logo-image');
                if (logo) logo.style.height = '40px';
            } else {
                header.style.padding = '1rem 0';
                const logo = header.querySelector('.logo-image');
                if (logo) logo.style.height = '50px';
            }

            lastScroll = currentScroll;
        });
    }

    // ============================================
    // ANIMATION AU SCROLL (Intersection Observer)
    // ============================================
    function initAnimateOnScroll() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        if (!elements.length) return;
        
        console.log('Animation au scroll initialisée');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
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
            elements.forEach(el => el.classList.add('visible'));
        }
    }

    // ============================================
    // PROGRESS SCROLL BAR
    // ============================================
    function initProgressBar() {
        const progressBar = document.getElementById('progress-bar');
        if (!progressBar) return;

        console.log('Barre de progression initialisée');

        window.addEventListener('scroll', function() {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.pageYOffset / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // ============================================
    // COMPTEUR ANIMÉ pour les statistiques
    // ============================================
    function initStatsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number');
        if (!statNumbers.length) return;

        console.log('Compteur statistiques initialisé');

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

            const statsSection = statNumbers[0].closest('.stats-section');
            if (statsSection) {
                observer.observe(statsSection);
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
    // ACCORDION
    // ============================================
    function initAccordion() {
        const headers = document.querySelectorAll('.accordion-header');
        if (!headers.length) return;

        console.log('Accordion initialisé');

        // Ouvrir le premier par défaut
        const items = document.querySelectorAll('.accordion-item');
        if (items.length > 0) {
            items[0].classList.add('active');
        }
        
        // Ajouter les événements de clic
        headers.forEach((header) => {
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
    // IMAGE SWITCHER
    // ============================================
    function initImageSwitcher() {
        const items = document.querySelectorAll('.features-service-item');
        const bgContainer = document.querySelector('.features-service-bg');
        
        if (!items.length || !bgContainer) return;

        console.log('Image switcher initialisé');
        
        // Activer le premier élément par défaut
        if (items.length > 0) {
            items[0].classList.add('active');
        }
        
        items.forEach(item => {
            // Hover event pour desktop
            item.addEventListener('mouseenter', function() {
                if (window.innerWidth > 768) { // Desktop seulement
                    const imageUrl = this.getAttribute('data-image');
                    
                    if (imageUrl) {
                        // Remove active class from all items
                        items.forEach(i => i.classList.remove('active'));
                        
                        // Add active to current item
                        this.classList.add('active');
                        
                        // Change background image
                        bgContainer.style.backgroundImage = `url('${imageUrl}')`;
                    }
                }
            });

            // Click event pour mobile
            item.addEventListener('click', function() {
                if (window.innerWidth <= 768) { // Mobile seulement
                    const imageUrl = this.getAttribute('data-image');
                    
                    if (imageUrl) {
                        // Toggle active class
                        const isActive = this.classList.contains('active');
                        
                        items.forEach(i => i.classList.remove('active'));
                        
                        if (!isActive) {
                            this.classList.add('active');
                            bgContainer.style.backgroundImage = `url('${imageUrl}')`;
                        } else {
                            // Si déjà actif, réactiver le premier
                            items[0].classList.add('active');
                            const firstImage = items[0].getAttribute('data-image');
                            if (firstImage) {
                                bgContainer.style.backgroundImage = `url('${firstImage}')`;
                            }
                        }
                    }
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
    // GALLERY FILTERS
    // ============================================
    function initGalleryFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        if (filterBtns.length === 0 || galleryItems.length === 0) return;

        console.log('Gallery filters initialisé');
        
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
                        item.style.display = 'block';
                    } else {
                        item.classList.add('hide');
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // ============================================
    // FORMULAIRE - Validation et soumission
    // ============================================
    function initFormValidation() {
        const forms = document.querySelectorAll('form[data-validate]');
        if (!forms.length) return;

        console.log('Validation de formulaire initialisée');
        
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
            
            // Ajouter une classe d'erreur au champ
            field.classList.add('error');
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
            
            // Envoyer les données (simulation)
            setTimeout(() => {
                showSuccess(form, 'Message sent successfully!');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        }

        function showSuccess(form, message) {
            // Retirer les anciens messages de succès
            const oldSuccess = form.querySelector('.success-message');
            if (oldSuccess) oldSuccess.remove();
            
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
    // GESTION DES ERREURS GLOBALES
    // ============================================
    window.addEventListener('error', function(e) {
        console.error('Erreur JavaScript:', e.message, e.filename, e.lineno);
    });

    // ============================================
    // OPTIMISATION PERFORMANCE - Debounce
    // ============================================
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

    // ============================================
    // OPTIMISATION PERFORMANCE - Throttle
    // ============================================
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

    // ============================================
    // EXPOSER LES FONCTIONS UTILES GLOBALEMENT
    // ============================================
    window.HaltGroup = window.HaltGroup || {};
    window.HaltGroup.utils = {
        debounce,
        throttle
    };

})();