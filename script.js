// ==========================================
// 1. DATA ARRAY (ArrProducts)
// ==========================================
const ArrProducts = [
  // --- FAMOUS B.B.Q ---
  { id: 1, category: "B.B.Q", name: "Chicken Tikka (Chest)", price: 450 },
  { id: 2, category: "B.B.Q", name: "Chicken Tikka (Leg)", price: 400 },
  { id: 3, category: "B.B.Q", name: "Green Tikka (Chest)", price: 520 },
  { id: 4, category: "B.B.Q", name: "Malai Tikka (Chest)", price: 520 },
  { id: 5, category: "B.B.Q", name: "Chicken Malai Boti (Plate)", price: 700 },
  { id: 6, category: "B.B.Q", name: "Beef Boti (Plate)", price: 700 },
  { id: 7, category: "B.B.Q", name: "Beef Bihari Boti (Plate)", price: 700 },
  { id: 8, category: "B.B.Q", name: "Seekh Kabab Beef (Plate)", price: 600 },
  { id: 9, category: "B.B.Q", name: "Chicken Boti Spicy (Plate)", price: 550 },
  { id: 10, category: "B.B.Q", name: "Gola Kabab (Plate)", price: 550 },
  { id: 11, category: "B.B.Q", name: "Reshmi Kabab (Plate)", price: 550 },
  { id: 12, category: "B.B.Q", name: "Dhaga Kabab (Plate)", price: 550 },
  { id: 13, category: "B.B.Q", name: "Turkish Kabab (Plate)", price: 650 },

  // --- FAMOUS ROLLS ---
  { id: 14, category: "Rolls", name: "Chicken Roll", price: 220 },
  { id: 15, category: "Rolls", name: "Chicken Zinger Roll", price: 350 },
  { id: 16, category: "Rolls", name: "Chicken Cheese Roll", price: 280 },
  { id: 17, category: "Rolls", name: "Chicken Mayo Garlic Roll", price: 280 },
  { id: 18, category: "Rolls", name: "Beef Boti Roll", price: 260 },
  { id: 19, category: "Rolls", name: "Beef Cheese Roll", price: 300 },
  { id: 20, category: "Rolls", name: "Kabab Roll", price: 250 },
  { id: 21, category: "Rolls", name: "Kabab Cheese Roll", price: 300 },
  { id: 22, category: "Rolls", name: "Beef Mayo Garlic Roll", price: 300 },
  { id: 23, category: "Rolls", name: "Reshmi Kabab Roll", price: 280 },
  { id: 24, category: "Rolls", name: "Reshmi Kabab Cheese Roll", price: 300 },
  { id: 25, category: "Rolls", name: "Chicken Malai Roll", price: 280 },

  // --- FAMOUS BROAST ---
  { id: 26, category: "Broast", name: "Quarter Broast (Chest)", price: 480 },
  { id: 27, category: "Broast", name: "Crispy Broast (Quarter)", price: 500 },
  { id: 28, category: "Broast", name: "Spicy Broast (Quarter)", price: 500 },
  { id: 29, category: "Broast", name: "Garlic Broast", price: 550 },
  { id: 30, category: "Broast", name: "Cheese Broast", price: 550 },

  // --- FAMOUS BURGERS ---
  { id: 31, category: "Burger", name: "Zinger Burger", price: 400 },
  { id: 32, category: "Burger", name: "Zinger Cheese Burger", price: 450 },
  { id: 33, category: "Burger", name: "Jumbo Zinger", price: 750 },
  { id: 34, category: "Burger", name: "Chicken Burger", price: 330 },
  { id: 35, category: "Burger", name: "Beef Burger", price: 350 },
  { id: 36, category: "Burger", name: "Chicken Grill Burger", price: 400 },

  // --- FAMOUS PIZZA (With Sizes) ---
  { id: 37, category: "Pizza", name: "Chicken Tikka / Fajita / Supreme", price: { small: 400, medium: 700, large: 999 } },
  { id: 38, category: "Pizza", name: "Pizza Kabab Hunter", price: { small: 400, medium: 800, large: 1199 } },
  { id: 39, category: "Pizza", name: "Famous Speciality Pizza", price: { medium: 900, large: 1299 } },
  { id: 40, category: "Pizza", name: "Kabab Popper (Any Flavor)", price: { medium: 1000, large: 1399 } },

  // --- PIZZA FRIES ---
  { id: 41, category: "Pizza Fries", name: "Pizza Fries Creamy Blast", price: { small: 400, medium: 600 } },
  { id: 42, category: "Pizza Fries", name: "Pizza Fries Peri Peri Garlic", price: { small: 400, medium: 600 } },

  // --- SIDES ---
  { id: 43, category: "SIDES", name: "French Fries", price: 100 },
  { id: 44, category: "SIDES", name: "Puri Paratha (Small)", price: 50 },
  { id: 45, category: "SIDES", name: "Puri Paratha (Large)", price: 80 }
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

let checkOutList = JSON.parse(localStorage.getItem("cartItems")) || [];

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
    if (selectedCategory === 'All') {
        displayProducts(ArrProducts);
    } else {
        const filtered = ArrProducts.filter(item => item.category === selectedCategory);
        displayProducts(filtered);
    }
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

            let priceDisplay = typeof item.price === 'object' 
                ? `S:${item.price.small} | M:${item.price.medium}` 
                : `${item.price} Rs`;

            div.innerHTML = `
                <img src="images/${item.id}.jpg" onerror="this.src='images/default-food.jpg'"/>
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
  if (checkOutList[index] == null) {
    checkOutList[index] = { ...ArrProducts[index], quantity: 1 };
  } else {
    checkOutList[index].quantity += 1;
  }
  reloadCart();
}

function reloadCart() {
  if (!productList) return;
  productList.innerHTML = "";
  let count = 0;
  let totalPrice = 0;

  checkOutList.forEach((item, key) => {
    if (item != null) {
      let itemPrice = typeof item.price === 'object' ? item.price.small : item.price;
      totalPrice += itemPrice * item.quantity;
      count += item.quantity;

      let li = document.createElement("li");
      li.innerHTML = `
        <div class="cart-item-info">
            <div class="name">${item.name}</div>
            <div class="price">${itemPrice} Rs</div>
        </div>
        <div class="quantityContainer">
          <button onclick="changeQuantity(${key}, ${item.quantity - 1})">-</button>
          <div class="quantity">${item.quantity}</div>
          <button onclick="changeQuantity(${key}, ${item.quantity + 1})">+</button>
        </div>
        <button class="removeBtn" onclick="removeItem(${key})">🗑️</button>
      `;
      productList.appendChild(li);
    }
  });

  if (total) total.innerHTML = `<small>Total: </small> ${totalPrice} Rs`;
  if (quantity) quantity.innerHTML = count;
  saveCart();
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
  checkk.disabled = (quantity.innerHTML == 0);
  checkk.style.opacity = (quantity.innerHTML == 0) ? "0.5" : "1";
}

// ==========================================
// 7. INITIALIZE & NAVIGATION
// ==========================================
function onInIt() {
    setupCategoryFilters();
    displayProducts(ArrProducts);
    reloadCart();
}

// Cart UI Toggle
if (shoppingBasket) shoppingBasket.onclick = () => body.classList.add("active");
if (closeCart) closeCart.onclick = () => body.classList.remove("active");

// THIS IS THE FIX: Open your checkout page
if (checkk) {
    checkk.onclick = () => {
        window.location.href = "checkout.html"; // Make sure your file is named exactly this
    };
}

onInIt();
