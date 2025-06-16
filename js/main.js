// ===== VARIABLES GLOBALES =====
let carousels = {};
let currentIndexes = {};
let autoplayIntervals = {};
let isLoading = false;

// ===== CONFIGURACIÓN =====
const CONFIG = {
    carousel: {
        autoplayInterval: 4500, // 4.5 segundos
        transitionDuration: 500,
        pauseOnHover: true
    },
    files: {
        imageExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'],
        videoExtensions: ['.mp4', '.webm', '.ogg', '.mov', '.avi'],
        newsExtension: '.txt'
    },
    folders: {
        images: 'images/',
        videos: 'videos/',
        culture: 'cultura/',
        sportInter: 'deporte/interprovinciales/',
        sportIntra: 'deporte/interfacultades/',
        news: 'noticias/'
    }
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando FUL USFX...');
    
    // Inicializar componentes
    initializeNavigation();
    loadAllContent();
    initializeCopyButtons();
    initializeMobileMenu();
    
    console.log('✅ FUL USFX inicializado correctamente');
});

// ===== NAVEGACIÓN =====
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            
            // Actualizar enlaces activos
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar sección correspondiente
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                    section.style.display = 'block';
                    
                    // Animar entrada
                    setTimeout(() => {
                        section.classList.add('animate-fade-in');
                    }, 50);
                } else {
                    section.style.display = 'none';
                    section.classList.remove('animate-fade-in');
                }
            });
            
            // Cerrar menú móvil si está abierto
            const nav = document.getElementById('mainNav');
            nav.classList.remove('mobile-open');
        });
    });
}

// ===== MENÚ MÓVIL =====
function initializeMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.getElementById('mainNav');
    
    if (toggle && nav) {
        toggle.addEventListener('click', function() {
            nav.classList.toggle('mobile-open');
            
            // Animar hamburguesa
            const spans = this.querySelectorAll('span');
            spans.forEach((span, index) => {
                span.style.transform = nav.classList.contains('mobile-open') 
                    ? `rotate(${index === 1 ? 45 : index === 0 ? 45 : -45}deg)` 
                    : 'rotate(0deg)';
            });
        });
    }
}

// ===== CARGA DE CONTENIDO =====
async function loadAllContent() {
    showLoading();
    
    try {
        // Cargar contenido en paralelo
        await Promise.all([
            loadMainCarousel(),
            loadCultureCarousel(), 
            loadSportsCarousels(),
            loadNews()
        ]);
        
        console.log('✅ Todo el contenido cargado exitosamente');
    } catch (error) {
        console.error('❌ Error cargando contenido:', error);
        showError('Error al cargar el contenido. Usando contenido de ejemplo.');
        loadFallbackContent();
    } finally {
        hideLoading();
    }
}

function showLoading() {
    isLoading = true;
    const loadingElements = document.querySelectorAll('.carousel-track, .noticias-grid');
    loadingElements.forEach(el => {
        el.innerHTML = '<div class="loading">🔄 Cargando contenido...</div>';
    });
}

function hideLoading() {
    isLoading = false;
}

function showError(message) {
    console.warn('⚠️ ' + message);
}

// ===== CARRUSEL PRINCIPAL =====
async function loadMainCarousel() {
    const carouselTrack = document.getElementById('carouselTrack');
    const indicators = document.getElementById('carouselIndicators');
    
    if (!carouselTrack) return;
    
    try {
        // Obtener archivos de las carpetas
        const mediaFiles = await getMediaFiles([
            CONFIG.folders.images,
            CONFIG.folders.videos
        ]);
        
        if (mediaFiles.length === 0) {
            loadMainCarouselFallback();
            return;
        }
        
        // Crear elementos del carrusel
        carouselTrack.innerHTML = '';
        indicators.innerHTML = '';
        
        mediaFiles.forEach((file, index) => {
            createCarouselItem(carouselTrack, file, index, 'main');
            createIndicator(indicators, index, 'main');
        });
        
        // Inicializar carrusel
        initializeCarousel('main', mediaFiles.length);
        
    } catch (error) {
        console.error('Error cargando carrusel principal:', error);
        loadMainCarouselFallback();
    }
}

