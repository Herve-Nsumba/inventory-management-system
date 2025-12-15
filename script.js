/* ===============================
   THEME (Dark / Light)
================================ */
const themeToggle = document.getElementById("themeToggle");

function applyTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark");
  }
}

applyTheme();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    if (document.body.classList.contains("dark")) {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "t" && themeToggle) {
    themeToggle.click();
  }
});

/* ===============================
   REGISTER
================================ */
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = {
      email: email.value.trim(),
      password: password.value,
      name: firstName.value.trim() + " " + lastName.value.trim(),
      phone: phone.value.trim(),
      inventory: [],
    };

    const exists = users.find((u) => u.email === user.email);
    if (exists) {
      message.textContent = "User already exists";
      return;
    }

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));

    message.textContent = "Registration successful";
    registerForm.reset();
  });
}

/* ===============================
   LOGIN
================================ */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) =>
        u.email === loginEmail.value.trim() &&
        u.password === loginPassword.value
    );

    if (!user) {
      message.textContent = "Invalid login details";
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "inventory.html";
  });
}

/* ===============================
   INVENTORY
================================ */
const itemForm = document.getElementById("itemForm");
const inventoryList = document.getElementById("inventoryList");

function displayItems() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) return;

  inventoryList.innerHTML = "";

  const search = searchInput.value.toLowerCase();
  const status = statusFilter.value;

  user.inventory.forEach((item) => {
    if (
      item.name.toLowerCase().includes(search) &&
      (status === "" || item.status === status)
    ) {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${item.name}</strong><br>
        Quantity: ${item.quantity}<br>
        Price: ${item.price}<br>
        Status: ${item.status}<br>
        <button class="delete" data-id="${item.id}">Delete</button>
      `;
      inventoryList.appendChild(li);
    }
  });
}

if (itemForm) {
  itemForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = itemName.value.trim();
    const quantity = Number(itemQty.value);
    const price = Number(itemPrice.value);
    const status = itemStatus.value;

    // -------- VALIDATION --------
    if (!name || !/^[a-zA-Z ]+$/.test(name)) {
      message.textContent = "Item name must contain letters only";
      return;
    }

    if (quantity <= 0 || price <= 0) {
      message.textContent = "Quantity and price must be positive numbers";
      return;
    }

    if (!status) {
      message.textContent = "Please select item status";
      return;
    }

    const user = JSON.parse(localStorage.getItem("currentUser"));

    // -------- CHECK IF ITEM EXISTS --------
    const existingItem = user.inventory.find(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = price;
      existingItem.status = status;
      message.textContent = "Item quantity updated";
    } else {
      user.inventory.push({
        id: Date.now(),
        name,
        quantity,
        price,
        status,
      });
      message.textContent = "Item added successfully";
    }

    // -------- SAVE DATA --------
    let users = JSON.parse(localStorage.getItem("users"));
    users = users.map((u) => (u.email === user.email ? user : u));

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(user));

    itemForm.reset();
    displayItems();
  });

  inventoryList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
      const id = Number(e.target.dataset.id);
      const user = JSON.parse(localStorage.getItem("currentUser"));

      user.inventory = user.inventory.filter((item) => item.id !== id);

      let users = JSON.parse(localStorage.getItem("users"));
      users = users.map((u) => (u.email === user.email ? user : u));

      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(user));

      message.textContent = "Item deleted";
      displayItems();
    }
  });

  searchInput.addEventListener("input", displayItems);
  statusFilter.addEventListener("change", displayItems);

  displayItems();
}

/* ===============================
   LOGOUT
================================ */
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  });
}
