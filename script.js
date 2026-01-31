const ArrProducts = [
  {
    id: 1,
    name: "Classic Cheeseburger",
    price: 300,
    category: "Burgers"
  },
  {
    id: 2,
    name: "Crispy Chicken Sandwich",
    price: 400,
    category: "Sandwiches"
  },
  {
    id: 3,
    name: "Large Golden Fries",
    price: 100,
    category: "Sides"
  },
  {
    id: 4,
    name: "Double Pepperoni Pizza",
    price: 1200,
    category: "Pizza"
  },
  {
    id: 5,
    name: "Tikka",
    price: 300,
    category: "Tikka"
  }
];

const body = document.querySelector("body"),
  productsContainer = document.querySelector(".products"), // Your main grid
  shoppingBasket = document.querySelector(".shoppingBasket"),
  closeCart = document.querySelector(".close"),
  productList = document.querySelector(".productList"), // Inside the cart
  quantity = document.querySelector(".quantity"),
  total = document.querySelector(".total"),
  checkk = document.querySelector(".checkk"),
  searchInput = document.querySelector(".search-input");

let checkOutList = JSON.parse(localStorage.getItem("cartItems")) || [];

// --- 1. DISPLAY LOGIC ---

function displayProducts(itemsToDisplay) {
    productsContainer.innerHTML = ""; // Clear grid

    if (itemsToDisplay.length === 0) {
        productsContainer.innerHTML = `<p style="color:black; text-align:center; width:100%; grid-column: 1/-1;">No books found matching that search. 📚</p>`;
        return;
    }

    itemsToDisplay.forEach((item) => {
        // Find the original index in ArrProducts so addtoCart works correctly
        let originalIndex = ArrProducts.findIndex(p => p.id === item.id);
        
        let div = document.createElement("div");
        div.classList.add("item");

        let star = "";
        for (let i = 0; i < item.rating; i++) {
            star += `<i class="fa fa-star"></i>`;
        }

        div.innerHTML = `
            <img src="images/${item.image}"/>
            <div class="name">${item.name}</div>
            <div>${star}</div>
            <div class="price">${item.price} <small>$</small></div>
            <button onClick="addtoCart(${originalIndex})"><i class="fa fa-cart-plus"></i> Add to Cart</button>
        `;
        productsContainer.appendChild(div);
    });
}

// --- 2. SEARCH LOGIC ---

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = ArrProducts.filter(item => item.name.toLowerCase().includes(searchTerm));
        displayProducts(filtered);
    });
}

// --- 3. CART LOGIC ---

function addtoCart(index) {
  if (checkOutList[index] == null) {
    checkOutList[index] = { ...ArrProducts[index], quantity: 1 };
  } else {
    checkOutList[index].quantity += 1;
  }
  reloadCart();
}

function reloadCart() {
  productList.innerHTML = "";
  let count = 0;
  let totalPrice = 0;

  checkOutList.forEach((item, key) => {
    if (item != null) {
      totalPrice += item.price * item.quantity;
      count += item.quantity;

      let li = document.createElement("li");
      li.innerHTML = `
        <img src="images/${item.image}" />
        <div class="name">${item.name}</div>
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

  total.innerHTML = `<small>Subtotal (${count} items) $</small>` + totalPrice;
  quantity.innerHTML = count;

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
  if (quantity.innerHTML == 0) {
    checkk.disabled = true;
    checkk.style.opacity = "0.5";
  } else {
    checkk.disabled = false;
    checkk.style.opacity = "1";
  }
}

// --- 4. EVENT LISTENERS ---

shoppingBasket.onclick = () => body.classList.add("active");
closeCart.onclick = () => body.classList.remove("active");

function onInIt() {
    displayProducts(ArrProducts);
    reloadCart();
}

onInIt();
