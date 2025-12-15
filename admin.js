let users = JSON.parse(localStorage.getItem("users")) || [];

const userList = document.getElementById("userList");
const inventoryList = document.getElementById("inventoryList");
const userFilter = document.getElementById("userFilter");

/* ===============================
   DISPLAY USERS
================================ */
function displayUsers() {
  userList.innerHTML = "";
  userFilter.innerHTML = `<option value="">All Users</option>`;

  users.forEach((user, index) => {
    if (user.role === "admin") return;

    const li = document.createElement("li");
    li.innerHTML = `
      ${user.name} (${user.email})
      <button class="deleteUser" data-index="${index}">Delete</button>
    `;
    userList.appendChild(li);

    const option = document.createElement("option");
    option.value = user.email;
    option.textContent = user.email;
    userFilter.appendChild(option);
  });
}

/* ===============================
   DISPLAY INVENTORY (ALL USERS)
================================ */
function displayInventory() {
  inventoryList.innerHTML = "";

  const search = searchInput.value.toLowerCase();
  const selectedUser = userFilter.value;
  const status = statusFilter.value;

  users.forEach((user, userIndex) => {
    if (user.role === "admin") return;
    if (selectedUser && user.email !== selectedUser) return;

    user.inventory.forEach((item) => {
      if (
        item.name.toLowerCase().includes(search) &&
        (!status || item.status === status)
      ) {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${item.name}</strong><br>
          User: ${user.email}<br>
          Qty: ${item.quantity} | Price: ${item.price} | Status: ${item.status}
          <br>
          <button class="editItem"
            data-user="${userIndex}"
            data-id="${item.id}">Edit</button>
          <button class="deleteItem"
            data-user="${userIndex}"
            data-id="${item.id}">Delete</button>
        `;
        inventoryList.appendChild(li);
      }
    });
  });
}

/* ===============================
   USER ACTIONS
================================ */
userList.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteUser")) {
    const index = Number(e.target.dataset.index);
    users.splice(index, 1);
    localStorage.setItem("users", JSON.stringify(users));
    displayUsers();
    displayInventory();
  }
});

/* ===============================
   INVENTORY ACTIONS (EDIT / DELETE)
================================ */
inventoryList.addEventListener("click", (e) => {
  const userIndex = Number(e.target.dataset.user);
  const itemId = Number(e.target.dataset.id);

  if (e.target.classList.contains("deleteItem")) {
    users[userIndex].inventory = users[userIndex].inventory.filter(
      (item) => item.id !== itemId
    );

    localStorage.setItem("users", JSON.stringify(users));
    displayInventory();
  }

  if (e.target.classList.contains("editItem")) {
    const item = users[userIndex].inventory.find((i) => i.id === itemId);

    const newQty = Number(prompt("Enter new quantity:", item.quantity));
    const newPrice = Number(prompt("Enter new price:", item.price));
    const newStatus = prompt(
      "Enter status (Available / Out of Stock / Pending):",
      item.status
    );

    if (newQty > 0 && newPrice > 0 && newStatus) {
      item.quantity = newQty;
      item.price = newPrice;
      item.status = newStatus;

      localStorage.setItem("users", JSON.stringify(users));
      displayInventory();
    } else {
      alert("Invalid input. Update cancelled.");
    }
  }
});

/* ===============================
   FILTER EVENTS
================================ */
searchInput.addEventListener("input", displayInventory);
statusFilter.addEventListener("change", displayInventory);
userFilter.addEventListener("change", displayInventory);

/* ===============================
   LOGOUT
================================ */
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
});

/* ===============================
   INIT
================================ */
displayUsers();
displayInventory();
