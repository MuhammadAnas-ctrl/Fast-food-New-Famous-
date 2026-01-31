// ==========================================
// 1. SELECTORS & DATA
// ==========================================
// We use {} because cartItems is now an Object (for size keys)
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};

const checkoutList = document.querySelector(".checkoutList");
const checkoutTotal = document.querySelector(".checkoutTotal");
const placeOrderBtn = document.getElementById("placeOrderBtn");

// ==========================================
// 2. RENDER CHECKOUT LIST
// ==========================================
function loadCheckout() {
    if (!checkoutList) return;
    checkoutList.innerHTML = "";
    let totalPrice = 0;
    let count = 0;

    // Loop through the Object keys (e.g., "37_medium")
    Object.keys(cartItems).forEach((key) => {
        let item = cartItems[key];
        
        if (item != null) {
            let itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            count += item.quantity;

            // Check if it's a pizza with a size
            let sizeDisplay = item.selectedSize !== 'Standard' ? `<span class="size-tag">(${item.selectedSize})</span>` : '';

            const li = document.createElement("li");
            li.style.display = "flex";
            li.style.alignItems = "center";
            li.style.gap = "15px";
            li.style.marginBottom = "15px";
            li.style.padding = "10px";
            li.style.borderBottom = "1px solid #eee";

            li.innerHTML = `
                <img src="${item.image}" style="width:70px; height:70px; object-fit:cover; border-radius:8px;" />
                <div style="flex:1;">
                    <div class="name" style="font-weight:bold;">${item.name} ${sizeDisplay}</div>
                    <div class="price" style="color:#e67e22;">${item.price} Rs</div>
                </div>
                <div class="quantityContainer" style="display:flex; align-items:center; gap:10px;">
                    <button onclick="changeQuantity('${key}', ${item.quantity - 1})" style="padding:5px 10px;">-</button>
                    <div class="quantity">${item.quantity}</div>
                    <button onclick="changeQuantity('${key}', ${item.quantity + 1})" style="padding:5px 10px;">+</button>
                </div>
                <button class="removeBtn" onclick="removeItem('${key}')" style="background:none; border:none; cursor:pointer; font-size:1.2rem; margin-left:10px;">🗑️</button>
            `;
            checkoutList.appendChild(li);
        }
    });

    if (checkoutTotal) {
        checkoutTotal.innerHTML = `<h3>Subtotal (${count} items): ${totalPrice} Rs</h3>`;
    }
}

// ==========================================
// 3. CART ACTIONS (Quantity & Remove)
// ==========================================
function removeItem(key) {
    delete cartItems[key];
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    loadCheckout();
}

function changeQuantity(key, newQuantity) {
    if (newQuantity <= 0) {
        removeItem(key);
    } else {
        cartItems[key].quantity = newQuantity;
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        loadCheckout();
    }
}

// ==========================================
// 4. PLACE ORDER (WHATSAPP)
// ==========================================
function placeOrder() {
    // Refresh cart items from storage
    let currentCart = JSON.parse(localStorage.getItem("cartItems")) || {};

    if (Object.keys(currentCart).length === 0) {
        alert("🛒 Your cart is empty!");
        return;
    }

    // Get Customer Details
    let name = document.getElementById("name").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let address = document.getElementById("address").value.trim();
    let city = document.getElementById("city").value.trim();

    if (!name || !phone || !address || !city) {
        alert("⚠️ Please fill all delivery details!");
        return;
    }

    let customerId = "ORD" + Date.now().toString().slice(-6);
    let message = `🛍️ *NEW ORDER RECEIVED*\n`;
    message += `--------------------------\n`;
    message += `🆔 *Order ID:* ${customerId}\n`;
    message += `👤 *Name:* ${name}\n`;
    message += `📞 *Phone:* ${phone}\n`;
    message += `🏠 *Address:* ${address}, ${city}\n`;
    message += `--------------------------\n`;
    message += `🍕 *Items Ordered:*\n`;

    let total = 0;
    Object.keys(currentCart).forEach(key => {
        let item = currentCart[key];
        let sub = item.price * item.quantity;
        total += sub;
        let sizeInfo = item.selectedSize !== 'Standard' ? `(${item.selectedSize})` : '';
        message += `• ${item.name} ${sizeInfo} x ${item.quantity} = ${sub
