// ==================================================
// 1. SISTEMA DE IDIOMAS
// ==================================================

let idiomaActual = 'es';
let productos = [];

// ===== FUNCIÓN GLOBAL PARA LIMPIAR RUTAS DE IMÁGENES =====
function limpiarRutaImagen(ruta) {
    if (!ruta || typeof ruta !== 'string') return '';
    if (ruta.startsWith('/')) {
        return ruta.substring(1);
    }
    return ruta;
}

// ==================================================
// OBTENER URL BASE DEL SITIO
// ==================================================
function getBaseUrl() {
    const path = window.location.pathname;
    const repoName = path.split('/')[1] || '';
    if (repoName && path.includes(repoName)) {
        return `/${repoName}`;
    }
    return '';
}

const BASE_URL = getBaseUrl();

// ==================================================
// FUNCIÓN PARA CORREGIR RUTAS DE IMÁGENES
// ==================================================
function corregirRutaImagen(ruta) {
    if (!ruta || typeof ruta !== 'string') return '';
    
    // Si la ruta ya es absoluta (con http), devolverla tal cual
    if (ruta.startsWith('http://') || ruta.startsWith('https://')) {
        return ruta;
    }
    
    // Eliminar barra al inicio
    if (ruta.startsWith('/')) {
        ruta = ruta.substring(1);
    }
    
    // Si la ruta comienza con 'assets/' y hay un repositorio, agregar la base
    if (ruta.startsWith('assets/')) {
        if (BASE_URL) {
            return `${BASE_URL}/${ruta}`;
        }
    }
    
    return ruta;
}

// ==================================================

