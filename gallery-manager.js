/* =============================================
   ACAA - gallery-manager.js
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
    const config = {
        totalImages: 23, 
        containerId: 'dynamic-gallery',
        prefix: 'acaa_img'
    };

    const galleryContainer = document.getElementById(config.containerId);
    const lightbox = document.getElementById('lightbox');
    const fullImage = document.getElementById('fullImage');
    const closeBtn = document.querySelector('.lightbox-close');

    if (!galleryContainer) return;

    // 1. GERAÇÃO DINÂMICA
    let galleryHTML = '';
    for (let i = 1; i <= config.totalImages; i++) {
        galleryHTML += `
            <div class="gallery-item" data-index="${i}" data-aos="fade-up">
                <div class="gallery-overlay">
                    <div class="gallery-info">
                        <span class="gallery-category">ACAA Eventos</span>
                        <h4 class="gallery-title">Momento ACAA ${i}</h4>
                    </div>
                    <button class="gallery-view-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
                        </svg>
                    </button>
                </div>
                <img data-src="${config.prefix}${i}.webp" 
                     src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" 
                     alt="Evento ACAA ${i}" 
                     class="lazy-img">
            </div>
        `;
    }
    galleryContainer.innerHTML = galleryHTML;

    // 2. ABRIR LIGHTBOX E TRAVAR SCROLL
    galleryContainer.addEventListener('click', function(e) {
        const item = e.target.closest('.gallery-item');
        if (item && lightbox && fullImage) {
            const index = item.getAttribute('data-index');
            fullImage.src = `${config.prefix}${index}.webp`;
            
            lightbox.style.display = 'flex';
            // TRAVA O SCROLL
            document.body.style.overflow = 'hidden'; 
            document.documentElement.style.overflow = 'hidden';
        }
    });

    // 3. FUNÇÃO PARA FECHAR E LIBERAR SCROLL
    const closeLightbox = () => {
        if (lightbox) {
            lightbox.style.display = 'none';
            // LIBERA O SCROLL
            document.body.style.overflow = ''; 
            document.documentElement.style.overflow = '';
        }
    };

    // Fechar no botão X
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    // Fechar ao clicar fora da imagem
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // Fechar com a tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // Reiniciar Lazy Load se existir a função no script.js
    if (typeof initLazyLoading === 'function') initLazyLoading();
});
