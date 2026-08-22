// ==================================================
// 1. SISTEMA DE IDIOMAS
// ==================================================
let idiomaActual = 'es';
let productos = [];  // Ahora se llenará desde el JSON

const traducciones = {
    'nav-home': { es: 'Inicio', en: 'Home' },
    'nav-products': { es: 'Productos', en: 'Products' },
    'hero-title': { es: 'XAM GOTH', en: 'XAM GOTH' },
    'hero-subtitle': { es: 'Moda alternativa para almas oscuras', en: 'Alternative fashion for dark souls' },
    'hero-cta': { es: 'Explorar colección', en: 'Explore collection' },
    'about-title': { es: 'Sobre XAM', en: 'About XAM' },
    'about-text1': { es: 'Somos una marca de ropa gótica y alternativa con sede en Colombia. Cada prenda está diseñada para expresar tu identidad sin filtros.', en: 'We are a gothic and alternative clothing brand based in Colombia. Each garment is designed to express your identity without filters.' },
    'about-text2': { es: 'Nuestras colecciones combinan estética oscura, calidad premium y un compromiso con la producción ética y sostenible.', en: 'Our collections combine dark aesthetics, premium quality, and a commitment to ethical and sustainable production.' },
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
    'buy-btn': { es: 'Comprar', en: 'Buy' },
    'no-products': { es: 'No hay productos disponibles en esta categoría.', en: 'No products available in this category.' },
    'footer-rights': { es: 'Todos los derechos reservados.', en: 'All rights reserved.' },
    'map-title': { es: '📍 Encuentra nuestros productos', en: '📍 Find our products' },
    'map-subtitle': { 
        es: 'Actualmente nuestros productos están disponibles en <strong>Restaurante y Minimarket Coreano Saranghae</strong>, nuestro socio comercial.<br><small>¡Visítalos y descubre nuestra colección en persona!</small>', 
        en: 'Our products are currently available at <strong>Saranghae Korean Restaurant & Minimarket</strong>, our business partner.<br><small>Visit them and discover our collection in person!</small>' 
    },
    'map-partner': { es: 'Nuestro socio', en: 'Our partner' },
    'map-partner-name': { es: 'Restaurante y Minimarket Coreano Saranghae', en: 'Saranghae Korean Restaurant & Minimarket' },
    'map-address': { es: 'Dirección', en: 'Address' },
    'map-address-text': { es: 'Cra. 44 A N 18 70 Sur, Villavicencio', en: 'Cra. 44 A N 18 70 Sur, Villavicencio' },
    'map-hours': { es: 'Horario de atención', en: 'Business hours' },
    'map-hours-text': { es: 'Dom - Vie: 1:00 PM - 9:00 PM', en: 'Sun - Fry: 1:00 PM - 9:00 PM' },
    'map-note': { 
        es: ' XAM Goth Apparel es una marca independiente. Nuestros productos están disponibles en este punto de venta gracias a nuestro socio comercial.', 
        en: ' XAM Goth Apparel is an independent brand. Our products are available at this location thanks to our business partner.' 
    },
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
        
        // ===== FUNCIÓN PARA LIMPIAR LA RUTA DE LA IMAGEN =====
        function limpiarRutaImagen(ruta) {
            if (!ruta || typeof ruta !== 'string') return '';
            // Si empieza con '/', la eliminamos
            if (ruta.startsWith('/')) {
                return ruta.substring(1);
            }
            return ruta;
        }
        // ======================================================
        
        // Generar imágenes
        let imagenesHTML = '';
        if (p.imagenes && p.imagenes.length > 0) {
            p.imagenes.forEach((img, idx) => {
                // Limpiar la ruta de la imagen
                const imgSrc = limpiarRutaImagen(img);
                imagenesHTML += `
                    <div class="carousel-item ${idx === 0 ? 'active' : ''}">
                        <img src="${imgSrc}" class="d-block w-100" alt="${p.nombre[idiomaActual]}" 
                             style="height: 280px; object-fit: cover;">
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
                        <div class="carousel-inner">
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
                        <h5 class="card-title">${p.nombre[idiomaActual]}</h5>
                        <p class="card-text flex-grow-1">${p.descripcion[idiomaActual]}</p>
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
}

// ==================================================
// 4. IDIOMAS
// ==================================================
function cambiarIdioma(lang) {
    idiomaActual = lang;
    localStorage.setItem('xam-lang', lang);
    document.getElementById('current-lang').textContent = lang.toUpperCase();
    aplicarIdioma();
    renderizarProductos();
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
        })
        .catch(error => {
            console.error('Error cargando productos:', error);
            // Productos de respaldo en caso de error
            productos = [];
            renderizarProductos();
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
});