function loadMainCarouselFallback() {
    const carouselTrack = document.getElementById('carouselTrack');
    const indicators = document.getElementById('carouselIndicators');
    
    const fallbackItems = [
        { type: 'image', src: 'https://via.placeholder.com/1200x400/dc2626/ffffff?text=FUL+USFX', title: 'Bienvenidos a FUL USFX' },
        { type: 'image', src: 'https://via.placeholder.com/1200x400/1e40af/ffffff?text=Universidad+San+Francisco+Xavier', title: 'Universidad San Francisco Xavier' },
        { type: 'image', src: 'https://via.placeholder.com/1200x400/dc2626/ffffff?text=Federación+Universitaria', title: 'Federación Universitaria Local' }
    ];
    
    carouselTrack.innerHTML = '';
    indicators.innerHTML = '';
    
    fallbackItems.forEach((item, index) => {
        createCarouselItem(carouselTrack, item, index, 'main');
        createIndicator(indicators, index, 'main');
    });
    
    initializeCarousel('main', fallbackItems.length);
}

// ===== CARRUSEL DE CULTURA =====
async function loadCultureCarousel() {
    const carousel = document.getElementById('culturaCarousel');
    if (!carousel) return;
    
    try {
        // Lista manual de tus imágenes locales
        const localCultureImages = [
            {
                type: 'image',
                src: 'cultura/images/c1.jpg',
                title: 'Entrada Universitaria 2025'
            },
            {
                type: 'image',
                src: 'cultura/images/c2.jpg',
            },            
			{
                type: 'image',
                src: 'cultura/images/c3.jpg',
            },            {
                type: 'image',
                src: 'cultura/images/c4.jpg',
            },
			{
                type: 'image',
                src: 'cultura/images/c5.jpg',
            },            {
                type: 'image',
                src: 'cultura/images/c6.jpg',
            },
            // Añade más imágenes según necesites
            {
                type: 'image',
                src: 'cultura/images/c7.jpg',
                //title: 'Evento Cultural'
            }
        ];
        
        // Limpiar y cargar imágenes
        carousel.innerHTML = '';
        localCultureImages.forEach((file, index) => {
            createCarouselItem(carousel, file, index, 'culture');
        });
        
        initializeCarousel('culture', localCultureImages.length);
        
    } catch (error) {
        console.error('Error cargando carrusel de cultura:', error);
        loadCultureCarouselFallback(carousel);
    }
}

function loadCultureCarouselFallback(carousel) {
    const fallbackItems = [
        { type: 'image', src: 'https://via.placeholder.com/400x250/dc2626/ffffff?text=Entrada+Universitaria', title: 'Entrada Universitaria' },
        { type: 'image', src: 'https://via.placeholder.com/400x250/1e40af/ffffff?text=Danzas+Tradicionales', title: 'Danzas Tradicionales' },
        { type: 'image', src: 'https://via.placeholder.com/400x250/dc2626/ffffff?text=Cultura+USFX', title: 'Cultura USFX' }
    ];
    
    carousel.innerHTML = '';
    fallbackItems.forEach((item, index) => {
        createCarouselItem(carousel, item, index, 'culture');
    });
    
    initializeCarousel('culture', fallbackItems.length);
}

// ===== CARRUSELES DE DEPORTES =====
async function loadSportsCarousels() {
    await Promise.all([
        loadSportsCarousel('interprovinciales', 'interprovincialesCarousel'),
        loadSportsCarousel('interfacultades', 'interfacultadesCarousel')
    ]);
}

