/**
 * ============================================
 * ACCORDION - Fichier standalone
 * Utilisez ce fichier SI vous ne voulez pas modifier main.js
 * ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
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
    
});
