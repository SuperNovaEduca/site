// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Navigation smooth scrolling
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            // Only prevent default and smooth scroll for anchor links (starting with #)
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
            // For regular page links (like pages/proyectos.html), let the browser handle navigation normally
        });
    });

    // Hero buttons functionality
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.textContent.includes('Nuestro Trabajo')) {
                document.querySelector('#proyectos').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else if (this.textContent.includes('Comenzar Electrónica')) {
                document.querySelector('#tienda').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Cart toggle functionality
    const cartToggle = document.getElementById('cart-toggle');
    if (cartToggle) {
        cartToggle.addEventListener('click', function(e) {
            e.preventDefault();
            showCartModal();
        });
    }

    // Store functionality - only initialize if we're on the store page
    if (document.querySelector('.product-card')) {
        initializeStore();
    }
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            
            // Update toggle icon
            if (newTheme === 'dark') {
                themeToggle.textContent = '☀️';
                localStorage.setItem('theme', 'dark');
            } else {
                themeToggle.textContent = '🌙';
                localStorage.setItem('theme', 'light');
            }
            
            // Update navbar background immediately
            updateNavbarBackground();
        });
        
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        html.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'dark') {
            themeToggle.textContent = '☀️';
        } else {
            themeToggle.textContent = '🌙';
        }
    }

    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const currentTheme = html.getAttribute('data-theme') || 'dark';
        
        if (window.scrollY > 50) {
            if (currentTheme === 'light') {
                navbar.style.background = 'rgba(248, 250, 252, 0.98)';
            } else {
                navbar.style.background = 'rgba(15, 20, 25, 0.98)';
            }
        } else {
            if (currentTheme === 'light') {
                navbar.style.background = 'rgba(248, 250, 252, 0.95)';
            } else {
                navbar.style.background = 'rgba(15, 20, 25, 0.95)';
            }
        }
    });
    
    // Update navbar background when theme changes
    function updateNavbarBackground() {
        const navbar = document.querySelector('.navbar');
        const currentTheme = html.getAttribute('data-theme') || 'dark';
        
        if (window.scrollY > 50) {
            if (currentTheme === 'light') {
                navbar.style.background = 'rgba(248, 250, 252, 0.98)';
            } else {
                navbar.style.background = 'rgba(15, 20, 25, 0.98)';
            }
        } else {
            if (currentTheme === 'light') {
                navbar.style.background = 'rgba(248, 250, 252, 0.95)';
            } else {
                navbar.style.background = 'rgba(15, 20, 25, 0.95)';
            }
        }
    }
});

// Store functionality
const products = [
    { name: 'Arduino Uno R3', category: 'Placas de Desarrollo', price: 185000, available: true },
    { name: 'Raspberry Pi 4 Model B (4GB)', category: 'Placas de Desarrollo', price: 410000, available: true },
    { name: 'Arduino Nano', category: 'Placas de Desarrollo', price: 120000, available: true },
    { name: 'Sensor HC-SR04', category: 'Sensores', price: 30000, available: true },
    { name: 'Sensor de Temperatura DHT22', category: 'Sensores', price: 45000, available: true },
    { name: 'Sensor de Movimiento PIR', category: 'Sensores', price: 25000, available: true },
    { name: 'Servomotor SG90', category: 'Actuadores', price: 35000, available: true },
    { name: 'Motor DC con Caja Reductora', category: 'Actuadores', price: 55000, available: true },
    { name: 'Relé 5V', category: 'Actuadores', price: 15000, available: true },
    { name: 'Kit de Inicio de Electrónica', category: 'Kits y Packs', price: 375000, available: false },
    { name: 'Kit Robótica Básica', category: 'Kits y Packs', price: 450000, available: true },
    { name: 'Kit Sensores Avanzados', category: 'Kits y Packs', price: 280000, available: true }
];

// Shopping cart
let cart = JSON.parse(localStorage.getItem('supernovaCart')) || [];

// Pagination variables
let currentPage = 1;
const productsPerPage = 6;
let filteredProducts = [];
let productCards = [];