const traducciones = {
    'nav-home': { es: 'Inicio', en: 'Home' },
    'nav-products': { es: 'Productos', en: 'Products' },
    'hero-title': { es: 'XAM', en: 'XAM' },
    'hero-subtitle': { es: 'Para los que viven fuera del molde', en: 'For those who break the mold' },
    'hero-cta': { es: 'Explorar colección', en: 'Explore collection' },
    'about-title': { es: 'Sobre XAM', en: 'About XAM' },
    'about-highlight-1': { es: 'Nacimos lejos.', en: 'We were born far away.' },
    'about-highlight-2': { es: 'Pero encontramos nuestro lugar aquí.', en: 'But we found our place here.' },
    'about-text1': { 
        es: 'XAM Goth Apparel nació en Australia, en Perth, buscando algo que simplemente no encontrábamos: una propuesta diferente para quienes querían vestir fuera de lo convencional.', 
        en: 'XAM Goth Apparel was born in Australia, in Perth, searching for something we simply couldn\'t find: a different proposal for those who wanted to dress outside the conventional.' },
    'about-text2': { 
        es: 'Hoy, desde Colombia, seguimos con esa misma obsesión. Usamos las conexiones que hicimos en Australia para traer productos únicos a nuestro país. Amamos esta moda y queremos que más personas se enamoren de ella al entrar a nuestra tienda.', 
        en: 'Today, from Colombia, we continue with that same obsession. We use the connections we made in Australia to bring unique products to our country. We love this fashion and want more people to fall in love with it when they walk into our store.' },
    'about-highlight-3': { es: 'No queremos vestir a todos.', en: 'We don\'t want to dress everyone.' },
    'about-highlight-4': { es: 'Queremos vestir a los que siempre fueron diferentes.', en: 'We want to dress those who were always different.' },
    'new-title': { es: '🌙 Últimos productos', en: ' 🌙 New arrivals' },
    'new-subtitle': { es: 'Lo más nuevo que tenemos para ti', en: 'The newest we have for you' },
    'new-cta': { es: 'Ver todos los productos →', en: 'View all products →' },
    'new-empty': { es: 'Pronto tendremos nuevos productos.', en: 'We\'ll have new products soon.' },
    'value1-title': { es: 'Hecho a mano', en: 'Handcrafted' },
    'value1-desc': { es: 'Cada pieza es única y elaborada con atención al detalle.', en: 'Each piece is unique and crafted with attention to detail.' },
    'value2-title': { es: 'Sostenible', en: 'Sustainable' },
    'value2-desc': { es: 'Materiales eco-amigables y producción responsable.', en: 'Eco-friendly materials and responsible production.' },
    'value3-title': { es: 'Comunidad', en: 'Community' },
    'value3-desc': { es: 'Somos una tribu. Cada compra apoya el arte alternativo.', en: 'We are a tribe. Every purchase supports alternative art.' },
    'catalog-title': { es: 'Nuestros Productos', en: 'Our Products' },
    'filter-all': { es: 'Todos', en: 'All' },
    'filter-shirts': { es: 'Camisas', en: 'Shirts' },
    'filter-accessories': { es: 'Accesorios', en: 'Accessories' },
    'filter-pants': { es: 'Pantalones', en: 'Pants' },
    'filter-shoes': { es: 'Zapatos', en: 'Shoes' },
    'filter-skirts': { es: 'Faldas', en: 'Skirts' },
    'filter-plushies': { es: 'Peluches', en: 'Plushies' },
    'filter-bags': { es: 'Maletas', en: 'Bags' },
    'filter-by-category': { es: 'Filtrar por categoría', en: 'Filter by category' },
    'filter-by-price': { es: 'Filtrar por precio', en: 'Filter by price' },
    'price-all': { es: 'Todos', en: 'All' },
    'price-less-20': { es: 'Menos de $20.000', en: 'Less than $20.000' },
    'price-20-50': { es: '$20.000 - $50.000', en: '$20.000 - $50.000' },
    'price-50-100': { es: '$50.000 - $100.000', en: '$50.000 - $100.000' },
    'price-more-100': { es: 'Más de $100.000', en: 'More than $100.000' },
    'buy-btn': {es: 'Comprar', en: 'Buy'},
    'add-to-cart': { es: 'Agregar al carrito', en: 'Add to cart' },
    'cart-title': { es: '✦ Tu selección', en: '✦ Your selection' },
    'cart-title-p': { es: 'Carrito', en: 'Cart' },
    'cart-empty': { es: 'Tu carrito está vacío.', en: 'Your cart is empty.' },
    'cart-total': { es: 'Total', en: 'Total' },
    'cart-checkout': { es: 'Comprar por WhatsApp', en: 'Buy via WhatsApp' },
    'cart-clear': { es: 'Vaciar carrito', en: 'Clear cart' },
    'cart-continue': { es: 'Seguir comprando', en: 'Continue shopping' },
    'no-products': { es: 'No hay productos disponibles en esta categoría.', en: 'No products available in this category.' },
    'why-title': { es: '¿Por qué XAM?', en: 'Why XAM?' },
    'why-subtitle': { es: 'Diferente por diseño. Auténtico por naturaleza.', en: 'Different by design. Authentic by nature.' },
    'why-point1-title': { es: 'No se ve en cualquier calle', en: 'Not seen on any street' },
    'why-point1-desc': { es: 'En Villavicencio, somos los únicos. En Colombia, de los pocos. Porque hay estilos que no se ven en cualquier calle, y el nuestro es uno de ellos.', en: 'In Villavicencio, we are the only ones. In Colombia, one of the few. Because there are styles that aren\'t seen on any street, and ours is one of them.' },
    'why-point2-title': { es: 'Comunidad antes que ventas', en: 'Community over sales' },
    'why-point2-desc': { es: 'No queremos que nos compres una vez y te olvides. Queremos que entres, te quedes, y sientas que esto también es tuyo.', en: 'We don\'t want you to buy once and forget us. We want you to walk in, stay, and feel that this is yours too.' },
    'why-point3-title': { es: 'Estilo que cruza océanos', en: 'Style that crosses oceans' },
    'why-point3-desc': { es: 'Cruzamos un océano para que no tengas que hacerlo tú. El estilo ya está aquí, solo falta que lo uses. Y cuando lo hagas, vas a entender por qué valió la pena.', en: 'We crossed an ocean so you don\'t have to. The style is already here, you just need to wear it. And when you do, you\'ll understand why it was worth it.' },
    'map-title': { es: '🕯️ Nuestra casa, Tu próxima parada', en: '🕯️ Our home, Your next stop' },
    'map-subtitle': { 
        es: 'Actualmente nuestros productos están disponibles en <strong>Restaurante y Minimarket Coreano Saranghae</strong>, nuestro socio comercial.<br><small>¡Visítalos y descubre nuestra colección en persona!</small>', 
        en: 'Our products are currently available at <strong>Saranghae Korean Restaurant & Minimarket</strong>, our business partner.<br><small>Visit them and discover our collection in person!</small>' 
    },
    'map-partner': { es: 'Nuestro socio', en: 'Our partner' },
    'map-partner-name': { es: 'Restaurante y Minimarket Coreano Saranghae', en: 'Saranghae Korean Restaurant & Minimarket' },
    'map-address': { es: 'Dirección', en: 'Address' },
    'map-address-text': { es: 'Cra. 44 A N 18 70 Sur, Villavicencio', en: 'Cra. 44 A N 18 70 Sur, Villavicencio' },
    'map-hours': { es: 'Horario de atención', en: 'Business hours' },
    'map-hours-text': { es: 'Dom - Jue: 1:00 PM - 9:00 PM', en: 'Sun - Thu: 1:00 PM - 9:00 PM' },
    'map-note': { 
        es: ' XAM Goth Apparel es una marca independiente. Nuestros productos están disponibles en este punto de venta gracias a nuestro socio comercial.', 
        en: ' XAM Goth Apparel is an independent brand. Our products are available at this location thanks to our business partner.' 
    },
    'shipping-title': { es: 'de nuestro armario al tuyo', en: 'From our closet to yours' },
    'shipping-text1': { 
        es: 'Sabemos lo que es querer algo y no poder tenerlo porque está lejos. Por eso decidimos que ningún rincón de Colombia se quede sin XAM.', 
        en: 'We know what it\'s like to want something and not be able to have it because it\'s far away. That\'s why we decided that no corner of Colombia should be without XAM.' 
    },
    'shipping-text2': { 
        es: 'Hacemos envíos a todo el país con mensajería certificada. Tiempo estimado: <strong>3 a 7 días hábiles</strong>. El costo se calcula según tu ubicación.', 
        en: 'We ship nationwide with certified courier. Estimated time: <strong>3 to 7 business days</strong>. The cost is calculated based on your location.' 
    },
    'shipping-cta': { es: 'Donde sea que estés, XAM te espera.', en: 'Wherever you are, XAM awaits you.' },
    'footer-rights': { es: 'Todos los derechos reservados.', en: 'All rights reserved.' },
    'surprise': {es : 'Sorprendeme', en: 'Surprise me'},

};

