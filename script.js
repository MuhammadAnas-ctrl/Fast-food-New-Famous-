// ==========================================
// 1. DATA ARRAY (With Stable Image Links)
// ==========================================
const ArrProducts = [
  // --- B.B.Q ---
  { id: 1, category: "B.B.Q", name: "Chicken Tikka (Chest)", price: 450, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500" },
  { id: 2, category: "B.B.Q", name: "Chicken Tikka (Leg)", price: 400, image: "https://images.unsplash.com/photo-1632778149975-420e0e75ee08?w=500" },
  { id: 5, category: "B.B.Q", name: "Chicken Malai Boti", price: 700, image: "https://images.unsplash.com/photo-1606491956689-2ea8c5369511?w=500" },

  // --- ROLLS ---
  { id: 14, category: "Rolls", name: "Chicken Roll", price: 220, image: "https://images.unsplash.com/photo-1626700051175-656a433b915d?w=500" },
  { id: 15, category: "Rolls", name: "Chicken Zinger Roll", price: 350, image: "https://images.unsplash.com/photo-1662116765994-1e0e00c67089?w=500" },

  // --- BURGERS ---
  { id: 31, category: "Burger", name: "Zinger Burger", price: 400, image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500" },
  { id: 32, category: "Burger", name: "Zinger Cheese Burger", price: 450, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500" },

  // --- PIZZA (Sizes Object) ---
  { id: 37, category: "Pizza", name: "Chicken Tikka Pizza", price: { small: 400, medium: 700, large: 999 }, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500" },
  { id: 38, category: "Pizza", name: "Kabab Hunter Pizza", price: { small: 400, medium: 800, large: 1199 }, image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500" },

  // --- SIDES ---
  { id: 43, category: "SIDES", name: "French Fries", price: 100, image: "https://images.unsplash.com/photo-1630384066252-11e1f1582231?w=500" }
];

// Initialize Cart as Object for Size Support
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};

// ==========================================
// 2. DISPLAY PRODUCTS
// ==========================================
function displayProducts(itemsToDisplay) {
    const productsContainer = document.getElementById('productsContainer');
    if (!productsContainer) return;
    productsContainer.innerHTML = ""; 

    const categories = [...new Set(itemsToDisplay.map(item => item.category))];

    categories.forEach(cat => {
        // Add Category Header
        let header = document.createElement("h2");
        header.classList.add("category-header");
        header.innerHTML = cat;
        header.style.gridColumn = "1 / -1";
        productsContainer.appendChild(header);

        const categoryItems = itemsToDisplay.filter(item => item.category === cat);
        
        categoryItems.forEach((item) => {
            let originalIndex = ArrProducts.findIndex(p => p.id === item.id);
            let div = document.createElement("div");
            div.classList.add("item");

            // Display "Starting from" price for pizzas
            let priceDisplay = typeof item.price === 'object' 
                ? `Starts at ${item.price.small} Rs` 
                : `${item.price} Rs`;

            div.innerHTML = `
                <img src="${item.image}" alt="${item.name}"/>
                <div class="name">${item.name}</div>
                <div class="price">${priceDisplay}</div>
                <button onClick="addtoCart(${originalIndex})"><i class="fa fa-cart-plus"></i> Add to Cart</button>
            `;
            productsContainer.appendChild(div);
        });
    });
}

// ==========================================
// 3. CART & MODAL LOGIC
// ==========================================
function addtoCart(index) {
    const item = ArrProducts[index];
    if (typeof item.price === 'object') {
        showSizeModal(index);
    } else {
        confirmAddToCart(index, item.price, 'Standard');
    }
}

function showSizeModal(index) {
    const item = ArrProducts[index];
    const modal = document.getElementById('sizeModal');
    const optionsContainer = document.getElementById('sizeOptions');
    const nameLabel = document.getElementById('modalItemName');

    nameLabel.innerText = item.name;
    optionsContainer.innerHTML = ""; 

    for (let size in item.price) {
        let btn = document.createElement("button");
        btn.classList.add("size-btn");
        btn.innerText = `${size.toUpperCase()} - ${item.price[size]} Rs`;
        btn.onclick = () => {
            confirmAddToCart(index, item.price[size], size);
            closeModal();
        };
        optionsContainer.appendChild(btn);
    }
    modal.style.display = "flex";
}

function confirmAddToCart(index, price, size) {
    // Fresh read from storage
    cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};
    
    let cartKey = index + "_" + size;

    if (cartItems[cartKey]) {
        cartItems[cartKey].quantity += 1;
    } else {
        cartItems[cartKey] = { 
            ...ArrProducts[index], 
            quantity: 1, 
            price: price, 
            selectedSize: size 
        };
    }
    
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartCount();
}

function updateCartCount() {
    const countElement = document.getElementById('cartCount');
    if (!countElement) return;
    
    let totalCount = 0;
    Object.keys(cartItems).forEach(key => {
        totalCount += cartItems[key].quantity;
    });
    countElement.innerText = totalCount;
}

function closeModal() {
    document.getElementById('sizeModal').style.display = "none";
}

// ==========================================
// 4. SEARCH & FILTERS
// ==========================================
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = ArrProducts.filter(p => 
            p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)
        );
        displayProducts(filtered);
    });
}

function setupCategoryFilters() {
    const filterContainer = document.getElementById('categoryFilter');
    if (!filterContainer) return;

    const cats = ['All', ...new Set(ArrProducts.map(p => p.category))];
    filterContainer.innerHTML = cats.map(cat => `
        <button class="filter-btn" onclick="filterBy('${cat}')">${cat}</button>
    `).join('');
}

function filterBy(cat) {
    const filtered = (cat === 'All') ? ArrProducts : ArrProducts.filter(p => p.category === cat);
    displayProducts(filtered);
}

// ==========================================
// 5. INIT
// ==========================================
function init() {
    displayProducts(ArrProducts);
    setupCategoryFilters();
    updateCartCount();
}

window.onload = init;
