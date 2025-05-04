// load cart
async function loadCartComponent() {
    try {
        const response = await fetch('cart-component.html');
        const html = await response.text();
        
        // create cart container
        const cartContainer = document.createElement('div');
        cartContainer.innerHTML = html;
        document.body.appendChild(cartContainer);

        // initialize cart
        initializeCart();
    } catch (error) {
        console.error('Error loading cart component:', error);
    }
}

// cart function
function initializeCart() {
    const cartToggle = document.getElementById('cart-toggle');
    const cartOverlay = document.getElementById('cart-overlay');
    const backgroundOverlay = document.getElementById('background-overlay');
    const continueShopping = document.getElementById('continue-shopping-header');
    const cartNotification = document.getElementById('cart-notification');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartDisplay();

    // shop visibility , cart opened
    cartToggle.addEventListener('click', () => {
        cartOverlay.classList.toggle('translate-x-full');
        backgroundOverlay.classList.toggle('hidden');
    });

    // close, when clicked outside
    backgroundOverlay.addEventListener('click', () => {
        cartOverlay.classList.add('translate-x-full');
        backgroundOverlay.classList.add('hidden');
    });

    // continue shopping
    continueShopping.addEventListener('click', () => {
        cartOverlay.classList.add('translate-x-full');
        backgroundOverlay.classList.add('hidden');
    });

    // add to cart
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const bookItem = e.target.closest('.book-item');
            const bookData = {
                id: bookItem.dataset.id,
                title: bookItem.dataset.title,
                author: bookItem.dataset.author,
                price: parseFloat(bookItem.dataset.price),
                originalPrice: bookItem.dataset.originalPrice ? parseFloat(bookItem.dataset.originalPrice) : null,
                imageSrc: bookItem.dataset.imageSrc,
                quantity: 1
            };

            addToCart(bookData);
            showNotification(bookData);
        }
    });
}

// add item to cart
function addToCart(bookData) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === bookData.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push(bookData);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// show notification when item is added
function showNotification(bookData) {
    const notification = document.getElementById('cart-notification');
    const notificationImage = document.getElementById('notification-image');
    const notificationText = document.getElementById('notification-text');

    notificationImage.src = bookData.imageSrc;
    notificationText.textContent = `${bookData.title} added to cart!`;

    notification.classList.remove('hidden');
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// update cart display
function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cart-items');
    const cartItemCount = document.getElementById('cart-item-count');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    const template = document.getElementById('cart-item-template');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-gray-500">Your cart is empty.</p>';
        cartItemCount.textContent = '0 Items';
        cartSubtotal.textContent = '₱ 0.00';
        cartTotal.textContent = '₱ 0.00';
        return;
    }

    let subtotal = 0;
    cartItems.innerHTML = '';

    cart.forEach(item => {
        const price = item.price * item.quantity;
        subtotal += price;

        const cartItem = template.content.cloneNode(true);
        const itemElement = cartItem.querySelector('.cart-item');
        
        itemElement.dataset.id = item.id;
        itemElement.querySelector('img').src = item.imageSrc;
        itemElement.querySelector('img').alt = item.title;
        itemElement.querySelector('p').textContent = item.author;
        itemElement.querySelector('h3').textContent = item.title;
        itemElement.querySelector('input[type="text"]').value = item.quantity;
        itemElement.querySelector('.font-medium.text-lg').textContent = `₱ ${formatPrice(price)}`;
        
        if (item.originalPrice) {
            const originalPrice = item.originalPrice * item.quantity;
            itemElement.querySelector('.line-through').textContent = `₱ ${formatPrice(originalPrice)}`;
        }

        cartItems.appendChild(itemElement);
    });

    cartItemCount.textContent = `${cart.length} Item${cart.length !== 1 ? 's' : ''}`;
    cartSubtotal.textContent = `₱ ${formatPrice(subtotal)}`;
    cartTotal.textContent = `₱ ${formatPrice(subtotal)}`;
}

// update item quantity
function updateQuantity(id, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (newQuantity < 1) {
        cart = cart.filter(item => item.id !== id);
    } else {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity = newQuantity;
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// format price
function formatPrice(price) {
    return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// load cart component
document.addEventListener('DOMContentLoaded', loadCartComponent);

// update quantity (for all files)
window.updateQuantity = updateQuantity; 