// ==================================================
// 2. ESTADO DE FILTROS
// ==================================================
let filtroCategoria = 'all';
let filtroPrecio = 'all';

// ==================================================
// 3. FUNCIONES PRINCIPALES
// ==================================================

// Renderizar productos
function renderizarProductos() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    // 1. Filtrar productos activos
    let productosFiltrados = productos.filter(p => p.activo === true);

    // 2. Aplicar filtro por categoría
    if (filtroCategoria !== 'all') {
        productosFiltrados = productosFiltrados.filter(p => p.categoria === filtroCategoria);
    }

    // 3. Aplicar filtro por precio
    if (filtroPrecio !== 'all') {
        productosFiltrados = productosFiltrados.filter(p => {
            const precio = p.precio;
            switch (filtroPrecio) {
                case 'menos-20': return precio < 20000;
                case '20-50': return precio >= 20000 && precio <= 50000;
                case '50-100': return precio > 50000 && precio <= 100000;
                case 'mas-100': return precio > 100000;
                default: return true;
            }
        });
    }

    // 4. Si no hay productos, mostrar mensaje
    if (productosFiltrados.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="text-muted fs-4" data-i18n="no-products">No hay productos que coincidan con los filtros seleccionados.</p>
            </div>
        `;
        aplicarIdioma();
        return;
    }

    // 5. Generar HTML de productos con carrusel
    const html = productosFiltrados.map((p, index) => {
        const carouselId = `carousel-${p.id}-${index}`;
        const tieneMultiples = p.imagenes && p.imagenes.length > 1;
        
        limpiarRutaImagen()
        
        // Generar imágenes
        let imagenesHTML = '';
        if (p.imagenes && p.imagenes.length > 0) {
            p.imagenes.forEach((img, idx) => {
                // Limpiar la ruta de la imagen
                const imgSrc = limpiarRutaImagen(img);
                imagenesHTML += `
                    <div class="carousel-item ${idx === 0 ? 'active' : ''}" data-imagenes='${JSON.stringify(p.imagenes)}' data-index="${idx}">
                        <img src="${imgSrc}" class="d-block w-100" alt="${p.nombre[idiomaActual]}" 
                            style="height: 280px; object-fit: cover; background: #0a0a0a; cursor: pointer;">
                    </div>
                `;
            });
        } else {
            imagenesHTML = `
                <div class="carousel-item active">
                    <img src="assets/images/placeholder.jpg" class="d-block w-100" alt="Sin imagen" 
                         style="height: 280px; object-fit: cover; background: #222;">
                </div>
            `;
        }

        // Generar puntos indicadores
        let puntosHTML = '';
        if (tieneMultiples) {
            p.imagenes.forEach((_, idx) => {
                puntosHTML += `
                    <button type="button" class="carousel-dot" 
                            data-carousel-id="${carouselId}" 
                            data-slide-to="${idx}" 
                            style="width: 12px; height: 12px; border-radius: 50%; border: none; 
                                   background: ${idx === 0 ? '#ffffff' : '#555555'}; 
                                   margin: 0 4px; padding: 0; cursor: pointer; transition: background 0.3s;">
                    </button>
                `;
            });
        }

        return `
            <div class="col-md-4 col-lg-3">
                <div class="product-card h-100">
                    <!-- CARRUSEL -->
                    <div id="${carouselId}" class="carousel slide" data-bs-ride="false">
                        <div class="carousel-inner" style="cursor: pointer;">
                            ${imagenesHTML}
                        </div>
                        
                        <!-- Flechas -->
                        ${tieneMultiples ? `
                            <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev" 
                                    style="width: 20%; background: linear-gradient(to right, rgba(0,0,0,0.6), transparent); border: none;">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Anterior</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next" 
                                    style="width: 20%; background: linear-gradient(to left, rgba(0,0,0,0.6), transparent); border: none;">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Siguiente</span>
                            </button>
                        ` : ''}
                    </div>
                    
                    <!-- Puntos indicadores -->
                    ${tieneMultiples ? `
                        <div class="d-flex justify-content-center gap-1 mt-2" id="${carouselId}-dots" style="position: relative; top: -10px;">
                            ${puntosHTML}
                        </div>
                    ` : ''}

                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title" style="cursor: pointer;" data-imagenes='${JSON.stringify(p.imagenes)}' data-index="0">${p.nombre[idiomaActual]}</h5>
                        <p class="card-text flex-grow-1">${p.descripcion[idiomaActual]}</p>
                        <p class="price">$${p.precio.toLocaleString('es-CO')}</p>
                        <button onclick="addToCart(${p.id})" class="btn btn-buy">
                            <i class="bi bi-cart-plus me-1"></i> 
                            <span data-i18n="add-to-cart">Agregar al carrito</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    grid.innerHTML = html;

    // ===== EVENTOS PARA EL LIGHTBOX =====
    document.querySelectorAll('[data-imagenes]').forEach(el => {
        el.addEventListener('click', function() {
            const images = JSON.parse(this.dataset.imagenes);
            const index = parseInt(this.dataset.index) || 0;
            openLightbox(images, index);
        });
    });

    aplicarIdioma();

    // Inicializar eventos de los carruseles
    document.querySelectorAll('.carousel').forEach(carousel => {
        const carouselId = carousel.id;
        
        carousel.addEventListener('slid.bs.carousel', function(event) {
            const newIndex = event.to;
            const dotContainer = document.getElementById(`${carouselId}-dots`);
            
            if (dotContainer) {
                const dots = dotContainer.querySelectorAll('.carousel-dot');
                dots.forEach((dot, idx) => {
                    if (idx === newIndex) {
                        dot.style.background = '#ffffff';
                    } else {
                        dot.style.background = '#555555';
                    }
                });
            }
        });

        const dots = document.querySelectorAll(`#${carouselId}-dots .carousel-dot`);
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const slideIndex = parseInt(this.dataset.slideTo);
                const carouselEl = document.getElementById(carouselId);
                const bsCarousel = bootstrap.Carousel.getInstance(carouselEl);
                if (bsCarousel) {
                    bsCarousel.to(slideIndex);
                }
            });
        });
    });

    mostrarUltimosProductos();

}

