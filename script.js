// ===== VARIABLES GLOBALES =====
const header = document.querySelector('.header');
const navToggle = document.querySelector('.nav__toggle');
const navMenu = document.querySelector('.nav__menu');
const navLinks = document.querySelectorAll('.nav__link');
const sections = document.querySelectorAll('section[id]');
const contactForm = document.querySelector('.form');

// === Cambio de tema claro/oscuro global ===
// Modo claro/oscuro con switch animado
const themeSwitch = document.getElementById('checkbox');
const html = document.documentElement;

// Función para cambiar el tema
themeSwitch.addEventListener('change', function() {
  if (this.checked) {
    html.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    html.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
});

// Al cargar la página, aplicar el tema guardado o el preferido del sistema
(function() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    html.setAttribute('data-theme', 'dark');
    themeSwitch.checked = true;
  } else if (savedTheme === 'light') {
    html.setAttribute('data-theme', 'light');
    themeSwitch.checked = false;
  } else {
    // Si no hay preferencia guardada, usar el del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    themeSwitch.checked = prefersDark;
  }
})();

// ===== NAVEGACIÓN SUAVE =====
function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Cerrar menú móvil si está abierto
        if (navMenu.classList.contains('nav__menu--active')) {
            toggleMobileMenu();
        }
    }
}

// ===== MENÚ MÓVIL =====
function toggleMobileMenu() {
    navMenu.classList.toggle('nav__menu--active');
    navToggle.classList.toggle('nav__toggle--active');
    
    // Animación de las líneas del hamburger
    const spans = navToggle.querySelectorAll('span');
    spans.forEach((span, index) => {
        if (navMenu.classList.contains('nav__menu--active')) {
            if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) span.style.opacity = '0';
            if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            span.style.transform = 'none';
            span.style.opacity = '1';
        }
    });
}

// ===== HEADER SCROLL EFFECT =====
function handleHeaderScroll() {
    if (window.scrollY > 100) {
        header.classList.add('header--scrolled');
    } else {
        header.classList.remove('header--scrolled');
    }
}

// ===== ACTIVE NAV LINK =====
function updateActiveNavLink() {
    const scrollPosition = window.scrollY + header.offsetHeight + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('nav__link--active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('nav__link--active');
                }
            });
        }
    });
}

// ===== ANIMACIONES AL SCROLL =====
function animateOnScroll() {
    const elements = document.querySelectorAll('.skill-category, .project-card, .timeline__item, .stat');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in-up');
        }
    });
}

// ===== FORMULARIO DE CONTACTO =====
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Validación básica
    if (!name || !email || !message) {
        showNotification('Por favor, completa todos los campos', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Por favor, ingresa un email válido', 'error');
        return;
    }
    
    // Simular envío (aquí puedes integrar con tu backend)
    showNotification('Enviando mensaje...', 'info');
    
    setTimeout(() => {
        showNotification('¡Mensaje enviado con éxito! Te responderé pronto.', 'success');
        contactForm.reset();
    }, 2000);
}