async function loadSportsCarousel(type, carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    try {
        // Lista manual de imágenes locales según el tipo
        const sportsFiles = type === 'interprovinciales' 
            ? [
                {
                    type: 'image',
                    src: 'deporte/interprovincial/p1.jpg',
                    
                },
                {
                    type: 'image',
                    src: 'deporte/interprovincial/p2.jpg',
                    
                }
                // Añade más imágenes aquí
              ]
            : [
                {
                    type: 'image',
                    src: 'deporte/interfacultad/f1.jpg',
                    
                },
                {
                    type: 'image',
                    src: 'deporte/interfacultad/f2.jpg',
                    
                }
                // Añade más imágenes aquí
              ];
        
        carousel.innerHTML = '';
        sportsFiles.forEach((file, index) => {
            createCarouselItem(carousel, file, index, type);
        });
        
        initializeCarousel(type, sportsFiles.length);
        
    } catch (error) {
        console.error(`Error cargando carrusel de ${type}:`, error);
        loadSportsCarouselFallback(carousel, type);
    }
}

function loadSportsCarouselFallback(carousel, type) {
    const title = type === 'interprovinciales' ? 'Juegos+Interprovinciales' : 'Juegos+Interfacultades';
    
    const fallbackItems = [
        { type: 'image', src: `https://via.placeholder.com/400x250/dc2626/ffffff?text=${title}`, title: title.replace('+', ' ') },
        { type: 'image', src: `https://via.placeholder.com/400x250/1e40af/ffffff?text=Deportes+USFX`, title: 'Deportes USFX' },
        { type: 'image', src: `https://via.placeholder.com/400x250/dc2626/ffffff?text=Competencias`, title: 'Competencias' }
    ];
    
    carousel.innerHTML = '';
    fallbackItems.forEach((item, index) => {
        createCarouselItem(carousel, item, index, type);
    });
    
    initializeCarousel(type, fallbackItems.length);
}

// ===== CARGA DE NOTICIAS =====
async function loadNews() {
    const noticiasGrid = document.getElementById('noticiasGrid');
    if (!noticiasGrid) return;
    
    try {
        const newsFiles = await getNewsFiles();
        
        if (newsFiles.length === 0) {
            loadNewsFallback();
            return;
        }
        
        noticiasGrid.innerHTML = '';
        
        for (const newsFile of newsFiles) {
            await createNewsCard(noticiasGrid, newsFile);
        }
        
    } catch (error) {
        console.error('Error cargando noticias:', error);
        loadNewsFallback();
    }
}

function loadNewsFallback() {
    const noticiasGrid = document.getElementById('noticiasGrid');
    if (!noticiasGrid) return;
	
	
    //noticias__________________________________________________noticias_________________________________ noticias_________________________-----------------------------------
	
    const fallbackNews = [
        {
            title: 'ENTRADA UNIVERSITARIA USFX 2025',
            content: 'La Entrada Universitaria de la USFX es más que una fiesta: es una muestra de identidad cultural, unidad estudiantil y orgullo por nuestra universidad. Reúne a todas las carreras en un evento que celebra nuestras tradiciones con danza, música y arte. Participar en ella fortalece el sentido de pertenencia y promueve el vínculo entre la comunidad universitaria y la sociedad.',
            date: '2025-06-14',
            image: 'noticias/i1.jpg' // Imagen local
        },
        {
            title: 'ELECCION ÑUSTA USFX',
            content: 'La elección de la Ñusta Universitaria es un acto cultural que valora la identidad indígena y el rol de la mujer en la tradición boliviana. No se basa en la apariencia física, sino en el conocimiento cultural, liderazgo y compromiso social. Representa la defensa de nuestras raíces, el empoderamiento femenino y el fortalecimiento de la diversidad dentro de la universidad.',
            date: '2025-06-13',
            image: 'noticias/i2.png'
        },
        {
            title: 'Juegos Deportivos',
            content: 'La Universidad San Francisco Xavier de Chuquisaca (USFX) hizo historia una vez más al coronarse bicampeona del medallero general en los Juegos Deportivos Nacionales Universitarios, una de las competencias más importantes del Sistema Universitario Boliviano, celebrada este año en la ciudad de Sucre el 22 de noviembre.',
            date: '2024-11-',
            image: 'noticias/i3.jpg'
        }
    ];
    
    noticiasGrid.innerHTML = '';
    fallbackNews.forEach(news => {
        createNewsCardFromData(noticiasGrid, news);
    });
}