// DOM elements (global references)
let searchInput, sortSelect, priceSlider, filterCheckboxes;
    
    function initializeStore() {
        // Initialize cart from localStorage
        cart = JSON.parse(localStorage.getItem('supernovaCart')) || [];
        
        // Initialize product cards first
        productCards = Array.from(document.querySelectorAll('.product-card'));
        
        // Initialize cart display
        updateCartDisplay();
        
        // Initialize pagination
        initializePagination();
        
        // Get DOM elements
        const searchInput = document.getElementById('searchInput');
        const sortSelect = document.getElementById('sortBy');
        const categoryCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="category-"]');
        const availabilityCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="availability-"]');
        const priceSlider = document.getElementById('priceRange');
        const resetButton = document.querySelector('.filter-reset');
        const applyButton = document.querySelector('.filter-apply');
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        
        // Add event listeners
        if (searchInput) {
            searchInput.addEventListener('input', debounce(filterProducts, 300));
        }
        
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                sortProducts(e.target.value);
            });
        }
        
        // Category and availability filters - only apply on button click
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                // Don't auto-filter, wait for apply button
            });
        });
        
        availabilityCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                // Don't auto-filter, wait for apply button
            });
        });
        
        if (priceSlider) {
            // Set initial values for price slider
            priceSlider.min = 0;
            priceSlider.max = 1000000;
            priceSlider.value = 1000000;
            
            priceSlider.addEventListener('input', (e) => {
                updatePriceLabels(e.target.value);
                // Don't auto-filter, wait for apply button
            });
            updatePriceLabels(priceSlider.value);
        }
        
        if (applyButton) {
            applyButton.addEventListener('click', filterProducts);
        }
        
        if (resetButton) {
            resetButton.addEventListener('click', resetFilters);
        }
        
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const productCard = this.closest('.product-card');
                const isSoldOut = productCard.classList.contains('sold-out');
                
                if (isSoldOut) {
                    // Open WhatsApp for sold out products
                    const productTitle = productCard.querySelector('.product-title').textContent;
                    const message = `Hola, estoy interesado en el producto "${productTitle}" que aparece como agotado. ¿Cuándo estará disponible?`;
                    const whatsappUrl = `https://wa.me/595984529505?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                } else {
                    // Add to cart for available products
                    const productTitle = productCard.querySelector('.product-title').textContent;
                    const productPrice = productCard.querySelector('.product-price').textContent;
                    const productImage = productCard.querySelector('.product-image img').src;
                    
                    const priceValue = parseInt(productPrice.replace(/[^0-9]/g, ''));
                    addToCart(productTitle, priceValue);
                    showNotification('Producto añadido al carrito');
                }
            });
        });
    }

    function filterProducts() {
        const searchInput = document.getElementById('searchInput');
        const priceSlider = document.getElementById('priceRange');
        
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const maxPrice = priceSlider ? parseInt(priceSlider.value) : 1000000;
        
        // Get selected categories using data attributes
        const categoryCheckboxes = [
            { id: "category-placas", value: "Placas de Desarrollo" },
            { id: "category-sensores", value: "Sensores" },
            { id: "category-actuadores", value: "Actuadores" },
            { id: "category-displays", value: "Displays" },
            { id: "category-modulos", value: "Módulos" },
            { id: "category-kits", value: "Kits y Packs" },
            { id: "category-accesorios", value: "Accesorios" }
        ];
        
        const selectedCategories = categoryCheckboxes
            .filter(cb => document.getElementById(cb.id)?.checked)
            .map(cb => cb.value);
        
        const showAllCategories = document.getElementById("category-all")?.checked;
        const showStock = document.getElementById("availability-stock")?.checked;
        const showOutStock = document.getElementById("availability-out")?.checked;
        
        console.log('Filtering with:', { searchTerm, maxPrice, selectedCategories, showAllCategories, showStock, showOutStock });
        
        // Show/hide products based on filters
        productCards.forEach(card => {
            const title = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.product-description')?.textContent.toLowerCase() || '';
            
            // Use data attributes for reliable filtering
            const productCategory = card.dataset.category;
            const productPrice = parseInt(card.dataset.price, 10);
            const productAvailable = card.dataset.available === "true";

            let shouldShow = true;

            // Enhanced search filter - search in title and description
            if (searchTerm && !title.includes(searchTerm) && !description.includes(searchTerm)) {
                shouldShow = false;
            }

            // Category filter
            if (!showAllCategories && selectedCategories.length > 0 && !selectedCategories.includes(productCategory)) {
                shouldShow = false;
            }

            // Price filter
            if (productPrice > maxPrice) {
                shouldShow = false;
            }

            // Availability filter
            if (!showStock && productAvailable) {
                shouldShow = false;
            }
            if (!showOutStock && !productAvailable) {
                shouldShow = false;
            }

            // Show or hide the product card
            card.style.display = shouldShow ? 'block' : 'none';
        });
        
        // Check if any products are visible and show/hide no results message
        const visibleProducts = productCards.filter(card => card.style.display !== 'none');
        showNoResultsMessage(visibleProducts.length === 0);
    }
    
    function getCategoryFromTitle(title) {
        if (title?.includes('Placas de Desarrollo')) return 'Placas de Desarrollo';
        if (title?.includes('Sensores')) return 'Sensores';
        if (title?.includes('Actuadores')) return 'Actuadores';
        if (title?.includes('Kits y Packs')) return 'Kits y Packs';
        return '';
    }



    
    function showNoResultsMessage(show) {
        let noResultsDiv = document.getElementById('no-results-message');
        
        if (show) {
            if (!noResultsDiv) {
                noResultsDiv = document.createElement('div');
                noResultsDiv.id = 'no-results-message';
                noResultsDiv.style.cssText = `
                    text-align: center;
                    padding: 3rem 2rem;
                    color: var(--text-secondary);
                    grid-column: 1 / -1;
                `;
                
                noResultsDiv.innerHTML = `
                    <svg width="120" height="120" viewBox="0 0 120 120" style="margin-bottom: 1rem; opacity: 0.6;">
                        <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M40 50 Q60 30 80 50 Q60 70 40 50" fill="none" stroke="currentColor" stroke-width="2"/>
                        <circle cx="45" cy="45" r="3" fill="currentColor"/>
                        <circle cx="75" cy="45" r="3" fill="currentColor"/>
                        <path d="M45 75 Q60 85 75 75" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <h3 style="margin: 0 0 0.5rem 0; color: var(--text-color);">No se encontraron productos que coincidan con tus filtros.</h3>
                    <p style="margin: 0 0 1.5rem 0;">¿No encuentras lo que buscas?</p>
                    <button onclick="window.open('https://wa.me/595984529505?text=${encodeURIComponent('Hola, no encuentro el producto que busco en la tienda. ¿Podrían ayudarme?')}', '_blank')" style="background: #25D366; color: white; border: none; border-radius: 8px; padding: 12px 24px; font-size: 1rem; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; gap: 8px;">📱 Solicitar cotización por WhatsApp</button>
                `;
                
                const productsGrid = document.querySelector('.products-grid');
                if (productsGrid) {
                    productsGrid.appendChild(noResultsDiv);
                }
            }
            noResultsDiv.style.display = 'block';
        } else {
            if (noResultsDiv) {
                noResultsDiv.style.display = 'none';
            }
        }
    }
    
    function showCartModal() {
        // Create cart modal
        const modal = document.createElement('div');
        modal.className = 'cart-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: var(--card-bg);
            border-radius: 12px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            border: 1px solid var(--border-color);
        `;
        
        let cartHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="color: var(--text-color); margin: 0;">Carrito de Compras</h2>
                <button class="close-cart" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-color);">✕</button>
            </div>
        `;
        
        if (cart.length === 0) {
            cartHTML += `<p style="color: var(--text-secondary); text-align: center;">Tu carrito está vacío</p>`;
        } else {
            let total = 0;
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                cartHTML += `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--border-color);">
                        <div>
                            <h4 style="color: var(--text-color); margin: 0 0 0.5rem 0; font-size: 1rem;">${item.title}</h4>
                            <p style="color: var(--text-secondary); margin: 0; font-size: 0.9rem;">₲${item.price.toLocaleString()} x ${item.quantity}</p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <button onclick="changeQuantity(${index}, -1)" style="background: var(--border-color); border: none; border-radius: 4px; width: 30px; height: 30px; cursor: pointer; color: var(--text-color);">-</button>
                            <span style="color: var(--text-color); min-width: 20px; text-align: center;">${item.quantity}</span>
                            <button onclick="changeQuantity(${index}, 1)" style="background: var(--primary-color); border: none; border-radius: 4px; width: 30px; height: 30px; cursor: pointer; color: white;">+</button>
                            <button onclick="removeFromCart(${index})" style="background: #e53e3e; border: none; border-radius: 4px; width: 30px; height: 30px; cursor: pointer; color: white; margin-left: 0.5rem;">🗑️</button>
                        </div>
                    </div>
                `;
            });
            
            cartHTML += `
                <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 2px solid var(--border-color);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3 style="color: var(--text-color); margin: 0;">Total: ₲${total.toLocaleString()}</h3>
                    </div>
                    <button onclick="checkout()" style="width: 100%; background: var(--primary-color); color: white; border: none; border-radius: 8px; padding: 1rem; font-size: 1rem; cursor: pointer; font-weight: 600;">Hacer Pedido</button>
                </div>
            `;
        }
        
        modalContent.innerHTML = cartHTML;
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Close modal events
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        modalContent.querySelector('.close-cart').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }
    
    window.changeQuantity = function(index, change) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        localStorage.setItem('supernovaCart', JSON.stringify(cart));
        updateCartDisplay();
        // Refresh modal
        document.querySelector('.cart-modal').remove();
        showCartModal();
    }
    
    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        localStorage.setItem('supernovaCart', JSON.stringify(cart));
        updateCartDisplay();
        // Refresh modal
        document.querySelector('.cart-modal').remove();
        showCartModal();
    }
    
    window.checkout = function() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Create detailed product list
        const cartItems = cart.map((item, index) => {
            const subtotal = item.price * item.quantity;
            return `${index + 1}. ${item.title}\n   Cantidad: ${item.quantity}\n   Precio unitario: ₲${item.price.toLocaleString()}\n   Subtotal: ₲${subtotal.toLocaleString()}`;
        }).join('\n\n');
        
        const message = `🛒 *PEDIDO SUPERNOVA EDUCACIÓN*\n\n📋 *PRODUCTOS SOLICITADOS:*\n\n${cartItems}\n\n💰 *TOTAL A PAGAR: ₲${total.toLocaleString()}*\n\n¿Podrían confirmar la disponibilidad de estos productos y el proceso de pago? ¡Gracias!`;
        
        window.open(`https://wa.me/595984529505?text=${encodeURIComponent(message)}`, '_blank');
    }

    function sortProducts(sortBy) {
        console.log('Sorting by:', sortBy);
        
        // Get the products grid container
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;
        
        // Get all product cards and convert to array
        const allProducts = Array.from(productsGrid.querySelectorAll('.product-card'));
        
        // Sort the products array
        allProducts.sort((a, b) => {
            const priceA = parseInt(a.querySelector('.product-price').textContent.replace(/[^0-9]/g, ''));
            const priceB = parseInt(b.querySelector('.product-price').textContent.replace(/[^0-9]/g, ''));
            const titleA = a.querySelector('.product-title').textContent;
            const titleB = b.querySelector('.product-title').textContent;

            switch (sortBy) {
                case 'Precio: Menor a Mayor':
                    return priceA - priceB;
                case 'Precio: Mayor a Menor':
                    return priceB - priceA;
                case 'Más Nuevos':
                    return titleA.localeCompare(titleB);
                default: // Relevancia
                    return 0;
            }
        });

        // Clear the grid and re-append sorted products
        productsGrid.innerHTML = '';
        allProducts.forEach(product => {
            productsGrid.appendChild(product);
        });
        
        // Update the productCards array to reflect new order
        productCards = allProducts;
        
        // Re-apply current filters after sorting
        filterProducts();
    }

    function updatePriceLabels(value) {
        const priceLabels = document.querySelector('.price-labels');
        if (priceLabels && value !== undefined && value !== null) {
            const maxPrice = parseInt(value) || 1000000;
            priceLabels.innerHTML = `
                <span>₲0</span>
                <span>₲${maxPrice.toLocaleString()}</span>
            `;
        }
    }

    function resetFilters() {
        console.log('Resetting filters');
        
        // Reset search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';
        
        // Reset sort
        const sortSelect = document.getElementById('sortBy');
        if (sortSelect) sortSelect.value = 'relevance';
        
        // Reset checkboxes - check "Todos" and availability, uncheck others
        const allCheckbox = document.getElementById('category-all');
        if (allCheckbox) allCheckbox.checked = true;
        
        const categoryCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="category-"]:not(#category-all)');
        categoryCheckboxes.forEach(cb => cb.checked = false);
        
        const stockCheckbox = document.getElementById('availability-stock');
        const outCheckbox = document.getElementById('availability-out');
        if (stockCheckbox) stockCheckbox.checked = true;
        if (outCheckbox) outCheckbox.checked = true;
        
        // Reset price slider
        const priceSlider = document.getElementById('priceRange');
        if (priceSlider) {
            priceSlider.value = 1000000;
            updatePriceLabels(1000000);
        }
        
        // Apply filters to show all products
        filterProducts();
        
        console.log('Filters reset complete');
    }

    function addToCart(title, price) {
        const existingItem = cart.find(item => item.title === title);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ title, price, quantity: 1 });
        }
        
        localStorage.setItem('supernovaCart', JSON.stringify(cart));
        updateCartDisplay();
    }

    // Product preview functionality
    function showProductPreview(productCard) {
        const modal = document.getElementById('product-modal');
        const title = productCard.querySelector('.product-title').textContent;
        const category = productCard.querySelector('.product-category').textContent;
        const price = productCard.querySelector('.product-price').textContent;
        const description = productCard.querySelector('.product-description')?.textContent || 'Descripción no disponible.';
        const image = productCard.querySelector('.product-image img');
        
        document.getElementById('modal-product-title').textContent = title;
        document.getElementById('modal-product-category').textContent = category;
        document.getElementById('modal-product-price').textContent = price;
        document.getElementById('modal-product-description').textContent = description;
        
        const modalImage = document.getElementById('modal-product-image');
        if (image && image.style.display !== 'none') {
            modalImage.src = image.src;
            modalImage.alt = image.alt;
        } else {
            modalImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+MzAwIMOXIDMwMDwvdGV4dD4KPC9zdmc+';
            modalImage.alt = 'Imagen no disponible';
        }
        
        // Set up add to cart button for modal
        const modalAddToCartBtn = document.getElementById('modal-add-to-cart');
        modalAddToCartBtn.onclick = () => {
            const priceValue = parseInt(price.replace(/[^0-9]/g, ''));
            addToCart(title, priceValue);
            modal.style.display = 'none';
        };
        
        modal.style.display = 'block';
    }

    function updateCartDisplay() {
        // Update existing cart counter in navbar (from HTML)
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: #4f9cf9;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 1001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.project-card, .team-member, .product-card, .achievement-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Mobile menu toggle (for future implementation)
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('mobile-active');
}

