// ==========================================
// 1. DATA ARRAY (ArrProducts)
// ==========================================
const ArrProducts = [
  { id: 1, category: "B.B.Q", name: "Chicken Tikka (Chest)", price: 450},
  { id: 2, category: "B.B.Q", name: "Chicken Tikka (Leg)", price: 400 },
  { id: 3, category: "B.B.Q", name: "Green Tikka (Chest)", price: 520 },
  { id: 14, category: "Rolls", name: "Chicken Roll", price: 220 },
  { id: 15, category: "Rolls", name: "Chicken Zinger Roll", price: 350},
  { id: 31, category: "Burger", name: "Zinger Burger", price: 400},
  { id: 32, category: "Burger", name: "Zinger Cheese Burger", price: 450 },
  { id: 37, category: "Pizza", name: "Chicken Tikka Pizza", price: { small: 400, medium: 700, large: 999 } },
  { id: 43, category: "SIDES", name: "French Fries", price: 100 }
];
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.onclick = function() {
        navMenu.classList.toggle('active');
    };

    // 🚀 NEW: Close the menu when any link is clicked
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.onclick = () => {
            navMenu.classList.remove('active');
        };
    });
}

function hideLoader() {
    const loader = document.getElementById('loading-screen');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500); // Time for the fade-out effect
    }
}

// 1. Hide it when everything is 100% loaded
window.addEventListener('load', hideLoader);

// 2. SAFETY TIMER: If it takes more than 3 seconds, force it to hide!
setTimeout(hideLoader, 3000);
// ==========================================
// 2. SELECTORS & INITIALIZATION
// ==========================================
const body = document.querySelector("body"),
  productsContainer = document.querySelector(".products"),
  shoppingBasket = document.querySelector(".cart-icon"),
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




function searchFood() {
    let input = document.querySelector('.search-input').value.toLowerCase();
    
    // Filter the ArrProducts array based on the name
    let filteredProducts = ArrProducts.filter(item => {
        return item.name.toLowerCase().includes(input);
    });

    // Use your existing display function to show the results
    displayProducts(filteredProducts);
}
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
  const cartBadge = document.getElementById('cart-count');
  if (cartBadge) {
      cartBadge.textContent = count;
  }
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











function sendToWhatsApp() {
    // 1. Get the values from the input fields
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;

    // 2. Simple validation to make sure they filled the fields
    if (name === "" || message === "") {
        alert("Please enter your name and message first! 😊");
        return;
    }

    // 3. Your phone number (with country code, no + or 00)
    const phoneNumber = "YOUR Number"; 

    // 4. Format the text for WhatsApp (using %0A for new lines)
    const text = `*New Contact Message*%0A%0A` +
                 `👤 *Name:* ${name}%0A` +
                 `📧 *Phone:* ${phone}%0A` +
                 `💬 *Message:* ${message}`;

    // 5. Open the WhatsApp URL
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${text}`;
    window.open(whatsappURL, '_blank');
}


// Automatically update the year in the footer
const yearSpan = document.getElementById('currentYear');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}


function fillReviewDropdown() {
    const select = document.getElementById('reviewItem');
    
    // 1. Check if the select box and the array actually exist
    if (!select) {
        console.error("Could not find the 'reviewItem' dropdown!");
        return;
    }

    if (typeof ArrProducts === 'undefined' || !ArrProducts.length) {
        console.error("ArrProducts is empty or not defined!");
        return;
    }

    // 2. Clear existing options (except the first one)
    select.innerHTML = '<option value="General">Select Item</option>';

    // 3. Loop through your array and add names
    ArrProducts.forEach(product => {
        let option = document.createElement('option');
        option.value = product.name;
        option.innerText = product.name;
        select.appendChild(option);
    });

    console.log("Review dropdown filled with " + ArrProducts.length + " items!");
}

// 4. Run it immediately AND when the window loads to be 100% sure
fillReviewDropdown(); 
window.addEventListener('load', fillReviewDropdown);

// 2. Run this function when the page loads
window.addEventListener('load', fillReviewDropdown);

// 1. Time Calculation Function
function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return seconds + " sec ago";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + " min ago";
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + " hours ago";
    const days = Math.floor(hours / 24);
    if (days >= 10) return null; // Deletes after 10 days
    return days + " days ago";
}

// 1. Your "Featured" Reviews (These show up if the container is empty)
const defaultReviews = [
    { item: "Chicken Tikka", name: "Management", text: "Our best seller! Always fresh and juicy.", time: new Date().toISOString() },
    { item: "Zinger Burger", name: "Chef Choice", text: "Crunchy, spicy, and perfectly fried.", time: new Date().toISOString() },
    { item: "Beef Burger", name: "Foodie Guide", text: "The most authentic beef taste in the city!", time: new Date().toISOString() }
];

function loadReviews() {
    const container = document.getElementById('reviewsContainer');
    if (!container) return;

    let allReviews = JSON.parse(localStorage.getItem("customerReviews")) || [];
    const tenDaysInMs = 10 * 24 * 60 * 60 * 1000;
    const now = new Date().getTime();

    // Remove reviews older than 10 days
    allReviews = allReviews.filter(rev => (now - new Date(rev.time).getTime()) < tenDaysInMs);
    localStorage.setItem("customerReviews", JSON.stringify(allReviews));

    container.innerHTML = ""; 

    // 💡 THE TRICK: If no customer reviews exist, use the Default ones!
    const reviewsToDisplay = allReviews.length > 0 ? allReviews.reverse() : defaultReviews;

    reviewsToDisplay.forEach(rev => {
        const timeDisplay = timeAgo(rev.time);
        const card = document.createElement('div');
        card.className = 'review-card';
        // If it's a default review, show "Featured" instead of time
        const displayTime = timeDisplay ? timeDisplay : "Featured"; 

        card.innerHTML = `
            <h4>${rev.item}</h4>
            <p>"${rev.text}"</p>
            <span>- ${rev.name} • <small>${displayTime}</small></span>
        `;
        container.appendChild(card);
    });
}

// 3. Add Review Function
function addReview() {
    const item = document.getElementById('reviewItem').value;
    const name = document.getElementById('reviewName').value;
    const text = document.getElementById('reviewText').value;

    if (name.trim() === "" || text.trim() === "") {
        alert("Please fill in your name and message! 😊");
        return;
    }

    const newReview = { 
        item, 
        name, 
        text, 
        time: new Date().toISOString() 
    };

    const allReviews = JSON.parse(localStorage.getItem("customerReviews")) || [];
    allReviews.push(newReview);
    localStorage.setItem("customerReviews", JSON.stringify(allReviews));

    // Reset form
    document.getElementById('reviewName').value = "";
    document.getElementById('reviewText').value = "";

    loadReviews(); // Refresh display
}

// 4. THE FIX: Run this when the page is fully loaded
window.addEventListener('DOMContentLoaded', () => {
    if (typeof fillReviewDropdown === 'function') fillReviewDropdown();
    loadReviews();
});