// ===== FUNCIONES DE CARRUSEL =====
function createCarouselItem(container, file, index, carouselType) {
    const item = document.createElement('div');
    item.className = 'carousel-item';
    
    if (file.type === 'video') {
        const video = document.createElement('video');
        video.src = file.src;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;
        video.muted = false; // Intentar con sonido
        
        // Intentar reproducir con sonido (puede fallar por políticas del navegador)
        video.play().catch(error => {
            console.log("Autoplay con sonido bloqueado, mutando video:", error);
            video.muted = true;
            video.play();
            
            // Mostrar botón para activar sonido
            const unmuteBtn = document.createElement('button');
            unmuteBtn.className = 'unmute-btn';
            unmuteBtn.innerHTML = '🔇 Activar sonido';
            unmuteBtn.onclick = () => {
                video.muted = false;
                unmuteBtn.remove();
                video.play().catch(e => console.log("No se pudo reactivar sonido:", e));
            };
            item.appendChild(unmuteBtn);
        });
        
        // Control de reproducción al hacer clic
        video.addEventListener('click', function() {
            if (this.paused) {
                this.play();
            } else {
                this.pause();
            }
        });
        
        item.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.src = file.src;
        img.alt = file.title || `Imagen ${index + 1}`;
        item.appendChild(img);
    }
    
    if (file.title) {
        const overlay = document.createElement('div');
        overlay.className = 'carousel-overlay';
        overlay.innerHTML = `<h3>${file.title}</h3>`;
        item.appendChild(overlay);
    }
    
    container.appendChild(item);
}

function createIndicator(container, index, carouselType) {
    const indicator = document.createElement('button');
    indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
    indicator.setAttribute('data-index', index);
    indicator.addEventListener('click', () => goToSlide(carouselType, index));
    container.appendChild(indicator);
}

function initializeCarousel(carouselType, totalItems) {
    if (totalItems === 0) return;
    
    currentIndexes[carouselType] = 0;
    
    // Configurar controles si existen
    setupCarouselControls(carouselType);
    
    // Iniciar autoplay
    startAutoplay(carouselType, totalItems);
    
    // Pausar en hover
    setupHoverPause(carouselType);
}

function setupCarouselControls(carouselType) {
    if (carouselType === 'main') {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => previousSlide('main'));
            nextBtn.addEventListener('click', () => nextSlide('main'));
        }
    }
}

function setupHoverPause(carouselType) {
    let container;
    
    if (carouselType === 'main') {
        container = document.querySelector('.carousel-container');
    } else {
        container = document.getElementById(`${carouselType}Carousel`);
    }
    
    if (container && CONFIG.carousel.pauseOnHover) {
        container.addEventListener('mouseenter', () => pauseAutoplay(carouselType));
        container.addEventListener('mouseleave', () => resumeAutoplay(carouselType));
    }
}

function startAutoplay(carouselType, totalItems) {
    if (autoplayIntervals[carouselType]) {
        clearInterval(autoplayIntervals[carouselType]);
    }
    
    autoplayIntervals[carouselType] = setInterval(() => {
        nextSlide(carouselType, totalItems);
    }, CONFIG.carousel.autoplayInterval);
}

function pauseAutoplay(carouselType) {
    if (autoplayIntervals[carouselType]) {
        clearInterval(autoplayIntervals[carouselType]);
    }
}

