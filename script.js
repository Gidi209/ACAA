

/* =============================================
   ACAA - script.js
   Associação Cultural Alexandre e Artes
   Website Institucional Premium
   Desenvolvido por Gideão Fernando Nguvelu Maneco
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // VARIÁVEIS GLOBAIS
    // ============================================
    const html = document.documentElement;
    const body = document.body;
    const loader = document.getElementById('loader');
    const header = document.getElementById('header');
    const themeToggle = document.getElementById('themeToggle');
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const backToTop = document.getElementById('backToTop');
    const cursor = document.getElementById('cursor');
    const contactForm = document.getElementById('acaa');
    const newsletterForm = document.getElementById('newsletterAcca');
    const filterBtns = document.querySelectorAll('.filter-btn, .gallery-filter .filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const sections = document.querySelectorAll('section');
    const lightbox = document.getElementById('lightbox');
    const fullImage = document.getElementById('fullImage');
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

    // ============================================
    // 1. LOADER
    // ============================================
    function hideLoader() {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 2500);
    }
    hideLoader();

    // ============================================
    // 2. TEMA DARK/LIGHT
    // ============================================
    // Verificar preferência salva
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        html.setAttribute('data-theme', 'light');
    }

    // Toggle do tema
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // ============================================
    // 3. HEADER ESCROLL
    // ============================================
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Mostrar/esconder botão voltar ao topo
        if (currentScroll > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        lastScroll = currentScroll;
    });

    // ============================================
    // 4. MENU MOBILE
    // ============================================
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Fechar menu ao clicar num link
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // ============================================
    // 5. VOLTAR AO TOPO
    // ============================================
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    
    

    // ============================================
    // 6. NAVEGAÇÃO ATIVA NO SCROLL
    // ============================================
    function updateActiveNav() {
        const scrollPos = window.scrollY + 150;

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

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // ============================================
    // 7. SCROLL SUAVE PARA LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ============================================
    // 8. ANIMAÇÕES COM INTERSECTION OBSERVER
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });

    // ============================================
    // 9. CONTADOR DE ESTATÍSTICAS ANIMADO
    // ============================================
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);

            element.textContent = current.toLocaleString('pt-BR');

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // Observar elementos com contadores
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number, .counter-number').forEach(el => {
        counterObserver.observe(el);
    });

    // ============================================
    // 10. FILTRO DE PROJETOS
    // ============================================
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            const parentSection = btn.closest('.section');

            // Atualizar botões ativos
            parentSection.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
            });
            btn.classList.add('active');

            // Filtrar elementos
            if (filter === 'all') {
                projectCards.forEach(card => {
                    card.style.display = '';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = '';
                    }, 10);
                });
            } else {
                projectCards.forEach(card => {
                    const category = card.dataset.category;
                    if (category === filter) {
                        card.style.display = '';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = '';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            }
        });
    });

    // ============================================
    // 11. GALERIA - LIGHTBOX
    // ============================================
   
   
 // Selecionamos as tags IMG dentro da galeria, não as DIVs
const galleryImages = document.querySelectorAll('.gallery-item ');

    3
    
// Só continua se os elementos existem
if (lightbox && fullImage && galleryImages.length > 0) {
    galleryImages.forEach((image, index) => {
        image.addEventListener('click', () => {
            // Mostra o lightbox
            lightbox.style.display = 'flex';
            // Atualiza a imagem grande com base no índice
            fullImage.src = `acaa_img${index + 1}.webp`;
        });
    });

    // Fechar ao clicar no X
    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });
    }

    // Fechar ao clicar na zona escura
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });
}

// ============================================
// LÓGICA VER MAIS/MENOS (SEM CONFLITOS)
// ============================================
const btnToggle = document.getElementById('btnToggleGallery');
const limit = 5;

if (btnToggle) {
    function atualizarGaleria(expandir) {
        // Usamos galleryItems que já está declarada no topo do seu script
        galleryItems.forEach((item, index) => {
            if (!expandir && index >= limit) {
                item.classList.add('d-none-js');
            } else {
                item.classList.remove('d-none-js');
            }
        });
        
        btnToggle.querySelector('span').textContent = expandir ? 'Ver Menos' : 'Ver Mais';
    }

    // Inicia a galeria apenas com 5
    atualizarGaleria(false);

    btnToggle.addEventListener('click', function() {
        const estaExpandido = btnToggle.querySelector('span').textContent === 'Ver Menos';
        atualizarGaleria(!estaExpandido);
        
        if (estaExpandido) {
            document.getElementById('galeria').scrollIntoView({ behavior: 'smooth' });
        }
    });
}


        // ============================================
    // 12. VALIDAÇÃO E ENVIO DO FORMULÁRIO (FORMSPREE)
    // ============================================
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Impede o envio padrão

            // Obter valores
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value.trim();

            // Validações (Sua lógica original)
            let isValid = true;
            const errors = [];

            if (name.length < 3) {
                isValid = false;
                errors.push('Nome deve ter pelo menos 3 caracteres');
            }
            if (!isValidEmail(email)) {
                isValid = false;
                errors.push('Email inválido');
            }
            if (!subject) {
                isValid = false;
                errors.push('Selecione um assunto');
            }
            if (message.length < 10) {
                isValid = false;
                errors.push('Mensagem deve ter pelo menos 10 caracteres');
            }

            if (isValid) {
                // Se estiver tudo ok, tenta enviar para o Formspree
                showNotification('A enviar mensagem...', 'info');
               
                const formData = new FormData(contactForm);

                try {
                    const response = await fetch(contactForm.action, {
                        method: 'POST',
                        body: formData,
                        headers: { 'Accept': 'application/json' }
                    });

                    if (response.ok) {
                        // Sua mensagem de sucesso original
                        showNotification('Mensagem enviada com sucesso!', 'success');
                        contactForm.reset();
                    } else {
                        showNotification('Erro ao enviar. Tente novamente.', 'error');
                    }
                } catch (error) {
                    showNotification('Erro de conexão. Tente novamente.', 'error');
                }
            } else {
                // Mostrar erros de validação originais
                showNotification(errors[0], 'error');
            }
        });
    }

       // ============================================
    // 13. FORMULÁRIO NEWSLETTER (Atualizado com feedback preciso)
    // ============================================
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Impede o recarregamento da página

            const emailInput = newsletterForm.querySelector('input[name="email"]');
            const email = emailInput.value.trim();

            if (isValidEmail(email)) {
                showNotification('A processar subscrição...', 'info');
               
                const formData = new FormData(newsletterForm);

                try {
                    const response = await fetch(newsletterForm.action, {
                        method: 'POST',
                        body: formData,
                        headers: { 'Accept': 'application/json' }
                    });

                    if (response.ok) {
                        // MENSAGEM DE SUCESSO
                        showNotification('Obrigado por se subscrever à nossa newsletter!', 'success');
                        newsletterForm.reset();
                    } else {
                        // MENSAGEM DE ERRO DO SERVIDOR
                        showNotification('Erro ao enviar. Por favor, tente novamente mais tarde.', 'error');
                    }
                } catch (error) {
                    // MENSAGEM DE ERRO DE CONEXÃO
                    showNotification('Erro de conexão. Verifique a sua internet.', 'error');
                }
            } else {
                // MENSAGEM DE EMAIL INVÁLIDO
                showNotification('Por favor, insira um endereço de email válido.', 'error');
            }
        });
    }


    // Função helper para validar email
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // ============================================
    // 14. NOTIFICAÇÕES
    // ============================================
    function showNotification(message, type = 'info') {
        // Remover notificação existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Criar notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Estilos da notificação
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #4CAF50, #2E7D32)' : 'linear-gradient(135deg, #f44336, #d32f2f)'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Fechar ao clicar
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        // Auto-remover após 5 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Adicionar animações de notificação
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // 15. CURSOR PERSONALIZADO
    // ============================================
    if (window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Efeito hover no cursor
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .area-card, .gallery-item, .news-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    }

    // ============================================
    // 16. PARTÍCULAS NO HERO
    // ============================================
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'hero-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = (5 + Math.random() * 10) + 's';

            // Cores aleatórias
            const colors = ['var(--color-gold)', 'var(--color-blue)', 'var(--color-orange)'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];

            particlesContainer.appendChild(particle);
        }
    }
    createParticles();

    // ============================================
    // 17. EFEITO DE PARALAX SUAVE
    // ============================================
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');

        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });

    // ============================================
    // 18. MODO ESCOLAR (REDUZ CONSUMO)
    // ============================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        // Desativar animações se o utilizador preferir
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.classList.add('aos-animate');
        });
    }

    // ============================================
    // 19. LAZY LOADING DE IMAGENS
    // ============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // 20. TOUCH SUPPORT PARA MOBILE
    // ============================================
    // Remover cursor personalizado no touch
    if (!window.matchMedia('(hover: hover)').matches) {
        if (cursor) cursor.style.display = 'none';
    }

    });
// Variável para controlar o nível de zoom inicial
let currentMapZoom = 14;

window.applyMapZoom = function(delta) {
    const iframe = document.getElementById('googleMapIframe');
    if (!iframe) return;

    // Ajusta o nível de zoom entre 1 e 20
    currentMapZoom = Math.min(Math.max(currentMapZoom + delta, 1), 20);

    // Pega a URL atual e substitui o valor do parâmetro 'z'
    const baseUrl = "https://maps.google.com/maps?q=Luanda,Angola&t=&z=";
    const suffix = "&ie=UTF8&iwloc=&output=embed";
   
    iframe.src = baseUrl + currentMapZoom + suffix;

    // Feedback visual usando sua função original
    showNotification(`Zoom ajustado para nível ${currentMapZoom}`, 'info');
};

// ============================================
// FIM DO JAVASCRIPT
// ============================================



