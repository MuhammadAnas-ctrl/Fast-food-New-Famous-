// ==========================================
// 1. DATA ARRAY (ArrProducts)
// ==========================================
const ArrProducts = [
  { id: 1, category: "B.B.Q", name: "Chicken Tikka (Chest)", price: 450, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=500" },
  { id: 2, category: "B.B.Q", name: "Chicken Tikka (Leg)", price: 400, image: "https://images.unsplash.com/photo-1632778149975-420e0e75ee08?auto=format&fit=crop&w=500" },
  { id: 3, category: "B.B.Q", name: "Green Tikka (Chest)", price: 520, image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=500" },
  { id: 14, category: "Rolls", name: "Chicken Roll", price: 220, image: "https://images.unsplash.com/photo-1626700051175-656a433b915d?auto=format&fit=crop&w=500" },
  { id: 15, category: "Rolls", name: "Chicken Zinger Roll", price: 350, image: "https://images.unsplash.com/photo-1662116765994-1e0e00c67089?auto=format&fit=crop&w=500" },
  { id: 31, category: "Burger", name: "Zinger Burger", price: 400, image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=500" },
  { id: 32, category: "Burger", name: "Zinger Cheese Burger", price: 450, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=500" },
  { id: 37, category: "Pizza", name: "Chicken Tikka Pizza", price: { small: 400, medium: 700, large: 999 }, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500" },
  { id: 43, category: "SIDES", name: "French Fries", price: 100, image: "https://images.unsplash.com/photo-1630384066252-11e1f1582231?auto=format&fit=crop&w=500" }
];

// ==========================================
// 2. SELECTORS & INITIALIZATION
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

let checkOutList = JSON.parse(localStorage.getItem("cartItems")) || {};

// ==========================================
// 3. STYLES INJECTOR (Toast + BackToTop)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
  /* Toast Popup */
  .toast-notification {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: #333;
    color: white;
    padding: 12px 25px;
    border-radius: 50px;
    font-weight: bold;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    z-index: 10000;
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .toast-active { transform: translateX(-50%) translateY(0); }
  
  /* Back to Top Button */
  #backToTop {
    position: fixed;
    bottom: 90px;
    right: 20px;
    background: #ffbe76;
    color: #333;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    cursor: pointer;
    z-index: 999;
    opacity: 0;
    visibility: hidden;
    transition: 0.3s;
    border: none;
  }
  #backToTop.show { opacity: 1; visibility: visible; }
`;
document.head.appendChild(style);

// ==========================================
// 4. UTILITY FUNCTIONS (Toast & Scroll)
// ==========================================
function showToast(itemName) {
    let toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.innerHTML = `<i class="fa fa-check-circle" style="color:#ffbe76"></i> ${itemName} added!`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("toast-active"), 100);
    setTimeout(() => {
        toast.classList.remove("toast-active");
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}

// Back to Top Logic
const bttBtn = document.createElement("button");
bttBtn.id = "backToTop";
bttBtn.innerHTML = `<i class="fa fa-arrow-up"></i>`;
document.body.appendChild(bttBtn);

window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        bttBtn.classList.add("show");
    } else {
        bttBtn.classList.remove("show");
    }
};

bttBtn.onclick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ==========================================
// 5. PRODUCT & FILTER LOGIC
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
    const filtered = (selectedCategory === 'All') ? ArrProducts : ArrProducts.filter(item => item.category === selectedCategory);
    displayProducts(filtered);
}

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

        itemsToDisplay.filter(item => item.category === cat).forEach((item) => {
            let originalIndex = ArrProducts.findIndex(p => p.id === item.id);
            let div = document.createElement("div");
            div.classList.add("item");
            let priceDisplay = typeof item.price === 'object' ? `S:${item.price.small} Rs` : `${item.price} Rs`;

            div.innerHTML = `
                <img src="${item.image}" onerror="this.src='images/default-food.jpg'"/>
                <div class="name">${item.name}</div>
                <div class="price">${priceDisplay}</div>
                <button onClick="addtoCart(${originalIndex})"><i class="fa fa-cart-plus"></i> Add</button>
            `;
            productsContainer.appendChild(div);
        });
    });
}

// ==========================================
// 6. CART CORE LOGIC
// ==========================================
function addtoCart(index) {
    const item = ArrProducts[index];
    if (typeof item.price === 'object') {
        showSizeModal(index);
    } else {
        confirmAddToCart(index, item.price, 'Standard');
        showToast(item.name);
    }
}

function showSizeModal(index) {
    const item = ArrProducts[index];
    const modal = document.getElementById('sizeModal');
    const optionsContainer = document.getElementById('sizeOptions');
    document.getElementById('modalItemName').innerText = item.name;
    optionsContainer.innerHTML = ""; 

    for (let size in item.price) {
        let btn = document.createElement("button");
        btn.classList.add("size-choice-btn");
        btn.innerText = `${size.toUpperCase()} - ${item.price[size]} Rs`;
        btn.onclick = () => {
            confirmAddToCart(index, item.price[size], size);
            showToast(`${item.name} (${size})`);
            closeModal();
        };
        optionsContainer.appendChild(btn);
    }
    modal.style.display = "flex";
}

function confirmAddToCart(index, price, size) {
    let cartKey = index + "_" + size;
    if (checkOutList[cartKey] == null) {
        checkOutList[cartKey] = { ...ArrProducts[index], quantity: 1, price: price, selectedSize: size };
    } else {
        checkOutList[cartKey].quantity += 1;
    }
    reloadCart();
}

function reloadCart() {
  if (!productList) return;
  productList.innerHTML = "";
  let count = 0;
  let totalPrice = 0;

  Object.keys(checkOutList).forEach(key => {
    let item = checkOutList[key];
    if (item != null) {
      totalPrice += item.price * item.quantity;
      count += item.quantity;

      let li = document.createElement("li");
      li.innerHTML = `
        <div class="item-info">
                    <div class="name">${item.name}</div>
                    <div style="font-size: 0.9rem; color: #666;">${item.price} Rs</div>
                </div>
                <div class="quantityContainer">
                    <button class="btn-minus" onclick="changeQuantity('${key}', ${item.quantity - 1})">-</button>
                    <div class="quantity-val">${item.quantity}</div>
                    <button class="btn-plus" onclick="changeQuantity('${key}', ${item.quantity + 1})">+</button>
                    <button class="removeBtn" onclick="removeItem('${key}')">🗑️</button>
                </div>  `;
      productList.appendChild(li);
    }
  });

  if (total) total.innerHTML = `<small>Total: </small> ${totalPrice} Rs`;
  if (quantity) quantity.innerHTML = count;
  
  localStorage.setItem("cartItems", JSON.stringify(checkOutList));
  
  if (checkk) {
    checkk.disabled = (count === 0);
    checkk.style.opacity = (count === 0) ? "0.5" : "1";
  }
}

function removeItem(key) {
  delete checkOutList[key];
  reloadCart();
}

function changeQuantity(key, q) {
  if (q <= 0) delete checkOutList[key];
  else checkOutList[key].quantity = q;
  reloadCart();
}

function closeModal() { document.getElementById('sizeModal').style.display = "none"; }

// ==========================================
// 7. INITIALIZE
// ==========================================
function onInIt() {
    setupCategoryFilters();
    displayProducts(ArrProducts);
    reloadCart();
}

if (shoppingBasket) shoppingBasket.onclick = () => body.classList.add("active");
if (closeCart) closeCart.onclick = () => body.classList.remove("active");
if (checkk) checkk.onclick = () => window.location.href = "checkout.html";

onInIt();
