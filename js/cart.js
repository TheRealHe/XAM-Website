// ==================================================
// CARRITO DE COMPRAS
// ==================================================

// Obtener carrito del localStorage
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('xam-cart')) || [];
    } catch {
        return [];
    }
}

// Guardar carrito en localStorage
function saveCart(cart) {
    localStorage.setItem('xam-cart', JSON.stringify(cart));
}

// ===== FUNCIÓN AGREGAR AL CARRITO (GLOBAL) =====
function addToCart(productId) {
    console.log('addToCart llamado con ID:', productId);
    
    if (typeof productos === 'undefined' || productos.length === 0) {
        console.error('Productos no cargados aún.');
        alert('Espera a que los productos carguen.');
        return;
    }
    
    const cart = getCart();
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        const product = productos.find(p => p.id === productId);
        if (!product) {
            console.error('Producto no encontrado:', productId);
            alert('Producto no encontrado.');
            return;
        }
        
        cart.push({
            id: product.id,
            nombre: product.nombre,
            precio: product.precio,
            imagen: product.imagenes && product.imagenes.length > 0 ? product.imagenes[0] : null,
            quantity: 1
        });
    }
    
    saveCart(cart);
    updateCartCount();
    alert('🖤 Producto agregado al carrito');
}

// Exponer la función globalmente
window.addToCart = addToCart;

// Eliminar producto del carrito
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartCount();
    renderCart();
}

// Actualizar cantidad
function updateQuantity(productId, newQuantity) {
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        item.quantity = newQuantity;
        saveCart(cart);
        renderCart();
    }
}

// Vaciar carrito
function clearCart() {
    saveCart([]);
    updateCartCount();
    renderCart();
}

// Contar items en el carrito
function getCartCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Actualizar el contador del carrito
function updateCartCount() {
    const count = getCartCount();
    
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'inline-block' : 'none';
    });
    
    document.querySelectorAll('.cart-count-badge').forEach(el => {
        el.textContent = count;
        el.classList.toggle('visible', count > 0);
    });
}

// ==================================================
// RENDERIZAR CARRITO EN CART.HTML
// ==================================================

function renderCart() {
    console.log('renderCart() ejecutado');
    
    const container = document.getElementById('cart-items');
    const totalContainer = document.getElementById('cart-total');
    const emptyMessage = document.getElementById('cart-empty');
    const itemsContainer = document.getElementById('cart-items-container');
    
    if (!container) {
        console.error('Elemento #cart-items no encontrado');
        return;
    }
    
    const cart = getCart();
    console.log('Carrito actual:', cart);
    
    if (cart.length === 0) {
        if (emptyMessage) emptyMessage.style.display = 'block';
        if (itemsContainer) itemsContainer.style.display = 'none';
        container.innerHTML = '';
        if (totalContainer) totalContainer.innerHTML = '';
        return;
    }
    
    if (emptyMessage) emptyMessage.style.display = 'none';
    if (itemsContainer) itemsContainer.style.display = 'block';
    
    const lang = typeof idiomaActual !== 'undefined' ? idiomaActual : 'es';
    console.log('Idioma actual:', lang);
    
    let html = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const subtotal = item.precio * item.quantity;
        total += subtotal;
        
        let nombre = 'Producto';
        if (item.nombre) {
            if (typeof item.nombre === 'object') {
                nombre = item.nombre[lang] || item.nombre.es || 'Producto';
            } else {
                nombre = item.nombre;
            }
        }
        
        // ===== CORREGIR RUTA DE LA IMAGEN =====
        let imagenSrc = 'assets/images/placeholder.jpg';
        if (item.imagen) {
            if (typeof corregirRutaImagen !== 'undefined') {
                imagenSrc = corregirRutaImagen(item.imagen);
            } else {
                imagenSrc = item.imagen;
            }
        }
        // ======================================
        
        html += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${imagenSrc}" alt="${nombre}" onerror="this.src='assets/images/placeholder.jpg'">
                </div>
                <div class="cart-item-info">
                    <h5>${nombre}</h5>
                    <p class="cart-item-price">$${item.precio.toLocaleString('es-CO')}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="btn-qty" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
                    <span>${item.quantity}</span>
                    <button class="btn-qty" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <div class="cart-item-subtotal">
                    $${subtotal.toLocaleString('es-CO')}
                </div>
                <div class="cart-item-remove">
                    <button onclick="removeFromCart(${item.id})" class="btn-remove">✕</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    console.log('HTML del carrito generado');
    
    if (totalContainer) {
        const totalText = (typeof traducciones !== 'undefined' && traducciones['cart-total']) 
            ? traducciones['cart-total'][lang] 
            : 'Total';
        totalContainer.innerHTML = `
            <div class="cart-total-row">
                <span>${totalText}</span>
                <span class="cart-total-amount">$${total.toLocaleString('es-CO')}</span>
            </div>
        `;
    }
}

// ==================================================
// ENVIAR PEDIDO POR WHATSAPP
// ==================================================
function sendOrder() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Tu carrito está vacío.');
        return;
    }
    
    const lang = typeof idiomaActual !== 'undefined' ? idiomaActual : 'es';
    
    let message = '🖤 *NUEVO PEDIDO XAM GOTH APPAREL*%0A%0A';
    message += '*Detalle del pedido:*%0A';
    
    let total = 0;
    cart.forEach((item, index) => {
        let nombre = 'Producto';
        if (item.nombre) {
            if (typeof item.nombre === 'object') {
                nombre = item.nombre[lang] || item.nombre.es || 'Producto';
            } else {
                nombre = item.nombre;
            }
        }
        const subtotal = item.precio * item.quantity;
        total += subtotal;
        message += `${index + 1}. ${nombre} x${item.quantity} = $${subtotal.toLocaleString('es-CO')}%0A`;
    });
    
    message += `%0A*Total: $${total.toLocaleString('es-CO')}*%0A%0A`;
    message += '¡Gracias por tu pedido! 🖤';
    
    const phone = '573123271353';
    const url = `https://wa.me/${phone}?text=${message}`;
    
    window.open(url, '_blank');
}

// ==================================================
// INICIALIZAR IDIOMA EN CART.HTML
// ==================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded en cart.js');
    
    const langGuardado = localStorage.getItem('xam-lang') || 'es';
    if (typeof idiomaActual !== 'undefined') {
        idiomaActual = langGuardado;
    }
    
    const currentLangEl = document.getElementById('current-lang');
    if (currentLangEl) {
        currentLangEl.textContent = langGuardado.toUpperCase();
    }
    
    if (typeof aplicarIdioma === 'function') {
        aplicarIdioma();
    }
    
    updateCartCount();
    renderCart();
});