// ===== VALIDACIÓN DE EMAIL =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== NOTIFICACIONES =====
function showNotification(message, type = 'info') {
    // Remover notificaciones existentes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Crear nueva notificación
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <span class="notification__message">${message}</span>
            <button class="notification__close">&times;</button>
        </div>
    `;
    
    // Agregar estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Botón de cerrar
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
}

// ===== TYPING ANIMATION =====
function initTypingAnimation() {
    const codeLines = document.querySelectorAll('.code-line');
    let currentLine = 0;
    
    function typeLine() {
        if (currentLine < codeLines.length) {
            const line = codeLines[currentLine];
            const text = line.textContent;
            line.textContent = '';
            line.style.opacity = '1';
            
            let charIndex = 0;
            const typeChar = () => {
                if (charIndex < text.length) {
                    line.textContent += text[charIndex];
                    charIndex++;
                    setTimeout(typeChar, 50);
                } else {
                    currentLine++;
                    setTimeout(typeLine, 500);
                }
            };
            
            typeChar();
        }
    }
    
    // Iniciar animación cuando la sección sea visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeLine();
                observer.unobserve(entry.target);
            }
        });
    });
    
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        observer.observe(heroSection);
    }
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat__number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    });
}

// ===== LAZY LOADING =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== PROFILE PHOTO HANDLER =====
function initProfilePhoto() {
    const profileImage = document.querySelector('.about__image');
    const placeholder = document.querySelector('.about__photo-placeholder');
    
    if (profileImage && placeholder) {
        // Verificar si la imagen se carga correctamente
        profileImage.addEventListener('load', function() {
            placeholder.style.display = 'none';
            this.style.display = 'block';
        });
        
        profileImage.addEventListener('error', function() {
            this.style.display = 'none';
            placeholder.style.display = 'flex';
        });
        
        // Verificar si la imagen ya está cargada
        if (profileImage.complete && profileImage.naturalHeight !== 0) {
            placeholder.style.display = 'none';
        } else {
            profileImage.style.display = 'none';
            placeholder.style.display = 'flex';
        }
    }
}

// ===== SCROLL TO TOP =====
function createScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Mostrar/ocultar botón
    function toggleScrollToTop() {
        if (window.scrollY > 500) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    }
    
    // Scroll to top
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    return toggleScrollToTop;
}

// ===== PERFORMANCE OPTIMIZATION =====
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

// ===== MODAL DE PROYECTOS =====
const projectData = {
    'nfc-retail': {
        title: 'Sistema NFC para control de inventario en retail',
        img: 'images/mockup-nfc-retail.jpg',
        desc: 'App móvil con React Native para registrar movimientos de mercadería usando NFC. Backend Node.js + Google Sheets. Permite escanear productos, registrar entradas y salidas, y visualizar reportes en tiempo real.',
        techs: [
            { name: 'React Native', icon: 'fab fa-react' },
            { name: 'Node.js', icon: 'fab fa-node-js' },
            { name: 'Google Sheets', icon: 'fas fa-table' },
            { name: 'NFC', icon: 'fas fa-wifi' }
        ],
        links: [
            { url: '#', label: 'Ver demo', icon: 'fas fa-external-link-alt' },
            { url: '#', label: 'Código', icon: 'fab fa-github' }
        ]
    },
    'form-invitaciones': {
        title: 'Formulario de invitaciones con código JS + backend',
        img: 'images/mockup-form-invitaciones.jpg',
        desc: 'Web app para confirmación de asistencia a eventos, validación de códigos únicos, backend Node.js, datos en Google Sheets y mensajes personalizados para cada invitado.',
        techs: [
            { name: 'JavaScript', icon: 'fab fa-js' },
            { name: 'Node.js', icon: 'fab fa-node-js' },
            { name: 'Google Sheets', icon: 'fas fa-table' }
        ],
        links: [
            { url: '#', label: 'Ver demo', icon: 'fas fa-external-link-alt' },
            { url: '#', label: 'Código', icon: 'fab fa-github' }
        ]
    },
    'mecapp': {
        title: 'MecApp: plataforma de gestión automotriz',
        img: 'images/mockup-mecapp.jpg',
        desc: 'App Flutter + Supabase para gestión de compra/venta de vehículos. Login multiusuario, inventario por patente y RUT, reportes y panel administrativo.',
        techs: [
            { name: 'Flutter', icon: 'fas fa-mobile-alt' },
            { name: 'Supabase', icon: 'fas fa-database' },
            { name: 'SQL', icon: 'fas fa-database' }
        ],
        links: [
            { url: '#', label: 'Ver demo', icon: 'fas fa-external-link-alt' },
            { url: '#', label: 'Código', icon: 'fab fa-github' }
        ]
    },
    'dashboard-metricas': {
        title: 'Dashboard de métricas (proyecto personal)',
        img: 'images/mockup-dashboard.jpg',
        desc: 'Web app en React con gráficos dinámicos, consumo de APIs REST, diseño responsivo y visualización de métricas clave para proyectos personales o empresariales.',
        techs: [
            { name: 'React', icon: 'fab fa-react' },
            { name: 'APIs REST', icon: 'fas fa-plug' },
            { name: 'Chart.js', icon: 'fas fa-chart-bar' }
        ],
        links: [
            { url: '#', label: 'Ver demo', icon: 'fas fa-external-link-alt' },
            { url: '#', label: 'Código', icon: 'fab fa-github' }
        ]
    }
};

function openProjectModal(projectKey) {
    const modal = document.getElementById('project-modal');
    const body = modal.querySelector('.project-modal__body');
    const data = projectData[projectKey];
    if (!data) return;

    // Construir HTML del modal
    body.innerHTML = `
        <img src="${data.img}" alt="${data.title}" class="project-modal__img" onerror="this.style.display='none'">
        <div class="project-modal__title">${data.title}</div>
        <div class="project-modal__desc">${data.desc}</div>
        <div class="project-modal__techs">
            ${data.techs.map(t => `<span class="project-modal__tech"><i class="${t.icon}"></i> ${t.name}</span>`).join('')}
        </div>
        <div class="project-modal__links">
            ${data.links.map(l => `<a href="${l.url}" class="project-modal__link" target="_blank"><i class="${l.icon}"></i> ${l.label}</a>`).join('')}
        </div>
    `;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Accesibilidad: focus en el modal
    setTimeout(() => {
        modal.querySelector('.project-modal__content').focus();
    }, 100);
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function initProjectModal() {
    // Abrir modal
    document.querySelectorAll('.project-demo-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const projectKey = this.getAttribute('data-project');
            openProjectModal(projectKey);
        });
    });
    // Cerrar modal
    document.getElementById('project-modal').addEventListener('click', function(e) {
        if (e.target.classList.contains('project-modal__overlay') || e.target.classList.contains('project-modal__close')) {
            closeProjectModal();
        }
    });
    // Cerrar con Esc
    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('project-modal');
        if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
            closeProjectModal();
        }
    });
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {
    // Navegación suave
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    // Menú móvil
    navToggle.addEventListener('click', toggleMobileMenu);
    
    // Header scroll effect
    window.addEventListener('scroll', debounce(handleHeaderScroll, 10));
    
    // Active nav link
    window.addEventListener('scroll', debounce(updateActiveNavLink, 10));
    
    // Animaciones al scroll
    window.addEventListener('scroll', debounce(animateOnScroll, 10));
    
    // Formulario de contacto
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Inicializar animaciones
    initTypingAnimation();
    
    // Scroll to top
    const toggleScrollToTop = createScrollToTop();
    window.addEventListener('scroll', debounce(toggleScrollToTop, 10));
    
    // Lazy loading
    initLazyLoading();
    
    // Inicializar foto de perfil
    initProfilePhoto();
    
    // Animar contadores cuando la sección sea visible
    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(aboutSection);
    }
    
    // Prevenir envío de formulario con Enter
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    });

    // Inicializar modal de proyectos
    initProjectModal();
    
    // Inicializar carrusel de habilidades
    initSkillsCarousel();
    
    // Inicializar paleta de colores
    initColorPalette();
});

// ===== CARRUSEL SIMPLE DE HABILIDADES =====
function initSkillsCarousel() {
    const carouselTrack = document.querySelector('.skills-carousel-track');
    const carousel = document.querySelector('.skills-carousel');
    const prevBtn = document.querySelector('.skills-nav-btn--prev');
    const nextBtn = document.querySelector('.skills-nav-btn--next');
    
    if (!carouselTrack || !carousel || !prevBtn || !nextBtn) return;
    
    let currentIndex = 0;
    const cards = carouselTrack.querySelectorAll('.skill-card');
    const totalCards = cards.length;
    const cardsPerView = 3; // Mostrar 3 tarjetas a la vez
    const maxIndex = Math.max(0, totalCards - cardsPerView);
    
    // Variables para el deslizamiento táctil
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let currentIndexTouch = 0;
    
    function updateNavigation() {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;
        
        // Actualizar estilos visuales
        if (prevBtn.disabled) {
            prevBtn.style.opacity = '0.5';
            prevBtn.style.cursor = 'not-allowed';
        } else {
            prevBtn.style.opacity = '1';
            prevBtn.style.cursor = 'pointer';
        }
        
        if (nextBtn.disabled) {
            nextBtn.style.opacity = '0.5';
            nextBtn.style.cursor = 'not-allowed';
        } else {
            nextBtn.style.opacity = '1';
            nextBtn.style.cursor = 'pointer';
        }
    }
    
    function slideToIndex(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        
        // Calcular el desplazamiento
        const cardWidth = cards[0].offsetWidth + 32; // Ancho de la tarjeta + gap
        const translateX = -currentIndex * cardWidth;
        
        carouselTrack.style.transform = `translateX(${translateX}px)`;
        currentTranslate = translateX;
        prevTranslate = translateX;
        updateNavigation();
    }
    
    // Event listeners para los botones
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            slideToIndex(currentIndex - 1);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            slideToIndex(currentIndex + 1);
        }
    });
    
    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
            e.preventDefault();
            slideToIndex(currentIndex - 1);
        } else if (e.key === 'ArrowRight' && !nextBtn.disabled) {
            e.preventDefault();
            slideToIndex(currentIndex + 1);
        }
    });
    
    // Efectos hover en los botones
    prevBtn.addEventListener('mouseenter', () => {
        if (!prevBtn.disabled) {
            prevBtn.style.background = 'var(--primary)';
            prevBtn.style.color = '#fff';
            prevBtn.style.transform = 'translateY(-50%) scale(1.1)';
        }
    });
    
    prevBtn.addEventListener('mouseleave', () => {
        if (!prevBtn.disabled) {
            prevBtn.style.background = 'var(--card-bg)';
            prevBtn.style.color = 'var(--text)';
            prevBtn.style.transform = 'translateY(-50%) scale(1)';
        }
    });
    
    nextBtn.addEventListener('mouseenter', () => {
        if (!nextBtn.disabled) {
            nextBtn.style.background = 'var(--primary)';
            nextBtn.style.color = '#fff';
            nextBtn.style.transform = 'translateY(-50%) scale(1.1)';
        }
    });
    
    nextBtn.addEventListener('mouseleave', () => {
        if (!nextBtn.disabled) {
            nextBtn.style.background = 'var(--card-bg)';
            nextBtn.style.color = 'var(--text)';
            nextBtn.style.transform = 'translateY(-50%) scale(1)';
        }
    });
    
    // Inicializar estado
    updateNavigation();
    
    // Actualizar navegación cuando cambie el tamaño de la ventana
    window.addEventListener('resize', debounce(() => {
        slideToIndex(currentIndex); // Recalcular posición
        updateNavigation();
    }, 250));
    
    // ===== FUNCIONALIDAD DE DESLIZAMIENTO TÁCTIL =====
    
    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }
    
    function setSliderPosition(position) {
        carouselTrack.style.transform = `translateX(${position}px)`;
    }
    
    function animation(currentTime) {
        setSliderPosition(currentTranslate);
        if (isDragging) requestAnimationFrame(animation);
    }
    
    function dragStart(event) {
        if (event.type === 'touchstart') {
            startPos = getPositionX(event);
        } else {
            startPos = getPositionX(event);
        }
        isDragging = true;
        animationID = requestAnimationFrame(animation);
        carousel.style.cursor = 'grabbing';
    }
    
    function drag(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + currentPosition - startPos;
        }
    }
    
    function dragEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        carousel.style.cursor = 'grab';
        
        const movedBy = currentTranslate - prevTranslate;
        
        // Determinar si el movimiento es suficiente para cambiar de tarjeta
        const cardWidth = cards[0].offsetWidth + 32; // Ancho de la tarjeta + gap
        const threshold = cardWidth * 0.3; // 30% del ancho de la tarjeta
        
        if (Math.abs(movedBy) > threshold) {
            if (movedBy < 0 && currentIndex < maxIndex) {
                // Deslizar hacia la izquierda (siguiente)
                slideToIndex(currentIndex + 1);
            } else if (movedBy > 0 && currentIndex > 0) {
                // Deslizar hacia la derecha (anterior)
                slideToIndex(currentIndex - 1);
            } else {
                // Volver a la posición actual
                slideToIndex(currentIndex);
            }
        } else {
            // Volver a la posición actual si el movimiento no es suficiente
            slideToIndex(currentIndex);
        }
    }
    
    // Event listeners para deslizamiento táctil
    carousel.addEventListener('touchstart', dragStart, { passive: false });
    carousel.addEventListener('touchend', dragEnd, { passive: false });
    carousel.addEventListener('touchmove', drag, { passive: false });
    
    // Event listeners para deslizamiento con mouse (para desktop con touch)
    carousel.addEventListener('mousedown', dragStart);
    carousel.addEventListener('mouseup', dragEnd);
    carousel.addEventListener('mouseleave', dragEnd);
    carousel.addEventListener('mousemove', drag);
    
    // Prevenir comportamiento por defecto para evitar selección de texto
    carousel.addEventListener('dragstart', (e) => e.preventDefault());
    
    // Los indicadores se mantienen visibles permanentemente
    // No se ocultan al interactuar con el carrusel
}

// ===== UTILIDADES ADICIONALES =====

// Función para copiar email al portapapeles
function copyEmail() {
    const email = 'vielmamiguel.dev@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
        showNotification('Email copiado al portapapeles', 'success');
    }).catch(() => {
        showNotification('No se pudo copiar el email', 'error');
    });
}

// Función para descargar CV (cuando tengas uno)
function downloadCV() {
    // Aquí puedes agregar la lógica para descargar tu CV
    showNotification('Función de descarga en desarrollo', 'info');
}

// ===== CSS ADICIONAL PARA ANIMACIONES =====
const additionalStyles = `
    .nav__menu--active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(10px);
        padding: 1rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .nav__link--active {
        color: var(--primary-color) !important;
        font-weight: 600;
    }
    
    .header--scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }
    
    .scroll-to-top:hover {
        background: var(--primary-dark);
        transform: translateY(-2px);
    }
    
    .notification__content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification__close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification__close:hover {
        opacity: 0.8;
    }
    
    @media (max-width: 768px) {
        .nav__menu {
            display: none;
        }
        
        .nav__menu--active {
            display: flex !important;
        }
    }
