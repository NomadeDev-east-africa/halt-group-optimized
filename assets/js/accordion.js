// ========================================
// ACCORDION FUNCTIONALITY
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Sélectionner tous les headers d'accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            
            // Récupérer l'élément parent (accordion-item)
            const accordionItem = this.parentElement;
            
            // Récupérer le contenu associé
            const accordionContent = accordionItem.querySelector('.accordion-content');
            
            // Vérifier si l'item est déjà actif
            const isActive = accordionItem.classList.contains('active');
            
            // Fermer tous les autres accordions
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
                const content = item.querySelector('.accordion-content');
                content.style.maxHeight = null;
            });
            
            // Si l'item n'était pas actif, l'ouvrir
            if (!isActive) {
                accordionItem.classList.add('active');
                accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
            }
            
        });
    });
    
    // Ouvrir le premier accordion par défaut
    const firstAccordion = document.querySelector('.accordion-item');
    if (firstAccordion) {
        firstAccordion.classList.add('active');
        const firstContent = firstAccordion.querySelector('.accordion-content');
        firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
    }
    
});