// Utility function to format currency
function formatCurrency(amount) {
    return `₲${amount.toLocaleString()}`;
}

// Utility function to debounce search input
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

// Pagination functions
function initializePagination() {
    filteredProducts = Array.from(productCards);
    displayProducts();
    updatePagination();
}

function displayProducts() {
        // Hide all products first
        productCards.forEach(card => {
            card.style.display = 'none';
        });
        
        // Calculate pagination
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const productsToShow = filteredProducts.slice(startIndex, endIndex);
        
        // Show products for current page
        productsToShow.forEach(card => {
            card.style.display = 'block';
        });
    }
    
function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    // Remove existing pagination
    const existingPagination = document.querySelector('.pagination');
    if (existingPagination) {
        existingPagination.remove();
    }
    
    // Don't show pagination if only one page or no products
    if (totalPages <= 1) {
        return;
    }
        
    // Create pagination container
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination';
    paginationContainer.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin-top: 30px;
        padding: 20px;
    `;
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '← Anterior';
    prevBtn.className = 'pagination-btn';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            displayProducts();
            updatePagination();
        }
    };
        
    // Page numbers
    const pageNumbers = document.createElement('div');
    pageNumbers.className = 'page-numbers';
    pageNumbers.style.cssText = `
        display: flex;
        gap: 5px;
        align-items: center;
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.onclick = () => {
            currentPage = i;
            displayProducts();
            updatePagination();
        };
        pageNumbers.appendChild(pageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Siguiente →';
    nextBtn.className = 'pagination-btn';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayProducts();
            updatePagination();
        }
    };
    
    // Add elements to pagination container
    paginationContainer.appendChild(prevBtn);
    paginationContainer.appendChild(pageNumbers);
    paginationContainer.appendChild(nextBtn);
    
    // Add pagination to products container
    const productsContainer = document.querySelector('.products-container');
    if (productsContainer) {
        productsContainer.appendChild(paginationContainer);
    }
}