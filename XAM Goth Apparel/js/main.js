// ==================================================
// 1. CATÁLOGO DE PRODUCTOS
// ==================================================
const productos = [
    {
        id: 1,
        nombre: { es: "Camiseta Nocturna", en: "Nightshirt" },
        descripcion: { es: "Camiseta 100% algodón con estampado de luna y cuervos.", en: "100% cotton t-shirt with moon and ravens print." },
        precio: 45000,
        categoria: "camisas",
        imagen: "assets/images/product1.jpg",
        activo: true
    },
    {
        id: 2,
        nombre: { es: "Anillo de Plata", en: "Silver Ring" },
        descripcion: { es: "Anillo de plata 925 con grabado de calavera.", en: "925 silver ring with skull engraving." },
        precio: 32000,
        categoria: "accesorios",
        imagen: "assets/images/product2.jpg",
        activo: true
    },
    {
        id: 3,
        nombre: { es: "Pantalón Táctico", en: "Tactical Pants" },
        descripcion: { es: "Pantalón de carga con costuras reforzadas.", en: "Cargo pants with reinforced stitching." },
        precio: 89000,
        categoria: "pantalones",
        imagen: "assets/images/product3.jpg",
        activo: true
    },
    {
        id: 4,
        nombre: { es: "Camiseta Gótica", en: "Gothic Tee" },
        descripcion: { es: "Diseño exclusivo de calaveras y rosas.", en: "Exclusive skulls & roses design." },
        precio: 52000,
        categoria: "camisas",
        imagen: "assets/images/product4.jpg",
        activo: true
    },
    {
        id: 5,
        nombre: { es: "Pulsera de Cuero", en: "Leather Bracelet" },
        descripcion: { es: "Pulsera de cuero con cierre metálico.", en: "Leather bracelet with metal clasp." },
        precio: 18000,
        categoria: "accesorios",
        imagen: "assets/images/product5.jpg",
        activo: true
    },
    {
        id: 6,
        nombre: { es: "Pantalón de Cuero", en: "Leather Pants" },
        descripcion: { es: "Pantalón de cuero genuino. Unisex.", en: "Genuine leather pants. Unisex." },
        precio: 125000,
        categoria: "pantalones",
        imagen: "assets/images/product6.jpg",
        activo: false  // <--- Este producto está INACTIVO (no se muestra)
    }
];

// ==================================================
// 2. SISTEMA DE IDIOMAS
// ==================================================
let idiomaActual = 'es';

// Diccionario de traducciones
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
    'footer-rights': { es: 'Todos los derechos reservados.', en: 'All rights reserved.' },
};

// ==================================================
// 3. FUNCIONES PRINCIPALES
// ==================================================

// Renderizar productos en la página
function renderizarProductos(filtro = 'all') {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    // Filtrar productos activos
    let productosActivos = productos.filter(p => p.activo === true);

    // Aplicar filtro por categoría
    if (filtro !== 'all') {
        productosActivos = productosActivos.filter(p => p.categoria === filtro);
    }

    // Si no hay productos, mostrar mensaje
    if (productosActivos.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="text-muted fs-4" data-i18n="no-products">No hay productos disponibles en esta categoría.</p>
            </div>
        `;
        return;
    }

    // Generar HTML de cada producto
    const html = productosActivos.map(p => `
        <div class="col-md-4 col-lg-3">
            <div class="product-card h-100">
                <img src="${p.imagen}" alt="${p.nombre[idiomaActual]}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${p.nombre[idiomaActual]}</h5>
                    <p class="card-text flex-grow-1">${p.descripcion[idiomaActual]}</p>
                    <p class="price">$${p.precio.toLocaleString('es-CO')}</p>
                    <a href="https://www.instagram.com/direct/t/xam_gothapparel" target="_blank" class="btn btn-buy">
                        <i class="bi bi-instagram me-1"></i> 
                        <span data-i18n="buy-btn">Comprar</span>
                    </a>
                </div>
            </div>
        </div>
    `).join('');

    grid.innerHTML = html;
    
    // Aplicar idioma a los textos dinámicos
    aplicarIdioma();
}

// Cambiar idioma
function cambiarIdioma(lang) {
    idiomaActual = lang;
    localStorage.setItem('xam-lang', lang);
    document.getElementById('current-lang').textContent = lang.toUpperCase();
    aplicarIdioma();
    renderizarProductos(document.querySelector('.filter-btn.active')?.dataset?.filter || 'all');
}

// Aplicar idioma a todos los elementos con data-i18n
function aplicarIdioma() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (traducciones[key] && traducciones[key][idiomaActual]) {
            el.textContent = traducciones[key][idiomaActual];
        }
    });
}

// ==================================================
// 4. EVENTOS Y CONFIGURACIÓN INICIAL
// ==================================================

document.addEventListener('DOMContentLoaded', () => {
    // Recuperar idioma guardado
    const langGuardado = localStorage.getItem('xam-lang') || 'es';
    idiomaActual = langGuardado;
    document.getElementById('current-lang').textContent = langGuardado.toUpperCase();

    // Eventos de filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderizarProductos(this.dataset.filter);
        });
    });

    // Eventos de cambio de idioma
    document.querySelectorAll('[data-lang]').forEach(btn => {
        btn.addEventListener('click', () => {
            cambiarIdioma(btn.dataset.lang);
        });
    });

    // Renderizar productos iniciales
    renderizarProductos('all');
});