`;

// Agregar estilos adicionales al head
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// ===== PALETA DE COLORES INTERACTIVA =====
function initColorPalette() {
    const colorItems = document.querySelectorAll('.item-color');
    
    // Configurar el color "Confianza" (verde) como activo por defecto
    const confianzaColor = document.querySelector('[aria-label="Confianza"]');
    if (confianzaColor) {
        confianzaColor.style.transform = 'scale(1.3) rotateY(0deg)';
        confianzaColor.style.zIndex = '10';
    }
    
    // Event listeners para cada color
    colorItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            // Ocultar el tooltip de "Confianza" cuando se hace hover en otros colores
            if (confianzaColor && item.getAttribute('aria-label') !== 'Confianza') {
                confianzaColor.style.setProperty('--tooltip-opacity', '0');
                confianzaColor.style.setProperty('--tooltip-visibility', 'hidden');
            }
            
            // Resetear todos los elementos
            colorItems.forEach(otherItem => {
                otherItem.style.transform = 'scale(1) rotateY(0deg)';
                otherItem.style.zIndex = '1';
            });
            
            // Activar el elemento actual
            item.style.transform = 'scale(1.3) rotateY(0deg)';
            item.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', () => {
            // Al salir del hover, volver al color "Confianza"
            const confianzaItem = document.querySelector('[aria-label="Confianza"]');
            if (confianzaItem) {
                // Mostrar el tooltip de "Confianza" nuevamente
                confianzaItem.style.setProperty('--tooltip-opacity', '1');
                confianzaItem.style.setProperty('--tooltip-visibility', 'visible');
                
                colorItems.forEach(otherItem => {
                    otherItem.style.transform = 'scale(1) rotateY(0deg)';
                    otherItem.style.zIndex = '1';
                });
                
                confianzaItem.style.transform = 'scale(1.3) rotateY(0deg)';
                confianzaItem.style.zIndex = '10';
            }
        });
    });
}

// ===== CONSOLE LOG PERSONALIZADO =====
console.log(`
%c🚀 Miguel Vielma - Desarrollador Full Stack
%c
%c¡Hola! Gracias por revisar mi portafolio.
%cSi te interesa colaborar en algún proyecto, no dudes en contactarme.
%c
%c📧 Email: vielmamiguel.dev@gmail.com
%c🔗 LinkedIn: linkedin.com/in/miguelvielma
%c🐙 GitHub: github.com/M-vielma
`,
'color: #2563eb; font-size: 18px; font-weight: bold;',
'',
'color: #64748b; font-size: 14px;',
'color: #64748b; font-size: 14px;',
'',
'color: #10b981; font-size: 12px;',
'color: #10b981; font-size: 12px;',
'color: #10b981; font-size: 12px;'
);


