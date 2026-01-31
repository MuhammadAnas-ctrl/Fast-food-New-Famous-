// ==========================================
// 1. DATA ARRAY (ArrProducts)
// ==========================================
const ArrProducts = [
  // --- B.B.Q ---
  { id: 1, category: "B.B.Q", name: "Chicken Tikka (Chest)", price: 450, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=500" },
  { id: 2, category: "B.B.Q", name: "Chicken Tikka (Leg)", price: 400, image: "https://images.unsplash.com/photo-1632778149975-420e0e75ee08?auto=format&fit=crop&w=500" },
  { id: 3, category: "B.B.Q", name: "Green Tikka (Chest)", price: 520, image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=500" },

  // --- ROLLS ---
  { id: 14, category: "Rolls", name: "Chicken Roll", price: 220, image: "https://images.unsplash.com/photo-1626700051175-656a433b915d?auto=format&fit=crop&w=500" },
  { id: 15, category: "Rolls", name: "Chicken Zinger Roll", price: 350, image: "https://images.unsplash.com/photo-1662116765994-1e0e00c67089?auto=format&fit=crop&w=500" },

  // --- BURGERS ---
  { id: 31, category: "Burger", name: "Zinger Burger", price: 400, image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=500" },
  { id: 32, category: "Burger", name: "Zinger Cheese Burger", price: 450, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=500" },

  // --- PIZZA ---
  { id: 37, category: "Pizza", name: "Chicken Tikka Pizza", price: { small: 400, medium: 700, large: 999 }, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500" },

  // --- SIDES ---
  { id: 43, category: "SIDES", name: "French Fries", price: 100, image: "https://images.unsplash.com/photo-1630384066252-11e1f1582231?auto=format&fit=crop&w=500" }
];

// ==========================================
// 2. SELECTORS
// ==========================================
const body = document.querySelector("body"),
  productsContainer = document.querySelector(".products"),
  shoppingBasket = document.querySelector(".shoppingBasket"),
  closeCart = document.querySelector(".close"),
  productList = document.querySelector(".productList"),
  quantity = document.querySelector(".quantity"),
  total = document.querySelector(".total"),
  checkk = document.querySelector(".checkk"),
  searchInput = document.querySelector(".search-input");

// --- FIX 1: Initialize as an OBJECT {} not an Array [] ---
let checkOutList = JSON.parse(localStorage.getItem("cartItems")) || {};

// ==========================================
// 3. CATEGORY FILTER LOGIC
// ==========================================
function setupCategoryFilters() {
    const filterContainer = document.getElementById('categoryFilter');
    if (!filterContainer) return;

    const categories = ['All', ...new Set(ArrProducts.map(item => item.category))];
    filterContainer.innerHTML = categories.map(cat => `
        <button class="filter-btn" onclick="filterByCategory('${cat}')">${cat}</button>
    `).join('');
}

function filterByCategory(selectedCategory) {
    const filtered = (selectedCategory === 'All') 
        ? ArrProducts 
        : ArrProducts.filter(item => item.category === selectedCategory);
    displayProducts(filtered);
}

// ==========================================
// 4. PRODUCT DISPLAY LOGIC
// ==========================================
function displayProducts(itemsToDisplay) {
    if (!productsContainer) return;
    productsContainer.innerHTML = ""; 

    const currentCategories = [...new Set(itemsToDisplay.map(item => item.category))];

    currentCategories.forEach(cat => {
        let header = document.createElement("h2");
        header.classList.add("category-header");
        header.innerHTML = `<span></span> ${cat} <span></span>`;
        header.style.gridColumn = "1 / -1";
        productsContainer.appendChild(header);

        const categoryItems = itemsToDisplay.filter(item => item.category === cat);
        
        categoryItems.forEach((item) => {
            let originalIndex = ArrProducts.findIndex(p => p.id === item.id);
            let div = document.createElement("div");
            div.classList.add("item");

            // --- FIX 2: Use item.image from array if your local images folder isn't ready ---
            let priceDisplay = typeof item.price === 'object' 
                ? `S:${item.price.small} | M:${item.price.medium}` 
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
// 5. SEARCH LOGIC
// ==========================================
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = ArrProducts.filter(item => 
            item.name.toLowerCase().includes(searchTerm) || 
            item.category.toLowerCase().includes(searchTerm)
        );
        displayProducts(filtered);
    });
}

// ==========================================
// 6. CART LOGIC
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
        btn.classList.add("size-choice-btn");
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
    // Generate unique key
    let cartKey = index + "_" + size;

    if (checkOutList[cartKey] == null) {
        checkOutList[cartKey] = { 
            ...ArrProducts[index], 
            quantity: 1, 
            price: price, 
            selectedSize: size 
        };
    } else {
        checkOutList[cartKey].quantity += 1;
    }
    
    reloadCart();
}

function closeModal() {
    document.getElementById('sizeModal').style.display = "none";
}

function reloadCart() {
  if (!productList) return;
  productList.innerHTML = "";
  let count = 0;
  let totalPrice = 0;

  // Use Object.keys for the object loop
  Object.keys(checkOutList).forEach(key => {
    let item = checkOutList[key];
    if (item != null) {
      totalPrice += item.price * item.quantity;
      count += item.quantity;

      let li = document.createElement("li");
      li.innerHTML = `
        <div class="cart-item-info">
            <div class="name" style="font-size:0.9rem; font-weight:bold;">${item.name} (${item.selectedSize})</div>
            <div class="price">${item.price} Rs</div>
        </div>
        <div class="quantityContainer">
          <button onclick="changeQuantity('${key}', ${item.quantity - 1})">-</button>
          <div class="quantity">${item.quantity}</div>
          <button onclick="changeQuantity('${key}', ${item.quantity + 1})">+</button>
        </div>
        <button class="removeBtn" onclick="removeItem('${key}')">🗑️</button>
      `;
      productList.appendChild(li);
    }
  });

  if (total) total.innerHTML = `<small>Total: </small> ${totalPrice} Rs`;
  if (quantity) quantity.innerHTML = count;
  
  saveCart(); // This keeps it in LocalStorage!
  updateCheckoutButton();
}

function removeItem(key) {
  delete checkOutList[key];
  reloadCart();
}

function changeQuantity(key, q) {
  if (q <= 0) {
    delete checkOutList[key];
  } else {
    checkOutList[key].quantity = q;
  }
  reloadCart();
}

function saveCart() {
  localStorage.setItem("cartItems", JSON.stringify(checkOutList));
}

function updateCheckoutButton() {
  if (!checkk) return;
  let currentCount = parseInt(quantity.innerHTML);
  checkk.disabled = (currentCount === 0);
  checkk.style.opacity = (currentCount === 0) ? "0.5" : "1";
}

// ==========================================
// 7. INITIALIZE & NAVIGATION
// ==========================================
function onInIt() {
    setupCategoryFilters();
    displayProducts(ArrProducts);
    reloadCart(); // This loads the saved items when page starts!
}

if (shoppingBasket) shoppingBasket.onclick = () => body.classList.add("active");
if (closeCart) closeCart.onclick = () => body.classList.remove("active");

if (checkk) {
    checkk.onclick = () => {
        window.location.href = "checkout.html";
    };
}

onInIt();
