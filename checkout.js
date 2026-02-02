// 1. Get the cart items from storage (Object format)
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};

const checkoutList = document.querySelector(".checkoutList");
const checkoutTotal = document.querySelector(".checkoutTotal");
let promoDiscount = 0; // 💡 Use this name everywhere

function applyPromo() {
    const input = document.getElementById('promoInput');
    const code = input.value.trim().toUpperCase();
    const message = document.getElementById('promoMessage');

    if (code === "CRUNCHY20") {
        promoDiscount = 0.20; // 20% off
        message.style.color = "green";
        message.innerText = "✅ Promo Applied! 20% off.";
    } else {
        promoDiscount = 0;
        message.style.color = "red";
        message.innerText = "❌ Invalid Code";
    }
    
    // 💡 On the checkout page, we must call this to refresh the view
    loadCheckout(); 
}
// Load and render checkout list
let deliveryCharge = 70; // 💡 Set to 70 for your 150 Rs example

function loadCheckout() {
  if (!checkoutList) return;
  checkoutList.innerHTML = "";
  let totalPrice = 0;
  let count = 0;

  Object.keys(cartItems).forEach((key) => {
    let item = cartItems[key];
    if (item != null) {
      let itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;
      count += item.quantity;

      let sizeInfo = item.selectedSize !== 'Standard' ? `(${item.selectedSize})` : '';

      const li = document.createElement("li");
      li.innerHTML = `
        <div class="name">${item.name} ${sizeInfo}</div>
        <div class="quantityContainer">
          <button onclick="changeQuantity('${key}', ${item.quantity - 1})">-</button>
          <div class="quantity">${item.quantity}</div>
          <button onclick="changeQuantity('${key}', ${item.quantity + 1})">+</button>
        </div>
        <button class="removeBtn" onclick="removeItem('${key}')">🗑️</button>
      `;
      checkoutList.appendChild(li);
    }
  });

  // 💡 1. Promo Input Section
  const promoDiv = document.createElement("div");
  promoDiv.className = "promo-section";
  promoDiv.innerHTML = `
      <input type="text" id="promoInput" placeholder="Promo code" value="${promoDiscount > 0 ? 'CRUNCHY20' : ''}">
      <button onclick="applyPromo()">Apply</button>
      <div id="promoMessage" style="color: ${promoDiscount > 0 ? 'green' : 'red'}; font-size: 0.8rem;">
        ${promoDiscount > 0 ? '✅ 20% Discount Applied!' : ''}
      </div>
  `;
  checkoutList.appendChild(promoDiv);

  // 💡 2. FIXED MATH: (Items - Discount) + Delivery
  // Discount is calculated ONLY on totalPrice (food items)
  let discountAmount = totalPrice * (typeof promoDiscount !== 'undefined' ? promoDiscount : 0);
  let finalGrandTotal = (totalPrice - discountAmount) + deliveryCharge;

  // 💡 3. Layout (Keeping the directions you liked)
  if (checkoutTotal) {
    checkoutTotal.innerHTML = `
      <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: #555;">
        <span>Items Total:</span>
        <span>${totalPrice} Rs</span>
      </div>
      ${promoDiscount > 0 ? `
      <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: green;">
        <span>Discount:</span>
        <span>-${discountAmount.toFixed(0)} Rs</span>
      </div>` : ''}
      <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: #555;">
        <span>Delivery Fee:</span>
        <span>${deliveryCharge} Rs</span>
      </div>
      <hr style="margin: 8px 0; border: 0.5px solid #ddd;">
      <div style="display: flex; justify-content: space-between; font-size: 1.1rem; font-weight: bold;">
        <span>Total (${count} items):</span>
        <span>${finalGrandTotal.toFixed(0)} Rs</span>
      </div>
    `;
  }
}
// Remove item using the unique Key
function removeItem(key) {
  delete cartItems[key];
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  loadCheckout();
}

// Change quantity using the unique Key
function changeQuantity(key, newQuantity) {
  if (newQuantity <= 0) {
    removeItem(key);
  } else {
    cartItems[key].quantity = newQuantity;
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    loadCheckout();
  }
}

// --- WhatsApp Order Logic ---
function placeOrder() {
  let currentCart = JSON.parse(localStorage.getItem("cartItems")) || {};
  if (Object.keys(currentCart).length === 0) return alert("🛒 Your cart is empty!");

  let name = document.getElementById("name").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let address = document.getElementById("address").value.trim();
  let city = document.getElementById("city").value.trim();

  if (!name || !phone || !address || !city) return alert("⚠️ Please fill all delivery details");

  let customerId = "ORD" + Date.now().toString().slice(-6);
  let message = `🛍️ *New Order Received*\n\n`;
  message += `🆔 Order ID: ${customerId}\n`;
  message += `👤 Name: ${name}\n📞 Phone: ${phone}\n`;
  message += `🏠 Address: ${address}, ${city}\n\n`;
  message += `🍕 *Items:*\n`;

  let itemTotal = 0;
  Object.keys(currentCart).forEach(key => {
    let item = currentCart[key];
    let sub = item.price * item.quantity;
    itemTotal += sub;
    message += `• ${item.name} × ${item.quantity} = ${sub} Rs\n`;
  });

  // 💡 Math: (Subtotal - Discount) + Delivery
  let afterDiscount = itemTotal - (itemTotal * promoDiscount);
  let finalTotal = afterDiscount + deliveryCharge;

  if (promoDiscount > 0) message += `\n🎟️ *Promo:* 20% OFF (-${(itemTotal * promoDiscount).toFixed(0)} Rs)`;
  
  message += `\n📦 *Delivery:* ${deliveryCharge} Rs`;
  message += `\n💰 *Total Amount:* *${finalTotal.toFixed(0)} Rs*\n`;
  message += `\nThank you! 😊`;
  let yournumber = "YOUR NUMBER";
  window.open(`https://wa.me/${yournumber}?text=${encodeURIComponent(message)}`, "_blank");
  localStorage.removeItem("cartItems");
  window.location.href = "index.html";
}
// Initialize on load
loadCheckout();

// Setup Place Order button
const placeOrderBtn = document.getElementById("placeOrderBtn");
if (placeOrderBtn) {
  placeOrderBtn.addEventListener("click", (e) => {
    e.preventDefault();
    placeOrder();
  });
}