// ==================================================
// 4. IDIOMAS
// ==================================================
function cambiarIdioma(lang) {
    idiomaActual = lang;
    localStorage.setItem('xam-lang', lang);
    document.getElementById('current-lang').textContent = lang.toUpperCase();
    
    // Actualizar todos los textos estáticos
    aplicarIdioma();
    
    // Actualizar últimas novedades (solo en index.html)
    if (document.getElementById('new-products-grid')) {
        mostrarUltimosProductos();
    }
    
    // Actualizar catálogo (solo en products.html)
    if (document.getElementById('product-grid')) {
        renderizarProductos();
    }
}


function aplicarIdioma() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (traducciones[key] && traducciones[key][idiomaActual]) {
            // Usamos innerHTML para permitir etiquetas HTML
            el.innerHTML = traducciones[key][idiomaActual];
        }
    });
}

// ==================================================
// 5. CARGAR PRODUCTOS DESDE JSON
// ==================================================
function cargarProductos() {
    fetch('data/productos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo de productos');
            }
            return response.json();
        })
        .then(data => {
            productos = data;
            renderizarProductos();
            mostrarUltimosProductos();
        })
        .catch(error => {
            console.error('Error cargando productos:', error);
            // Productos de respaldo en caso de error
            productos = [];
            renderizarProductos();
            mostrarUltimosProductos();
        });
}

