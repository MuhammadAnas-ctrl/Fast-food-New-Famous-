// ==========================================
// 1. DATA ARRAY (ArrProducts)
// ==========================================
const ArrProducts = [
  { id: 1, category: "B.B.Q", name: "Chicken Tikka (Chest)", price: 450, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500" },
  { id: 2, category: "B.B.Q", name: "Chicken Tikka (Leg)", price: 400, image: "https://images.unsplash.com/photo-1632778149975-420e0e75ee08?w=500" },
  { id: 14, category: "Rolls", name: "Chicken Roll", price: 220, image: "https://images.unsplash.com/photo-1626700051175-656a433b915d?w=500" },
  { id: 31, category: "Burger", name: "Zinger Burger", price: 400, image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500" },
  { id: 37, category: "Pizza", name: "Chicken Tikka Pizza", price: { small: 400, medium: 700, large: 999 }, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500" },
  { id: 43, category: "SIDES", name: "French Fries", price: 100, image: "https://images.unsplash.com/photo-1630384066252-11e1f1582231?w=500" }
];

// ==========================================
// 2. THE MOBILE-READY SAVING LOGIC
// ==========================================
let checkOutList = {};

function loadCartFromStorage() {
    const data = localStorage.getItem("cartItems");
    if (data) {
        try {
            const parsed = JSON.parse(data);
            // If it's the old Array format [], clear it to fix the bug
            if (Array.isArray(parsed)) {
                checkOutList = {};
                localStorage.setItem("cartItems", JSON.stringify({}));
            } else {
                checkOutList = parsed;
            }
        } catch (e) {
            checkOutList = {};
        }
    }
}

// ==========================================
// 3. SELECTORS
// ==========================================
const body = document.querySelector("body"),
      productsContainer = document.querySelector(".products"),
      shoppingBasket = document.querySelector(".shoppingBasket"),
      closeCart = document.querySelector(".close"),
      productList = document.querySelector(".productList"),
      quantity = document.querySelector(".quantity"),
      total = document.querySelector(".total"),
      checkk = document.querySelector(".checkk");

// ==========================================
// 4. DISPLAY PRODUCTS
// ==========================================
function displayProducts(items) {
    if (!productsContainer) return;
    productsContainer.innerHTML = "";
    
    const cats = [...new Set(items.map(i => i.category))];
    cats.forEach(cat => {
        let h = document.createElement("h2");
        h.className = "category-header";
        h.innerHTML = cat;
        h.style.gridColumn = "1 / -1";
        productsContainer.appendChild(h);

        items.filter(i => i.category === cat).forEach(item => {
            let idx = ArrProducts.findIndex(p => p.id === item.id);
            let pDiv = document.createElement("div");
            pDiv.className = "item";
            let pShow = typeof item.price === 'object' ? `From ${item.price.small} Rs` : `${item.price} Rs`;
            
            pDiv.innerHTML = `
                <img src="${item.image}" />
                <div class="name">${item.name}</div>
                <div class="price">${pShow}</div>
                <button onclick="addtoCart(${idx})">Add to Cart</button>
            `;
            productsContainer.appendChild(pDiv);
        });
    });
}

// ==========================================
// 5. ADD & RELOAD (The Fix)
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
    const options = document.getElementById('sizeOptions');
    document.getElementById('modalItemName').innerText = item.name;
    options.innerHTML = "";
    
    for (let s in item.price) {
        options.innerHTML += `<button class="size-choice-btn" onclick="confirmAddToCart(${index}, ${item.price[s]}, '${s}'); closeModal();">${s.toUpperCase()} - ${item.price[s]} Rs</button>`;
    }
    modal.style.display = "flex";
}

function confirmAddToCart(index, price, size) {
    let key = index + "_" + size;
    if (!checkOutList[key]) {
        checkOutList[key] = { ...ArrProducts[index], quantity: 1, price: price, selectedSize: size };
    } else {
        checkOutList[key].quantity += 1;
    }
    saveAndShow();
}

function saveAndShow() {
    localStorage.setItem("cartItems", JSON.stringify(checkOutList));
    renderCartUI();
}

function renderCartUI() {
    if (!productList) return;
    productList.innerHTML = "";
    let count = 0, price = 0;

    Object.keys(checkOutList).forEach(key => {
        let item = checkOutList[key];
        count += item.quantity;
        price += item.price * item.quantity;

        let li = document.createElement("li");
        li.innerHTML = `
            <div><b>${item.name}</b> (${item.selectedSize})</div>
            <div>${item.price} Rs x ${item.quantity}</div>
            <button onclick="updateQty('${key}', ${item.quantity - 1})">-</button>
            <button onclick="updateQty('${key}', ${item.quantity + 1})">+</button>
        `;
        productList.appendChild(li);
    });

    if (quantity) quantity.innerText = count;
    if (total) total.innerText = price + " Rs";
    if (checkk) checkk.disabled = (count === 0);
}

function updateQty(key, q) {
    if (q <= 0) delete checkOutList[key];
    else checkOutList[key].quantity = q;
    saveAndShow();
}

function closeModal() { document.getElementById('sizeModal').style.display = "none"; }

// ==========================================
// 6. START EVERYTHING
// ==========================================
function start() {
    loadCartFromStorage(); // 1. Load from phone memory
    displayProducts(ArrProducts); // 2. Show products
    renderCartUI(); // 3. Show saved cart items
}

if (shoppingBasket) shoppingBasket.onclick = () => body.classList.add("active");
if (closeCart) closeCart.onclick = () => body.classList.remove("active");
if (checkk) checkk.onclick = () => window.location.href = "checkout.html";

start();
