// Products Data
const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        rating: 4,
        category: "Electronics"
    },
    {
        id: 2,
        name: "Smart Watch with Fitness Tracker",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w-300&q=80",
        rating: 5,
        category: "Electronics"
    },
    {
        id: 3,
        name: "Gaming Laptop - 16GB RAM, 1TB SSD",
        price: 1299.99,
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        rating: 4,
        category: "Electronics"
    },
    {
        id: 4,
        name: "Designer Leather Handbag",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        rating: 4,
        category: "Fashion"
    },
    {
        id: 5,
        name: "Professional Camera Kit",
        price: 899.99,
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        rating: 5,
        category: "Electronics"
    },
    {
        id: 6,
        name: "Modern Coffee Table",
        price: 249.99,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        rating: 4,
        category: "Home"
    },
    {
        id: 7,
        name: "Best Selling Novel - 2023 Edition",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        rating: 4,
        category: "Books"
    },
    {
        id: 8,
        name: "Wireless Gaming Mouse",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        rating: 4,
        category: "Electronics"
    }
];

// Shopping Cart
let cart = JSON.parse(localStorage.getItem('amazonCart')) || [];
let currentSlide = 0;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
    updateCartCount();
    setupEventListeners();
    startSlider();
});

// Display products on the page
function displayProducts() {
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    ${getStarRating(product.rating)}
                    <span>(${Math.floor(Math.random() * 1000) + 100})</span>
                </div>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Get star rating HTML
function getStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Shopping Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartCount();
    saveCart();
    showNotification('Item added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    updateCartModal();
    saveCart();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;
}

function updateCartModal() {
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.getElementById('cart-total-amount');
    let total = 0;
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toFixed(2);
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            updateCartModal();
            saveCart();
        }
    }
}

// Cart Modal Functions
function toggleCartModal() {
    const cartModal = document.querySelector('.cart-modal');
    if (cartModal.style.display === 'block') {
        cartModal.style.display = 'none';
    } else {
        updateCartModal();
        cartModal.style.display = 'block';
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Cart click
    document.querySelector('.cart').addEventListener('click', toggleCartModal);
    
    // Close cart modal
    document.querySelector('.close-cart').addEventListener('click', () => {
        document.querySelector('.cart-modal').style.display = 'none';
    });
    
    // Close modal when clicking outside
    document.querySelector('.cart-modal').addEventListener('click', (e) => {
        if (e.target.classList.contains('cart-modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Checkout button
    document.querySelector('.checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert(`Thank you for your order! Total: $${calculateTotal().toFixed(2)}`);
        cart = [];
        updateCartCount();
        updateCartModal();
        saveCart();
        document.querySelector('.cart-modal').style.display = 'none';
    });
    
    // Search functionality
    document.querySelector('.search-button').addEventListener('click', searchProducts);
    document.querySelector('.search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });
}

function searchProducts() {
    const searchTerm = document.querySelector('.search-input').value.toLowerCase();
    const category = document.querySelector('.search-category').value;
    const productsGrid = document.querySelector('.products-grid');
    
    productsGrid.innerHTML = '';
    
    let filteredProducts = products;
    
    if (category !== 'All') {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p class="no-results">No products found. Try a different search.</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    ${getStarRating(product.rating)}
                    <span>(${Math.floor(Math.random() * 1000) + 100})</span>
                </div>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Slider Functions
function startSlider() {
    setInterval(() => {
        currentSlide = (currentSlide + 1) % 2;
        updateSlider();
    }, 5000);
}

function updateSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Dot click handlers
document.querySelectorAll('.dot').forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        updateSlider();
    });
});

// Utility Functions
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #232f3e;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notifications
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
    
    .no-results, .empty-cart {
        text-align: center;
        grid-column: 1 / -1;
        padding: 40px;
        color: #666;
    }
`;
document.head.appendChild(style);

function saveCart() {
    localStorage.setItem('amazonCart', JSON.stringify(cart));
}