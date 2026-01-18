/**
 * Système de filtrage de la galerie - Halt Group
 * Permet de filtrer les projets par catégorie (construction, equipment, procurement, tous)
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // =============================================
    // INITIALISATION DES VARIABLES
    // =============================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Vérification que les éléments existent
    if (!filterButtons.length || !galleryItems.length) {
        console.warn('Galerie ou filtres non trouvés sur cette page');
        return;
    }

    // =============================================
    // FONCTION DE FILTRAGE
    // =============================================
    function filterGallery(category) {
        let visibleCount = 0;
        
        galleryItems.forEach((item, index) => {
            const itemCategory = item.getAttribute('data-category');
            
            // Si "all" est sélectionné ou la catégorie correspond
            if (category === 'all' || itemCategory === category) {
                // Animation d'apparition
                item.style.display = 'block';
                
                // Ajout d'une animation en cascade
                setTimeout(() => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        item.style.transition = 'all 0.5s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 50); // Délai progressif pour effet cascade
                }, 10);
                
                visibleCount++;
            } else {
                // Animation de disparition
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '0';
                item.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        // Afficher un message si aucun projet n'est trouvé
        showNoResultsMessage(visibleCount);
    }

    // =============================================
    // MESSAGE AUCUN RÉSULTAT
    // =============================================
    function showNoResultsMessage(count) {
        // Supprimer l'ancien message s'il existe
        const oldMessage = document.querySelector('.no-results-message');
        if (oldMessage) {
            oldMessage.remove();
        }
        
        // Si aucun résultat, afficher un message
        if (count === 0) {
            const galleryGrid = document.querySelector('.gallery-grid');
            const message = document.createElement('div');
            message.className = 'no-results-message';
            message.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; grid-column: 1 / -1;">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ddd" stroke-width="1.5" style="margin: 0 auto 20px;">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <h3 style="color: #333; font-size: 24px; margin-bottom: 10px;">Aucun projet trouvé</h3>
                    <p style="color: #666; font-size: 16px;">Il n'y a actuellement aucun projet dans cette catégorie.</p>
                </div>
            `;
            galleryGrid.appendChild(message);
        }
    }

    // =============================================
    // GESTION DES CLICS SUR LES FILTRES
    // =============================================
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            // Obtenir la catégorie du bouton
            const category = this.getAttribute('data-filter');
            
            // Appliquer le filtre
            filterGallery(category);
            
            // Animation du bouton (effet de clic)
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });

    // =============================================
    // INITIALISATION - Afficher tous les projets
    // =============================================
    filterGallery('all');
    
    // =============================================
    // COMPTEUR DE PROJETS PAR CATÉGORIE
    // =============================================
    function updateFilterCounts() {
        const counts = {
            all: 0,
            construction: 0,
            equipment: 0,
            procurement: 0,
            manpower: 0
        };
        
        galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            counts[category]++;
            counts.all++;
        });
        
        // Mettre à jour les badges de compteur (optionnel)
        filterButtons.forEach(button => {
            const category = button.getAttribute('data-filter');
            const count = counts[category];
            
            // Ajouter un badge avec le nombre (si vous voulez cette fonctionnalité)
            // button.innerHTML += ` <span class="filter-count">(${count})</span>`;
        });
    }
    
    // Appeler la fonction de comptage (optionnel)
    // updateFilterCounts();

    // =============================================
    // ANIMATION AU CHARGEMENT
    // =============================================
    setTimeout(() => {
        galleryItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 300);

});

/**
 * NOTES D'UTILISATION:
 * 
 * 1. Structure HTML requise:
 *    - Boutons de filtre avec classe "filter-btn" et attribut "data-filter"
 *    - Items de galerie avec classe "gallery-item" et attribut "data-category"
 * 
 * 2. Catégories disponibles:
 *    - all: Tous les projets
 *    - construction: Projets de construction
 *    - equipment: Équipements
 *    - procurement: Approvisionnement
 *    - manpower: Main-d'œuvre (EAD Interim)
 * 
 * 3. Pour ajouter de nouvelles images:
 *    - Créer un div avec classe "gallery-item"
 *    - Ajouter l'attribut data-category="[catégorie]"
 *    - Exemple: <div class="gallery-item" data-category="equipment">
 */