// ==================================================
// 6. EVENTOS Y CONFIGURACIÓN INICIAL
// ==================================================
document.addEventListener('DOMContentLoaded', () => {
    // Recuperar idioma guardado
    const langGuardado = localStorage.getItem('xam-lang') || 'es';
    idiomaActual = langGuardado;
    document.getElementById('current-lang').textContent = langGuardado.toUpperCase();
    
    // Cargar productos desde el JSON
    cargarProductos();
    
    // Mostrar últimos productos DESPUÉS de cargar los productos
    const observer = new MutationObserver(() => {
        if (productos.length > 0) {
            mostrarUltimosProductos();
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Eventos de filtros
    document.querySelectorAll('.filter-category').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-category').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filtroCategoria = this.dataset.category;
            renderizarProductos();
        });
    });

    document.querySelectorAll('.filter-price').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-price').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filtroPrecio = this.dataset.price;
            renderizarProductos();
        });
    });

    document.querySelectorAll('[data-lang]').forEach(btn => {
        btn.addEventListener('click', () => {
            cambiarIdioma(btn.dataset.lang);
        });
    });

    // Cargar productos desde el JSON
    cargarProductos();

    // ===== INICIALIZAR LIGHTBOX =====
    initLightbox();
    // ================================
});

// ==================================================
// 7. MOSTRAR ÚLTIMOS PRODUCTOS EN EL HOME
// ==================================================
function mostrarUltimosProductos() {
    const grid = document.getElementById('new-products-grid');
    if (!grid) return;

    const lang = idiomaActual;

    const ultimos = productos
        .filter(p => p.activo === true)
        .sort((a, b) => b.id - a.id)
        .slice(0, 4);

    if (ultimos.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted" data-i18n="new-empty">Pronto tendremos nuevos productos.</p>
            </div>
        `;
        aplicarIdioma();
        return;
    }

    const html = ultimos.map((p, index) => {
        const carouselId = `new-carousel-${p.id}-${index}`;
        const tieneMultiples = p.imagenes && p.imagenes.length > 1;
        
        let imagenesHTML = '';
        if (p.imagenes && p.imagenes.length > 0) {
            p.imagenes.forEach((img, idx) => {
                // Limpiar ruta de la imagen
                const imgSrc = limpiarRutaImagen(img);
                imagenesHTML += `
                    <div class="carousel-item ${idx === 0 ? 'active' : ''}" data-imagenes='${JSON.stringify(p.imagenes)}' data-index="${idx}">
                        <img src="${imgSrc}" class="d-block w-100" alt="${p.nombre[lang]}" 
                             style="height: 280px; object-fit: cover; background: #0a0a0a; cursor: pointer;">
                    </div>
                `;
            });
        } else {
            imagenesHTML = `
                <div class="carousel-item active">
                    <img src="assets/images/placeholder.jpg" class="d-block w-100" alt="Sin imagen" 
                         style="height: 280px; object-fit: cover; background: #0a0a0a;">
                </div>
            `;
        }

        let puntosHTML = '';
        if (tieneMultiples) {
            p.imagenes.forEach((_, idx) => {
                puntosHTML += `
                    <button type="button" class="carousel-dot" 
                            data-carousel-id="${carouselId}" 
                            data-slide-to="${idx}" 
                            style="width: 12px; height: 12px; border-radius: 50%; border: none; 
                                   background: ${idx === 0 ? '#ffffff' : '#555555'}; 
                                   margin: 0 4px; padding: 0; cursor: pointer; transition: background 0.3s;">
                    </button>
                `;
            });
        }

        return `
            <div class="col-md-3 col-6">
                <div class="product-card h-100">
                    <div id="${carouselId}" class="carousel slide" data-bs-ride="false">
                        <div class="carousel-inner" style="cursor: pointer;">
                            ${imagenesHTML}
                        </div>
                        ${tieneMultiples ? `
                            <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev" 
                                    style="width: 20%; background: linear-gradient(to right, rgba(0,0,0,0.6), transparent); border: none;">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Anterior</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next" 
                                    style="width: 20%; background: linear-gradient(to left, rgba(0,0,0,0.6), transparent); border: none;">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Siguiente</span>
                            </button>
                        ` : ''}
                    </div>
                    ${tieneMultiples ? `
                        <div class="d-flex justify-content-center gap-1 mt-2" id="${carouselId}-dots" style="position: relative; top: -10px;">
                            ${puntosHTML}
                        </div>
                    ` : ''}
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title" style="cursor: pointer;" data-imagenes='${JSON.stringify(p.imagenes)}' data-index="0">${p.nombre[lang]}</h5>
                        <p class="card-text flex-grow-1">${p.descripcion[lang]}</p>
                        <p class="price">$${p.precio.toLocaleString('es-CO')}</p>
                        <a href="https://www.instagram.com/direct/t/tucuenta" target="_blank" class="btn btn-buy">
                            <i class="bi bi-instagram me-1"></i> 
                            <span data-i18n="buy-btn">Comprar</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    grid.innerHTML = html;

    // ===== EVENTOS PARA EL LIGHTBOX (EN HOME) =====
    document.querySelectorAll('#new-products-grid [data-imagenes]').forEach(el => {
        el.addEventListener('click', function() {
            const images = JSON.parse(this.dataset.imagenes);
            const index = parseInt(this.dataset.index) || 0;
            openLightbox(images, index);
        });
    });

    aplicarIdioma();

    // Inicializar eventos de los carruseles
    document.querySelectorAll('#new-products-grid .carousel').forEach(carousel => {
        const carouselId = carousel.id;
        
        carousel.addEventListener('slid.bs.carousel', function(event) {
            const newIndex = event.to;
            const dotContainer = document.getElementById(`${carouselId}-dots`);
            
            if (dotContainer) {
                const dots = dotContainer.querySelectorAll('.carousel-dot');
                dots.forEach((dot, idx) => {
                    if (idx === newIndex) {
                        dot.style.background = '#ffffff';
                    } else {
                        dot.style.background = '#555555';
                    }
                });
            }
        });

        const dots = document.querySelectorAll(`#${carouselId}-dots .carousel-dot`);
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const slideIndex = parseInt(this.dataset.slideTo);
                const carouselEl = document.getElementById(carouselId);
                const bsCarousel = bootstrap.Carousel.getInstance(carouselEl);
                if (bsCarousel) {
                    bsCarousel.to(slideIndex);
                }
            });
        });
    });
}


