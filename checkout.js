// 1. Get the cart items from storage (Object format)
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};

const checkoutList = document.querySelector(".checkoutList");
const checkoutTotal = document.querySelector(".checkoutTotal");

// Load and render checkout list
function loadCheckout() {
  if (!checkoutList) return;
  checkoutList.innerHTML = "";
  let totalPrice = 0;
  let count = 0;

  // Convert Object keys to a loop
  Object.keys(cartItems).forEach((key) => {
    let item = cartItems[key];
    
    if (item != null) {
      let itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;
      count += item.quantity;

      // Handle displaying size if it exists
      let sizeInfo = item.selectedSize !== 'Standard' ? `(${item.selectedSize})` : '';

      const li = document.createElement("li");
      // Keeping your exact innerHTML structure and classes
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

  if (checkoutTotal) {
    checkoutTotal.innerHTML = `Subtotal (${count} items): ${totalPrice} Rs`;
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

  if (Object.keys(currentCart).length === 0) {
    alert("🛒 Your cart is empty!");
    return;
  }

  // Get customer details from your form IDs
  let name = document.getElementById("name").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let address = document.getElementById("address").value.trim();
  let city = document.getElementById("city").value.trim();

  if (!name || !phone || !address || !city) {
    alert("⚠️ Please fill all delivery details");
    return;
  }

  let customerId = "ORD" + Date.now().toString().slice(-6);
  let message = `🛍️ *New Order Received*\n\n`;
  message += `🆔 Order ID: ${customerId}\n`;
  message += `👤 Name: ${name}\n`;
  message += `📞 Phone: ${phone}\n`;
  message += `🏠 Address: ${address}\n🏙️ City: ${city}\n\n`;
  message += `🍕 *Items:*\n`;

  let total = 0;
  Object.keys(currentCart).forEach(key => {
    let item = currentCart[key];
    let sub = item.price * item.quantity;
    total += sub;
    let sizeText = item.selectedSize !== 'Standard' ? `(${item.selectedSize})` : '';
    message += `• ${item.name} ${sizeText} × ${item.quantity} = ${sub} Rs\n`;
  });

  message += `\n💰 *Total Amount:* ${total} Rs\n`;
  message += `\nThank you for your order! 😊`;

  const encodedMessage = encodeURIComponent(message);
  let ownerNumber = "YOUR NUMBER"; 

  window.open(`https://wa.me/${ownerNumber}?text=${encodedMessage}`, "_blank");

  // Clear cart after order
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






let appliedDiscount = 0; // Global variable to store the discount %

function applyPromo() {
    const code = document.getElementById('promoInput').value.trim().toUpperCase();
    const message = document.getElementById('promoMessage');

    if (code === "CRUNCHY20") {
        appliedDiscount = 0.20; // 20% off
        message.style.color = "green";
        message.innerText = "✅ Promo Applied! 20% off your total.";
    } else if (code === "") {
        message.innerText = "";
    } else {
        appliedDiscount = 0;
        message.style.color = "red";
        message.innerText = "❌ Invalid Code";
    }
    
    reloadCart(); // Refresh the total price
}