function resumeAutoplay(carouselType) {
    const container = getCarouselContainer(carouselType);
    if (container) {
        const totalItems = container.children.length;
        startAutoplay(carouselType, totalItems);
    }
}

function nextSlide(carouselType, totalItems) {
    if (!totalItems) {
        const container = getCarouselContainer(carouselType);
        totalItems = container ? container.children.length : 0;
    }
    
    if (totalItems === 0) return;
    
    currentIndexes[carouselType] = (currentIndexes[carouselType] + 1) % totalItems;
    updateCarousel(carouselType);
}

function previousSlide(carouselType) {
    const container = getCarouselContainer(carouselType);
    const totalItems = container ? container.children.length : 0;
    
    if (totalItems === 0) return;
    
    currentIndexes[carouselType] = (currentIndexes[carouselType] - 1 + totalItems) % totalItems;
    updateCarousel(carouselType);
}

function goToSlide(carouselType, index) {
    currentIndexes[carouselType] = index;
    updateCarousel(carouselType);
}

function updateCarousel(carouselType) {
    const container = getCarouselContainer(carouselType);
    if (!container) return;
    
    const index = currentIndexes[carouselType];
    const translateX = -index * 100;
    
    container.style.transform = `translateX(${translateX}%)`;
    
    // Actualizar indicadores si existen
    updateIndicators(carouselType, index);
}

function updateIndicators(carouselType, activeIndex) {
    const indicators = document.querySelectorAll(`#carouselIndicators .carousel-indicator`);
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === activeIndex);
    });
}

function getCarouselContainer(carouselType) {
    switch (carouselType) {
        case 'main':
            return document.getElementById('carouselTrack');
        case 'culture':
            return document.getElementById('culturaCarousel');
        case 'interprovinciales':
            return document.getElementById('interprovincialesCarousel');
        case 'interfacultades':
            return document.getElementById('interfacultadesCarousel');
        default:
            return null;
    }
}

// ===== FUNCIONES DE ARCHIVOS =====
async function getMediaFiles(folders) {
    const allFiles = [];
    
    for (const folder of folders) {
        try {
            const files = await fetchFolderContents(folder);
            allFiles.push(...files);
        } catch (error) {
            console.warn(`No se pudo acceder a la carpeta: ${folder}`);
        }
    }
    
    return allFiles;
}

async function getNewsFiles() {
    try {
        return await fetchFolderContents(CONFIG.folders.news, CONFIG.files.newsExtension);
    } catch (error) {
        console.warn('No se pudo acceder a la carpeta de noticias');
        return [];
    }
}

async function fetchFolderContents(folder, extension = null) {
    // IMÁGENES LOCALES - Modificado para tu caso
    const localImages = {
        'images/': [
            { type: 'image', src: 'images/foto1.jpg' },
            { type: 'image', src: 'images/foto2.jpg' },
            { type: 'image', src: 'images/foto3.jpg' },
            { type: 'image', src: 'images/foto4.jpg' },
			{ type: 'video', src: 'images/video1.mp4' },
            { type: 'image', src: 'images/foto5.jpg' }
            // Añade más imágenes manualmente aquí...
        ],
        'cultura/images/': [
            { type: 'image', src: 'cultura/imagen1.jpg', title: 'Cultura 1' },
            { type: 'image', src: 'cultura/imagen2.png', title: 'Cultura 2' }
        ],
        'deporte/interprovinciales/images/': [
            { type: 'image', src: 'deporte/interprovinciales/deporte1.jpg', title: 'Interprovinciales' }
        ],
        'deporte/interfacultades/images/': [
            { type: 'image', src: 'deporte/interfacultades/deporte2.jpg', title: 'Interfacultades' }
        ]
    };

    // Si la carpeta existe en nuestro objeto, devuelve esas imágenes
    if (localImages[folder]) {
        return localImages[folder];
    }

    // Si no hay imágenes locales, usa placeholders (como estaba antes)
    const mockFiles = [];

    
    return mockFiles;
}