// ==================================================
// 8. ANIMACIÓN DEL HERO AL CARGAR LA PÁGINA
// ==================================================
function animarHero() {
    const titulo = document.querySelector('.hero-title');
    const subtitulo = document.querySelector('.hero-subtitle');
    const boton = document.querySelector('.hero-btn');

    if (titulo) {
        setTimeout(() => {
            titulo.classList.add('visible');
        }, 500); // 0.5 segundos
    }

    if (subtitulo) {
        setTimeout(() => {
            subtitulo.classList.add('visible');
        }, 500); // 0.5 segundos
    }

    if (boton) {
        setTimeout(() => {
            boton.classList.add('visible');
        }, 500); // 0.5 segundos
    }
}

// Ejecutar cuando la página esté completamente cargada
document.addEventListener('DOMContentLoaded', function() {
    // Esperar 0.3 segundos antes de iniciar la animación
    setTimeout(animarHero, 300);
});

// ==================================================
// 9. LIGHTBOX + CARRUSEL (INICIALIZADO CUANDO EL DOM ESTÉ LISTO)
// ==================================================
let currentImages = [];
let currentIndex = 0;
let lightbox, lightboxImg, lightboxCounter, lightboxClose, lightboxPrev, lightboxNext;

function initLightbox() {
    lightbox = document.getElementById('lightbox');
    lightboxImg = document.getElementById('lightbox-img');
    lightboxCounter = document.getElementById('lightbox-counter');
    lightboxClose = document.getElementById('lightbox-close');
    lightboxPrev = document.getElementById('lightbox-prev');
    lightboxNext = document.getElementById('lightbox-next');

    if (!lightbox || !lightboxImg) {
        console.warn('Lightbox elements not found');
        return;
    }

    // Eventos
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);

    // Cerrar al hacer clic fuera de la imagen (en el fondo)
    lightbox.addEventListener('click', function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });

    // Cerrar con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });
}

// Función para abrir el lightbox
function openLightbox(images, index) {
    if (!lightboxImg) {
        console.warn('Lightbox not initialized');
        return;
    }
    currentImages = images;
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Exponer la función globalmente
window.openLightbox = openLightbox;

// Actualizar imagen y contador
function updateLightbox() {
    if (!lightboxImg) return;
    if (currentImages.length > 0) {
        lightboxImg.src = currentImages[currentIndex];
        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
        }
    }
}

// Cerrar lightbox
function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// Navegación
function prevImage() {
    if (currentImages.length > 0) {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateLightbox();
    }
}

function nextImage() {
    if (currentImages.length > 0) {
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateLightbox();
    }
}