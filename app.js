// ==========================================
// CRYPTOLAB A&A - APLICACIÓN PRINCIPAL
// ==========================================

// Estado de la aplicación
let currentUser = null;
let cart = [];
let contactProduct = null;
let currentCategory = 'all';

// IndexDB
let db;
const DB_NAME = 'CoolCenterDB';
const DB_VERSION = 1;

// ==========================================
// INICIALIZACIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initDB();
    renderFeaturedProducts();
    renderAllProducts();
    setupSearchFunctionality();
    setupForms();
    updateCartUI();
    animateStats();
    setupMobileMenu();
});

// ==========================================
// MENÚ MÓVIL
// ==========================================

function setupMobileMenu() {
    // Crear overlay para móvil
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    overlay.id = 'mobileOverlay';
    overlay.onclick = closeMobileMenu;
    document.body.appendChild(overlay);
}

function toggleMobileMenu() {
    const navButtons = document.getElementById('navButtons');
    const overlay = document.getElementById('mobileOverlay');
    
    navButtons.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Prevenir scroll del body cuando el menú está abierto
    if (navButtons.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

function closeMobileMenu() {
    const navButtons = document.getElementById('navButtons');
    const overlay = document.getElementById('mobileOverlay');
    
    navButtons.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ==========================================
// INDEX DB - BASE DE DATOS
// ==========================================

function initDB() {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
        console.error('Error al abrir la base de datos');
        showToast('Error al inicializar la base de datos', 'error');
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        checkCurrentUser();
    };

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        
        if (!db.objectStoreNames.contains('users')) {
            const userStore = db.createObjectStore('users', { keyPath: 'email' });
            userStore.createIndex('email', 'email', { unique: true });
        }
    };
}

// ==========================================
// FUNCIONES DE UTILIDAD
// ==========================================

function showToast(message, type = 'success') {
    Toastify({
        text: message,
        duration: 3000,
        gravity: 'top',
        position: 'right',
        stopOnFocus: true,
        style: {
            background: type === 'success' ? 
                'linear-gradient(to right, #00b09b, #96c93d)' : 
                'linear-gradient(to right, #ff5f6d, #ffc371)'
        }
    }).showToast();
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (pageId === 'payment') {
        updatePaymentSummary();
    }

    if (pageId === 'inventory') {
        updateProductCount();
    }
}

function encryptPassword(password) {
    return btoa(password);
}

function decryptPassword(encrypted) {
    return atob(encrypted);
}

function animateStats() {
    const productCount = document.getElementById('productCount');
    if (productCount) {
        productCount.textContent = products.length + '+';
    }
}

// ==========================================
// GESTIÓN DE USUARIOS
// ==========================================

function checkCurrentUser() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedUser();
    }
}

function updateUIForLoggedUser() {
    if (currentUser) {
        document.getElementById('userInfo').style.display = 'flex';
        const firstName = currentUser.name.split(' ')[0];
        const shortName = firstName.length > 10 ? firstName.substring(0, 10) + '...' : firstName;
        document.getElementById('userName').textContent = `Hola, ${shortName}`;
        document.getElementById('authBtn').innerHTML = '<span>🚪</span> Cerrar Sesión';
        document.getElementById('authBtn').onclick = logout;
    } else {
        document.getElementById('userInfo').style.display = 'none';
        document.getElementById('authBtn').innerHTML = '<span>🔐</span> Iniciar Sesión';
        document.getElementById('authBtn').onclick = () => { showPage('login'); closeMobileMenu(); };
    }
}

function logout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        cart = [];
        updateCartUI();
        updateUIForLoggedUser();
        showToast('Sesión cerrada correctamente');
        showPage('home');
    }
}

// ==========================================
// RENDERIZADO DE PRODUCTOS
// ==========================================

function renderFeaturedProducts() {
    const featuredProducts = products.slice(0, 8);
    renderProducts(featuredProducts, 'featuredProducts');
}

function renderAllProducts() {
    renderProducts(products, 'allProducts');
    updateProductCount();
}

