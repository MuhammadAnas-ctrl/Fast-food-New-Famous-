// 1. Load the cart as an Object (this matches your Shop page logic)
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};

const checkoutList = document.querySelector(".checkoutList");
const checkoutTotal = document.querySelector(".checkoutTotal");

// Load and render checkout l
console.log("Current Cart Data:", localStorage.getItem("cartItems"));

function loadCheckout() {
  // Always fetch fresh data from LocalStorage
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};
  
  if (!checkoutList) return;
  checkoutList.innerHTML = "";
  
  let keys = Object.keys(cartItems);
  
  if (keys.length === 0) {
    checkoutList.innerHTML = "<p>Your cart is empty! 🛒</p>";
    return;
  }

  let totalPrice = 0;
  keys.forEach((key) => {
    let item = cartItems[key];
    // ... rest of your rendering code
  });
}

// Remove item using the unique Key (like "37_small")
function removeItem(key) {
  delete cartItems[key];
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  loadCheckout();
}

// Change quantity
function changeQuantity(key, newQuantity) {
  if (newQuantity <= 0) {
    removeItem(key);
  } else {
    cartItems[key].quantity = newQuantity;
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    loadCheckout();
  }
}

// Initial Load
loadCheckout();

// --- PLACE ORDER LOGIC ---
const placeOrderBtn = document.getElementById("placeOrderBtn");

function placeOrder() {
  // Always get the latest cart data
  let currentCart = JSON.parse(localStorage.getItem("cartItems")) || {};

  if (Object.keys(currentCart).length === 0) {
    alert("🛒 Your cart is empty!");
    return;
  }

  // Customer details
  let name = document.getElementById("name").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let address = document.getElementById("address").value.trim();
  let city = document.getElementById("city").value.trim();

  if (!name || !phone || !address || !city) {
    alert("⚠️ Please fill all details");
    return;
  }

  let customerId = "ORD" + Date.now().toString().slice(-6);
  let message = `🛍️ *New Order Received*\n\n`;
  message += `🆔 Order ID: ${customerId}\n`;
  message += `👤 Name: ${name}\n`;
  message += `📞 Phone: ${phone}\n`;
  message += `🏠 Address: ${address}\n 🏙️ City: ${city}\n\n`;
  message += `🍕 *Order Items:*\n`;

  let total = 0;

  Object.keys(currentCart).forEach(key => {
    let item = currentCart[key];
    if (item) {
      let sub = item.price * item.quantity;
      total += sub;
      let sizeInfo = item.selectedSize !== 'Standard' ? `(${item.selectedSize})` : '';
      message += `• ${item.name} ${sizeInfo} × ${item.quantity} = Rs ${sub}\n`;
    }
  });

  message += `\n💰 *Total Amount: Rs ${total}*\n`;
  message += `\nThank you for your order 😊`;

  const encodedMessage = encodeURIComponent(message);
  let ownerNumber = "03021206595"; 

  window.open(`https://wa.me/${ownerNumber}?text=${encodedMessage}`, "_blank");

  // Clear cart and go back
  localStorage.removeItem("cartItems");
  window.location.href = "index.html"; 
}

if(placeOrderBtn){
