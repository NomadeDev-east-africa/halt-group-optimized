/**
 * DYNAMIC GALLERY LOADER - Halt Group (VERSION CORRIGÉE)
 * Charge automatiquement les images depuis les dossiers et applique les filtres
 * Avec gestion améliorée des chemins et debug
 */

document.addEventListener('DOMContentLoaded', function() {
    
    console.log('🎨 Dynamic Gallery - Chargement...');
    
    // =============================================
    // CONFIGURATION DES IMAGES
    // =============================================
    
    const galleryConfig = {
        construction: {
            count: 14,
            folder: 'assets/images/gallery/construction/',
            prefix: 'construction',
            extension: 'jpg',
            titles: [
                'Building Foundation',
                'Construction Site',
                'Steel Framework',
                'Foundation Work',
                'Commercial Building',
                'Structural Work',
                'Construction Progress',
                'Building Development',
                'Modern Architecture',
                'Residential Project',
                'Building Construction',
                'Urban Development',
                'Construction Site',
                'Infrastructure Project'
            ]
        },
        equipment: {
            count: 27,
            folder: 'assets/images/gallery/equipement/',
            prefix: 'equipement', // Note: différent du nom du dossier
            extension: 'jpg',
            titles: [
                'Heavy Machinery',
                'Excavator',
                'Construction Equipment',
                'Machinery Fleet',
                'GPS Equipment',
                'Heavy Equipment',
                'Survey Equipment',
                'Construction Vehicle',
                'Surveying Tool',
                'Equipment Operator',
                'Construction Machine',
                'Heavy Duty Equipment',
                'Surveying Team',
                'Construction Tool',
                'Equipment Fleet',
                'Machinery',
                'Construction Vehicle',
                'Heavy Equipment',
                'Survey Equipment',
                'Construction Machine',
                'Equipment Rental',
                'Heavy Machinery',
                'Construction Equipment',
                'Machinery Fleet',
                'Equipment',
                'Construction Vehicle',
                'Heavy Equipment'
            ]
        },
        manpower: {
            count: 10,
            folder: 'assets/images/gallery/manpower/',
            prefix: 'manpower',
            extension: 'jpg',
            titles: [
                'Survey Team',
                'Skilled Workers',
                'Safety Equipment',
                'Construction Team',
                'Field Worker',
                'Labor Force',
                'Professional Team',
                'Workforce',
                'Work in Progress',
                'Team Collaboration'
            ]
        },
        procurement: {
            count: 13,
            folder: 'assets/images/gallery/procurement/',
            prefix: 'procurement',
            extension: 'jpg',
            titles: [
                'Material Supply',
                'Procurement Services',
                'Construction Materials',
                'Supply Management',
                'Material Procurement',
                'Equipment Supply',
                'DMX',
                'DMX',
                'DMX',
                'DMX',
                'DMX',
            ]
        }
    };

    // =============================================
    // FONCTIONS UTILITAIRES
    // =============================================
    
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Fonction pour charger une image avec fallback d'extension
    function loadImageWithFallback(imagePath, fileName, callback) {
        // Essayer .jpg d'abord
        const imgJPG = new Image();
        const jpgPath = imagePath.replace('{filename}', fileName + '.jpg');
        
        imgJPG.onload = function() {
            console.log(`✅ Image chargée: ${jpgPath}`);
            callback(jpgPath, true);
        };
        
        imgJPG.onerror = function() {
            // Essayer .jpeg
            const imgJPEG = new Image();
            const jpegPath = imagePath.replace('{filename}', fileName + '.jpeg');
            
            imgJPEG.onload = function() {
                console.log(`✅ Image chargée (JPEG): ${jpegPath}`);
                callback(jpegPath, true);
            };
            
            imgJPEG.onerror = function() {
                // Essayer .JPG (majuscule)
                const imgJPG2 = new Image();
                const jpg2Path = imagePath.replace('{filename}', fileName + '.JPG');
                
                imgJPG2.onload = function() {
                    console.log(`✅ Image chargée (JPG majuscule): ${jpg2Path}`);
                    callback(jpg2Path, true);
                };
                
                imgJPG2.onerror = function() {
                    console.error(`❌ Image non trouvée: ${fileName} [.jpg, .jpeg, .JPG]`);
                    callback(null, false);
                };
                
                imgJPG2.src = jpg2Path;
            };
            
            imgJPEG.src = jpegPath;
        };
        
        imgJPG.src = jpgPath;
    }

    // =============================================
    // GÉNÉRATION DYNAMIQUE DE LA GALERIE
    // =============================================
    
    function generateGallery() {
        const galleryGrid = document.querySelector('.gallery-grid');
        
        if (!galleryGrid) {
            console.error('❌ Gallery grid non trouvé');
            return;
        }
        
        // Vider la galerie existante (enlever le loader)
        galleryGrid.innerHTML = '';
        
        let totalImages = 0;
        let loadedImages = 0;
        
        // Générer les items pour chaque catégorie
        Object.keys(galleryConfig).forEach(category => {
            const config = galleryConfig[category];
            
            console.log(`📁 Chargement ${category}: ${config.count} images`);
            
            for (let i = 1; i <= config.count; i++) {
                totalImages++;
                
                // Format: construction_1, manpower_2, etc.
                const fileName = `${config.prefix}_${i}`;
                const imagePathBase = `${config.folder}{filename}`;
                
                console.log(`  🖼️ ${category} ${i}: ${fileName}`);
                
                // Titre de l'image
                const title = config.titles[i - 1] || `${capitalize(category)} ${i}`;
                
                // Créer l'élément HTML (vide d'abord)
                const galleryItem = createGalleryItemSkeleton(category, title, i);
                
                // Ajouter à la grille
                galleryGrid.appendChild(galleryItem);
                
                // Charger l'image après l'ajout au DOM
                loadImageWithFallback(imagePathBase, fileName, (imagePath, success) => {
                    if (success && imagePath) {
                        updateGalleryItemWithImage(galleryItem, imagePath, title, category);
                        loadedImages++;
                    } else {
                        showImageError(galleryItem, title);
                        loadedImages++;
                    }
                    
                    // Afficher un message quand toutes les images sont traitées
                    if (loadedImages === totalImages) {
                        console.log(`✅ Galerie générée: ${loadedImages}/${totalImages} images chargées`);
                        
                        // Afficher tous les projets
                        setTimeout(() => {
                            filterGallery('all');
                        }, 100);
                    }
                });
            }
        });
        
        console.log(`⏳ Génération démarrée pour ${totalImages} images`);
    }

    // =============================================
    // FONCTIONS DE CRÉATION DES ITEMS
    // =============================================
    
    function createGalleryItemSkeleton(category, title, index) {
        // Créer le conteneur principal
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.setAttribute('data-category', category);
        item.setAttribute('data-index', index);
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        // Créer la structure HTML avec placeholder
        item.innerHTML = `
            <div class="gallery-image">
                <div class="image-placeholder" style="width: 100%; height: 250px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); display: flex; align-items: center; justify-content: center; border-radius: 4px;">
                    <div style="text-align: center;">
                        <div class="loader" style="width: 30px; height: 30px; border: 3px solid #f3f3f3; border-top: 3px solid #e74c3c; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px;"></div>
                        <p style="color: #666; font-size: 12px; margin: 0;">Loading...</p>
                    </div>
                </div>
                <div class="gallery-overlay">
                    <div class="gallery-info">
                        <h3>${title}</h3>
                        <p>${capitalize(category)} Project</p>
                        <a href="#" class="gallery-link" data-lightbox="gallery-${category}" data-title="${title}">
                            <span>View Full</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        return item;
    }
    
    function updateGalleryItemWithImage(item, imagePath, title, category) {
        const placeholder = item.querySelector('.image-placeholder');
        const galleryImageDiv = item.querySelector('.gallery-image');
        
        if (placeholder && galleryImageDiv) {
            // Créer l'image
            const img = document.createElement('img');
            img.src = imagePath;
            img.alt = title;
            img.title = title;
            img.loading = 'lazy';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '4px';
            img.style.display = 'block';
            
            // Remplacer le placeholder par l'image
            placeholder.parentNode.replaceChild(img, placeholder);
            
            // Mettre à jour le lien lightbox
            const link = item.querySelector('.gallery-link');
            if (link) {
                link.href = imagePath;
                link.setAttribute('data-lightbox', `gallery-${category}`);
                link.setAttribute('data-title', title);
            }
            
            // Animation d'apparition
            setTimeout(() => {
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100);
        }
    }
    
    function showImageError(item, title) {
        const placeholder = item.querySelector('.image-placeholder');
        if (placeholder) {
            placeholder.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5" style="margin-bottom: 10px;">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                        <line x1="9" y1="9" x2="15" y2="15" stroke="#f44336"></line>
                        <line x1="15" y1="9" x2="9" y2="15" stroke="#f44336"></line>
                    </svg>
                    <p style="color: #999; font-size: 12px; margin: 0 0 5px 0; font-weight: 600;">${title}</p>
                    <p style="color: #f44336; font-size: 10px; margin: 0;">Image non trouvée</p>
                </div>
            `;
            placeholder.style.backgroundColor = '#ffebee';
            
            // Animation d'apparition quand même
            setTimeout(() => {
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    // =============================================
    // SYSTÈME DE FILTRAGE
    // =============================================
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    function filterGallery(category) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        let visibleCount = 0;
        
        console.log(`🔍 Filtrage: ${category}`);
        
        galleryItems.forEach((item, index) => {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
                
                // Animation en cascade
                setTimeout(() => {
                    item.style.transition = 'all 0.5s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 30);
                
                visibleCount++;
            } else {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '0';
                item.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        console.log(`✅ ${visibleCount} images affichées`);
        showNoResultsMessage(visibleCount);
    }

    function showNoResultsMessage(count) {
        const oldMessage = document.querySelector('.no-results-message');
        if (oldMessage) {
            oldMessage.remove();
        }
        
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
                    <h3 style="color: #333; font-size: 24px; margin-bottom: 10px;">No projects found</h3>
                    <p style="color: #666; font-size: 16px;">There are currently no projects in this category.</p>
                </div>
            `;
            galleryGrid.appendChild(message);
        }
    }

    // Event listeners pour les filtres
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Mettre à jour les boutons actifs
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Appliquer le filtre
                const category = this.getAttribute('data-filter');
                filterGallery(category);
                
                // Animation du bouton
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 100);
            });
        });
    }

    // =============================================
    // FONCTIONS DE DEBUG ET VÉRIFICATION
    // =============================================
    
    function checkImagePaths() {
        console.log('🔍 Vérification des chemins d\'images...');
        
        Object.keys(galleryConfig).forEach(category => {
            const config = galleryConfig[category];
            console.log(`\n📁 Catégorie: ${category.toUpperCase()}`);
            console.log(`📂 Dossier: ${config.folder}`);
            console.log(`📊 Nombre d'images: ${config.count}`);
            console.log(`🏷️  Format: ${config.prefix}_1, ${config.prefix}_2, etc.`);
            
            // Tester les 3 premières images
            const testCount = Math.min(3, config.count);
            for (let i = 1; i <= testCount; i++) {
                const fileName = `${config.prefix}_${i}`;
                console.log(`  📄 ${fileName} :`);
                
                // Tester les extensions
                const extensions = ['.jpg', '.jpeg', '.JPG', '.JPEG', '.png', '.PNG'];
                extensions.forEach(ext => {
                    const img = new Image();
                    const path = `${config.folder}${fileName}${ext}`;
                    
                    img.onload = function() {
                        console.log(`    ✅ ${ext} - TROUVÉ`);
                    };
                    
                    img.onerror = function() {
                        // On ne logge que si c'est la dernière extension testée
                        if (ext === extensions[extensions.length - 1]) {
                            console.log(`    ❌ Aucune extension trouvée pour ${fileName}`);
                        }
                    };
                    
                    img.src = path;
                });
            }
        });
    }

    // =============================================
    // INITIALISATION
    // =============================================
    
    // Ajouter le CSS pour l'animation du loader
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .gallery-item {
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .gallery-image img {
            width: 100%;
            height: 250px;
            object-fit: cover;
            border-radius: 4px;
            display: block;
        }
    `;
    document.head.appendChild(style);
    
    // Vérifier les chemins (debug)
    checkImagePaths();
    
    // Générer la galerie
    generateGallery();
    
    // Compteur de projets par catégorie
    function updateProjectCounts() {
        const counts = {
            all: 0,
            construction: 0,
            equipment: 0,
            procurement: 0,
            manpower: 0
        };
        
        Object.keys(galleryConfig).forEach(category => {
            const count = galleryConfig[category].count;
            counts[category] = count;
            counts.all += count;
        });
        
        console.log('📊 Compteurs:', counts);
        
        // Ajouter les compteurs aux boutons
        filterButtons.forEach(button => {
            const category = button.getAttribute('data-filter');
            if (counts[category] !== undefined) {
                const countSpan = button.querySelector('.count') || document.createElement('span');
                if (!button.querySelector('.count')) {
                    countSpan.className = 'count';
                    countSpan.style.marginLeft = '8px';
                    countSpan.style.padding = '2px 8px';
                    countSpan.style.background = 'rgba(0,0,0,0.1)';
                    countSpan.style.borderRadius = '12px';
                    countSpan.style.fontSize = '0.85em';
                    button.appendChild(countSpan);
                }
                countSpan.textContent = counts[category];
            }
        });
    }
    
    updateProjectCounts();
    
    console.log('🎉 Gallery initialisée avec succès!');

});