// ===== FUNCIONES DE NOTICIAS =====
async function createNewsCard(container, newsFile) {
    try {
        const newsData = await fetchNewsContent(newsFile);
        createNewsCardFromData(container, newsData);
    } catch (error) {
        console.warn(`Error cargando noticia: ${newsFile.filename}`);
    }
}

async function fetchNewsContent(newsFile) {
    // Simular la carga de contenido de archivo .txt
    // En un entorno real, esto haría fetch del archivo
    const mockNews = {
        title: `Noticia ${newsFile.filename.replace('.txt', '').replace('noticia-', '')}`,
        content: 'Esta es una noticia de ejemplo generada automáticamente. En un entorno real, este contenido se cargaría desde el archivo de texto correspondiente.',
        date: new Date().toISOString().split('T')[0],
        image: `https://via.placeholder.com/350x200/dc2626/ffffff?text=Noticia+${newsFile.filename.replace('.txt', '')}`
    };
    
    return mockNews;
}

function createNewsCardFromData(container, newsData) {
    const card = document.createElement('div');
    card.className = 'noticia-card animate-fade-in';
    
    card.innerHTML = `
        <img src="${newsData.image}" alt="${newsData.title}" class="noticia-image">
        <div class="noticia-content">
            <h3 class="noticia-title">${newsData.title}</h3>
            <p class="noticia-text">${newsData.content}</p>
            <div class="noticia-date">${formatDate(newsData.date)}</div>
        </div>
    `;
    
    container.appendChild(card);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
    });
}

// ===== FUNCIÓN COPIAR ENLACES =====
function initializeCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const url = this.getAttribute('data-url');
            
            try {
                await navigator.clipboard.writeText(url);
                showCopySuccess(this);
            } catch (error) {
                // Fallback para navegadores que no soportan clipboard API
                fallbackCopyToClipboard(url);
                showCopySuccess(this);
            }
        });
    });
}

function showCopySuccess(button) {
    const originalText = button.textContent;
    button.textContent = '✅ ¡Copiado!';
    button.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 2000);
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
    } catch (error) {
        console.error('Error copiando al portapapeles:', error);
    }
    
    document.body.removeChild(textArea);
}

// ===== FUNCIONES DE UTILIDAD =====
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
    }
}

// ===== MANEJO DE ERRORES =====
window.addEventListener('error', function(e) {
    console.error('Error global:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Promise rechazada:', e.reason);
});

// ===== OPTIMIZACIONES DE RENDIMIENTO =====
// Intersection Observer para lazy loading
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para navegadores sin soporte
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// ===== MANEJO DE RESIZE =====
window.addEventListener('resize', debounce(function() {
    // Reajustar carruseles si es necesario
    Object.keys(currentIndexes).forEach(carouselType => {
        updateCarousel(carouselType);
    });
}, 250));

// ===== LOG DE CARGA COMPLETA =====
window.addEventListener('load', function() {
    console.log('🎉 Página FUL USFX completamente cargada');
    
    // Configurar lazy loading después de la carga
    setupLazyLoading();
    
    // Precargar contenido crítico
    preloadCriticalContent();
});

function preloadCriticalContent() {
    // Precargar imágenes importantes
    const criticalImages = [
        'images/logo-ful.png',
        'images/logo-usfx.png',
        'images/logo-gestion.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// ===== ANALYTICS Y TRACKING =====
function trackEvent(category, action, label) {
    // Placeholder para analytics
    console.log(`📊 Evento: ${category} - ${action} - ${label}`);
}

// Tracking de clics en navegación
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('nav-link')) {
        trackEvent('Navigation', 'Click', e.target.textContent);
    }
    
    if (e.target.classList.contains('btn-primary') || e.target.classList.contains('btn-secondary')) {
        trackEvent('Button', 'Click', e.target.textContent);
    }
});

console.log('📱 JavaScript FUL USFX cargado y listo');