function renderProducts(productsArray, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = productsArray.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-icon">${product.icon}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-category">${product.category}</div>
            <div class="product-description">${product.description}</div>
            <div class="product-price">$${product.price.toLocaleString('es-MX')}</div>
            <div class="product-stock">✓ En stock: ${product.stock} unidades</div>
            <div style="margin: 0.5rem 0;">
                ${'⭐'.repeat(Math.floor(product.rating))} ${product.rating}
            </div>
            <button class="btn btn-primary" onclick="addToCart(${product.id})">
                🛒 Agregar al Carrito
            </button>
            <button class="btn btn-secondary" onclick="showProductDetails(${product.id})">
                👁️ Ver Detalles
            </button>
            <button class="btn btn-secondary" onclick="contactAboutProduct(${product.id})">
                ✉️ Consultar
            </button>
        </div>
    `).join('');
}

// ==========================================
// MODAL DE DETALLES
// ==========================================

function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 6rem; margin-bottom: 1rem;">${product.icon}</div>
            <h2 style="color: #667eea; margin-bottom: 1rem;">${product.name}</h2>
            <div style="background: #f0f0f0; padding: 0.5rem 1rem; border-radius: 20px; display: inline-block; margin-bottom: 1rem;">
                ${product.category} • ${product.brand}
            </div>
            <div style="font-size: 1.2rem; margin: 1rem 0;">
                ${'⭐'.repeat(Math.floor(product.rating))} ${product.rating}/5.0
            </div>
            <div style="font-size: 2rem; color: #667eea; font-weight: bold; margin: 1.5rem 0;">
                $${product.price.toLocaleString('es-MX')} MXN
            </div>
            <p style="text-align: left; line-height: 1.8; margin: 2rem 0; color: #555;">
                ${product.description}
            </p>
            <div style="background: #f9f9f9; padding: 1.5rem; border-radius: 10px; margin: 1.5rem 0;">
                <h3 style="margin-bottom: 1rem; color: #333;">Especificaciones</h3>
                <div style="text-align: left;">
                    <p><strong>Marca:</strong> ${product.brand}</p>
                    <p><strong>Categoría:</strong> ${product.category}</p>
                    <p><strong>Disponibilidad:</strong> ${product.stock} unidades en stock</p>
                    <p><strong>Calificación:</strong> ${product.rating}/5.0 ⭐</p>
                    <p><strong>Envío:</strong> Gratis en compras mayores a $1,000</p>
                    <p><strong>Garantía:</strong> 1 año de garantía del fabricante</p>
                </div>
            </div>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 2rem;">
                <button class="btn btn-primary" onclick="addToCart(${product.id}); closeModal();">
                    🛒 Agregar al Carrito
                </button>
                <button class="btn btn-secondary" onclick="contactAboutProduct(${product.id}); closeModal();">
                    ✉️ Consultar
                </button>
                <button class="btn btn-secondary" onclick="closeModal()">
                    Cerrar
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target == modal) {
        closeModal();
    }
}

// ==========================================
// BÚSQUEDA CON AJAX
// ==========================================

function setupSearchFunctionality() {
    const homeSearch = document.getElementById('homeSearch');
    const inventorySearch = document.getElementById('inventorySearch');

    if (homeSearch) {
        homeSearch.addEventListener('input', (e) => {
            const query = e.target.value;
            searchProducts(query, 'featuredProducts', products.slice(0, 8));
        });
    }

    if (inventorySearch) {
        inventorySearch.addEventListener('input', (e) => {
            const query = e.target.value;
            let productsToSearch = products;
            
            if (currentCategory !== 'all') {
                productsToSearch = products.filter(p => p.category === currentCategory);
            }
            
            searchProducts(query, 'allProducts', productsToSearch);
        });
    }
}

function searchProducts(query, containerId, productsToSearch) {
    const filtered = productsToSearch.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
        document.getElementById(containerId).innerHTML = 
            '<div class="empty-message">❌ No se encontraron productos que coincidan con tu búsqueda</div>';
    } else {
        renderProducts(filtered, containerId);
    }
    
    updateProductCount(filtered.length);
}

// ==========================================
// FILTROS Y ORDENAMIENTO
// ==========================================

function filterByCategory(category) {
    currentCategory = category;
    showPage('inventory');
    setTimeout(() => {
        filterInventory(category);
    }, 100);
}

function filterInventory(category) {
    currentCategory = category;
    
    // Actualizar botones activos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    let filtered = products;
    if (category !== 'all') {
        filtered = products.filter(p => p.category === category);
    }
    
    renderProducts(filtered, 'allProducts');
    updateProductCount(filtered.length);
    
    // Limpiar búsqueda
    const searchInput = document.getElementById('inventorySearch');
    if (searchInput) searchInput.value = '';
}

function sortProducts(sortType) {
    let sorted = [...products];
    
    if (currentCategory !== 'all') {
        sorted = sorted.filter(p => p.category === currentCategory);
    }
    
    switch(sortType) {
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    
    renderProducts(sorted, 'allProducts');
    updateProductCount(sorted.length);
}

function updateProductCount(count = null) {
    const countElement = document.getElementById('productsCount');
    if (countElement) {
        const total = count !== null ? count : products.length;
        countElement.textContent = `Mostrando ${total} producto${total !== 1 ? 's' : ''}`;
    }
}

// ==========================================
// CARRITO DE COMPRAS
// ==========================================

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
            showToast(`${product.name} agregado al carrito (${existingItem.quantity})`);
        } else {
            showToast(`No hay más stock disponible de ${product.name}`, 'error');
            return;
        }
    } else {
        cart.push({ ...product, quantity: 1 });
        showToast(`${product.name} agregado al carrito`);
    }

    updateCartUI();
}

function removeFromCart(productId) {
    const product = cart.find(item => item.id === productId);
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    showToast(`${product.name} eliminado del carrito`);
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        const newQuantity = item.quantity + change;
        
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else if (newQuantity <= item.stock) {
            item.quantity = newQuantity;
            updateCartUI();
        } else {
            showToast(`Solo hay ${item.stock} unidades disponibles`, 'error');
        }
    }
}

function updateCartUI() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;

    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartActions = document.getElementById('cartActions');

    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-message">
                🛒 Tu carrito está vacío
                <br><br>
                <button class="btn btn-primary" onclick="showPage('inventory')">
                    Explorar Productos
                </button>
            </div>
        `;
        cartTotal.style.display = 'none';
        cartActions.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div style="font-size: 3rem; margin-bottom: 0.5rem;">${item.icon}</div>
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">
                        $${item.price.toLocaleString('es-MX')} MXN c/u
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)" ${item.quantity <= 1 ? 'style="opacity:0.5"' : ''}>
                            −
                        </button>
                        <span style="font-weight: bold; font-size: 1.1rem;">
                            Cantidad: ${item.quantity}
                        </span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)" ${item.quantity >= item.stock ? 'style="opacity:0.5"' : ''}>
                            +
                        </button>
                    </div>
                    <div style="margin-top: 1rem; font-weight: bold; color: #667eea; font-size: 1.2rem;">
                        Subtotal: $${(item.price * item.quantity).toLocaleString('es-MX')} MXN
                    </div>
                </div>
                <div class="cart-item-actions">
                    <button class="btn btn-danger" onclick="removeFromCart(${item.id})">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        `).join('');

        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal >= 1000 ? 0 : 150;
        const total = subtotal + shipping;
        
        cartTotal.innerHTML = `
            <div style="text-align: right;">
                <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">
                    Subtotal: $${subtotal.toLocaleString('es-MX')} MXN
                </div>
                <div style="font-size: 1rem; margin-bottom: 0.5rem; ${shipping === 0 ? 'color: #4CAF50;' : ''}">
                    Envío: ${shipping === 0 ? 'GRATIS 🎉' : '$' + shipping.toLocaleString('es-MX') + ' MXN'}
                </div>
                ${subtotal < 1000 && shipping > 0 ? `
                    <div style="font-size: 0.9rem; margin-bottom: 1rem; opacity: 0.8;">
                        Agrega $${(1000 - subtotal).toLocaleString('es-MX')} más para envío gratis
                    </div>
                ` : ''}
                <div style="font-size: 1.8rem; margin-top: 1rem; padding-top: 1rem; border-top: 2px solid rgba(255,255,255,0.3);">
                    Total: $${total.toLocaleString('es-MX')} MXN
                </div>
            </div>
        `;
        cartTotal.style.display = 'block';
        
        cartActions.innerHTML = `
            <button class="btn btn-primary btn-large" onclick="proceedToPayment()">
                💳 Proceder al Pago
            </button>
            <button class="btn btn-secondary btn-large" onclick="showPage('inventory')">
                🛍️ Seguir Comprando
            </button>
        `;
        cartActions.style.display = 'block';
    }
}

function proceedToPayment() {
    if (cart.length === 0) {
        showToast('Tu carrito está vacío', 'error');
        return;
    }
    
    if (!currentUser) {
        showToast('Debes iniciar sesión para continuar', 'error');
        setTimeout(() => showPage('login'), 1500);
        return;
    }
    
    showPage('payment');
}

// ==========================================
// CONTACTO
// ==========================================

function contactAboutProduct(productId) {
    const product = products.find(p => p.id === productId);
    contactProduct = product;
    document.getElementById('contactProduct').value = product.name;
    showPage('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// FORMULARIOS
// ==========================================

function setupForms() {
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('contactForm').addEventListener('submit', handleContact);
    document.getElementById('paymentForm').addEventListener('submit', handlePayment);
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const phone = document.getElementById('regPhone').value.trim();

    if (!name || !email || !password) {
        showToast('Todos los campos obligatorios deben estar llenos', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showToast('Las contraseñas no coinciden', 'error');
        return;
    }

    if (password.length < 8) {
        showToast('La contraseña debe tener al menos 8 caracteres', 'error');
        return;
    }

    const transaction = db.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');
    
    const user = {
        name: name,
        email: email,
        password: encryptPassword(password),
        phone: phone,
        createdAt: new Date().toISOString()
    };

    const request = store.add(user);

    request.onsuccess = () => {
        showToast('¡Registro exitoso! 🎉 Por favor inicia sesión');
        document.getElementById('registerForm').reset();
        setTimeout(() => showPage('login'), 2000);
    };

    request.onerror = () => {
        showToast('Este correo ya está registrado', 'error');
    };
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showToast('Por favor completa todos los campos', 'error');
        return;
    }

    const transaction = db.transaction(['users'], 'readonly');
    const store = transaction.objectStore('users');
    const request = store.get(email);

    request.onsuccess = () => {
        const user = request.result;
        
        if (!user) {
            showToast('Usuario no encontrado', 'error');
            return;
        }

        if (decryptPassword(user.password) !== password) {
            showToast('Contraseña incorrecta', 'error');
            return;
        }

        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateUIForLoggedUser();
        showToast(`¡Bienvenido de vuelta, ${user.name}! 👋`);
        document.getElementById('loginForm').reset();
        showPage('home');
    };

    request.onerror = () => {
        showToast('Error al verificar credenciales', 'error');
    };
}

function handleContact(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value;
    const product = document.getElementById('contactProduct').value;
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !subject || !message) {
        showToast('Por favor completa todos los campos obligatorios', 'error');
        return;
    }

    showToast('¡Mensaje enviado exitosamente! ✉️ Nos pondremos en contacto pronto.');
    document.getElementById('contactForm').reset();
    contactProduct = null;
    setTimeout(() => showPage('home'), 2000);
}

function handlePayment(e) {
    e.preventDefault();
    
    const cardName = document.getElementById('cardName').value.trim();
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const cardExpiry = document.getElementById('cardExpiry').value.trim();
    const cardCVV = document.getElementById('cardCVV').value.trim();
    const address = document.getElementById('shippingAddress').value.trim();

    if (!cardName || !cardNumber || !cardExpiry || !cardCVV || !address) {
        showToast('Por favor completa todos los campos', 'error');
        return;
    }

    if (cardNumber.length !== 16) {
        showToast('El número de tarjeta debe tener 16 dígitos', 'error');
        return;
    }

    if (cardCVV.length !== 3) {
        showToast('El CVV debe tener 3 dígitos', 'error');
        return;
    }

    showToast('¡Pedido realizado con éxito! 🎉 Recibirás un correo de confirmación.');
    
    cart = [];
    updateCartUI();
    document.getElementById('paymentForm').reset();
    
    setTimeout(() => showPage('home'), 2500);
}

function updatePaymentSummary() {
    const summary = document.getElementById('paymentSummary');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 1000 ? 0 : 150;
    const total = subtotal + shipping;
    
    summary.innerHTML = `
        <h3 style="margin-bottom: 1.5rem; color: #667eea;">📋 Resumen del Pedido</h3>
        ${cart.map(item => `
            <div class="payment-item">
                <span>${item.icon} ${item.name} x${item.quantity}</span>
                <span>$${(item.price * item.quantity).toLocaleString('es-MX')}</span>
            </div>
        `).join('')}
        <div class="payment-item" style="font-size: 1rem; font-weight: normal; color: #666;">
            <span>Subtotal</span>
            <span>$${subtotal.toLocaleString('es-MX')}</span>
        </div>
        <div class="payment-item" style="font-size: 1rem; font-weight: normal; color: ${shipping === 0 ? '#4CAF50' : '#666'};">
            <span>Envío</span>
            <span>${shipping === 0 ? 'GRATIS 🎉' : '$' + shipping.toLocaleString('es-MX')}</span>
        </div>
        <div class="payment-item">
            <span>Total a Pagar</span>
            <span>$${total.toLocaleString('es-MX')} MXN</span>
        </div>
        <div style="margin-top: 1.5rem; padding: 1rem; background: #f0f0ff; border-radius: 8px; font-size: 0.9rem; color: #666;">
            <p style="margin-bottom: 0.5rem;">✓ Pago 100% seguro</p>
            <p style="margin-bottom: 0.5rem;">✓ Envío en 3-5 días hábiles</p>
            <p>✓ Garantía de satisfacción</p>
        </div>
    `;
}