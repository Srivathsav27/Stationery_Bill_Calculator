// Global variables
let currentUser = localStorage.getItem("currentUser");
let currentAdmin = localStorage.getItem("currentAdmin");

// Add ripple effect to buttons
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('ripple')) {
    const btn = e.target;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    btn.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
});

// Preloader animation
function simulateProgress() {
  const progressBar = document.querySelector('.progress');
  let width = 0;
  const interval = setInterval(() => {
    if (width >= 100) {
      clearInterval(interval);
      document.getElementById('preloader').style.opacity = '0';
      setTimeout(() => {
        document.getElementById('preloader').style.display = 'none';
        checkExistingSession();
      }, 800);
    } else {
      width += Math.random() * 10 + 5;
      if (width > 100) width = 100;
      progressBar.style.width = width + '%';
    }
  }, 300);
}

// Check existing session
function checkExistingSession() {
  currentUser = localStorage.getItem("currentUser");
  currentAdmin = localStorage.getItem("currentAdmin");
  
  if (currentAdmin) {
    showItemManagement();
    showSuccessMessage("welcome", "Welcome back, Admin!");
  } else if (currentUser) {
    showMainContent();
    showSuccessMessage("welcome", "Welcome back to SBC!");
  } else {
    showWelcome();
    showSuccessMessage("welcome", "Welcome to SBC!");
  }
}

// Helper functions
function hideAllPages() {
  const pages = [
    "welcomePage", "registrationPage", "loginPage", 
    "mainContent", "adminRegistration", "adminLogin", 
    "itemManagement"
  ];
  
  pages.forEach(page => {
    const element = document.getElementById(page);
    if (element) {
      element.style.display = "none";
      element.classList.remove('animate__animated', 'animate__fadeIn');
    }
  });
}

function clearErrors() {
  document.querySelectorAll('.error').forEach(el => {
    el.textContent = '';
  });
}

function togglePassword(passwordFieldId) {
  const passwordField = document.getElementById(passwordFieldId);
  if (passwordField.type === "password") {
    passwordField.type = "text";
    document.querySelector(`[onclick="togglePassword('${passwordFieldId}')"]`).textContent = "🙈";
  } else {
    passwordField.type = "password";
    document.querySelector(`[onclick="togglePassword('${passwordFieldId}')"]`).textContent = "👁️";
  }
}

function formatDate(date) {
  return new Date(date).toLocaleString();
}

// Toggle change password section
function toggleChangePassword(sectionId) {
  const section = document.getElementById(sectionId);
  if (section.style.display === "none" || section.style.display === "") {
    section.style.display = "block";
    section.classList.add('animate__animated', 'animate__fadeIn');
  } else {
    section.style.display = "none";
    section.classList.remove('animate__animated', 'animate__fadeIn');
  }
}

// Show success message
function showSuccessMessage(type, message) {
  const msgElement = document.getElementById(`${type}Message`);
  if (msgElement) {
    msgElement.textContent = message;
    msgElement.style.display = "flex";
    msgElement.classList.add('animate__animated', 'animate__slideInDown');
    setTimeout(() => {
      msgElement.classList.remove('animate__animated', 'animate__slideInDown');
      msgElement.style.display = "none";
    }, 4000);
  }
}

// User Registration and Login
function showRegistration() {
  hideAllPages();
  clearErrors();
  const page = document.getElementById("registrationPage");
  page.style.display = "block";
  animateElements(page);
}

function showLogin() {
  hideAllPages();
  clearErrors();
  const page = document.getElementById("loginPage");
  page.style.display = "block";
  animateElements(page);
}

function showWelcome() {
  hideAllPages();
  clearErrors();
  const page = document.getElementById("welcomePage");
  page.style.display = "block";
  animateElements(page);
}

function animateElements(container) {
  container.classList.add('animate__animated', 'animate__fadeIn');
  const elements = container.querySelectorAll('h1, h2, h3, p, input, button, table, .logo-container, .section');
  elements.forEach((el, index) => {
    el.classList.remove('animate__animated', 'animate__fadeIn', 'animate__fadeInDown', 'animate__fadeInUp', 'animate__fadeInLeft', 'animate__fadeInRight');
    setTimeout(() => {
      if (el.tagName === 'H1') {
        el.classList.add('animate__animated', 'animate__fadeInDown');
      } else if (el.tagName === 'BUTTON') {
        el.classList.add('animate__animated', el.classList.contains('animate__fadeInLeft') ? 'animate__fadeInLeft' : el.classList.contains('animate__fadeInRight') ? 'animate__fadeInRight' : 'animate__fadeInUp');
      } else {
        el.classList.add('animate__animated', 'animate__fadeIn');
      }
      el.style.animationDelay = `${index * 0.1}s`;
    }, 10);
  });
}

function register() {
  const username = document.getElementById("regUsername").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const errorElement = document.getElementById("regError");

  if (!username || !password) {
    errorElement.textContent = "Username and password are required";
    errorElement.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => errorElement.classList.remove('animate__animated', 'animate__shakeX'), 500);
    return;
  }
  if (password.length < 6) {
    errorElement.textContent = "Password must be at least 6 characters";
    errorElement.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => errorElement.classList.remove('animate__animated', 'animate__shakeX'), 500);
    return;
  }

  if (localStorage.getItem(username)) {
    errorElement.textContent = "Username already exists. Please choose a different username.";
    errorElement.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => errorElement.classList.remove('animate__animated', 'animate__shakeX'), 500);
  } else {
    localStorage.setItem(username, password);
    showSuccessMessage("registerSuccess", "Registered successfully! You can now log in.");
    showLogin();
  }
}

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorElement = document.getElementById("loginError");

  if (!username || !password) {
    errorElement.textContent = "Username and password are required";
    errorElement.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => errorElement.classList.remove('animate__animated', 'animate__shakeX'), 500);
    return;
  }

  const storedPassword = localStorage.getItem(username);

  if (storedPassword && storedPassword === password) {
    localStorage.setItem("currentUser", username);
    currentUser = username;
    showMainContent();
    showSuccessMessage("welcome", "Welcome back to SBC!");
  } else {
    errorElement.textContent = "Invalid credentials. Please try again.";
    errorElement.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => errorElement.classList.remove('animate__animated', 'animate__shakeX'), 500);
  }
}

function logout() {
  localStorage.removeItem("currentUser");
  currentUser = null;
  showWelcome();
}

// Change user password
function changeUserPassword() {
  const currentPassword = document.getElementById("currentUserPassword").value;
  const newPassword = document.getElementById("newUserPassword").value;
  const confirmPassword = document.getElementById("confirmUserPassword").value;
  const errorElement = document.getElementById("userPasswordError");
  
  if (!currentUser) {
    errorElement.textContent = "No user logged in";
    errorElement.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => errorElement.classList.remove('animate__animated', 'animate__shakeX'), 500);
    return;
  }
  
  if (!currentPassword || !newPassword || !confirmPassword) {
    errorElement.textContent = "All fields are required";
    errorElement.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => errorElement.classList.remove('animate__animated', 'animate__shakeX'), 500);
    return;
  }
  
  if (newPassword.length < 6) {
    errorElement.textContent = "New password must be at least 6 characters";
    errorElement.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => errorElement.classList.remove('animate__animated', 'animate__shakeX'), 500);
    return;
  }
  
  if (newPassword !== confirmPassword) {
    errorElement.textContent = "New passwords don't match";
    errorElement.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => errorElement.classList.remove('animate__animated', 'animate__shakeX'), 500);
    return;
  }
  
  const storedPassword = localStorage.getItem(currentUser);
  if (storedPassword !== currentPassword) {
    errorElement.textContent = "Current password is incorrect";
    errorElement.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => errorElement.classList.remove('animate__animated', 'animate__shakeX'), 500);
    return;
  }
  
  localStorage.setItem(currentUser, newPassword);
  errorElement.textContent = "";
  showSuccessMessage("welcome", "Password changed successfully!");
  document.getElementById("currentUserPassword").value = "";
  document.getElementById("newUserPassword").value = "";
  document.getElementById("confirmUserPassword").value = "";
  document.getElementById("userChangePasswordSection").style.display = "none";
}

// Show main content
function showMainContent() {
  hideAllPages();
  const page = document.getElementById("mainContent");
  page.style.display = "block";
  animateElements(page);
  loadItems();
}

// Admin Registration and Login
function showAdminRegistration() {
  hideAllPages();
  clearErrors();
  const page = document.getElementById("adminRegistration");
  page.style.display = "block";
  animateElements(page);
}

function showAdminLogin() {
  hideAllPages();
  clearErrors();
  const page = document.getElementById("adminLogin");
  page.style.display = "block";
  animateElements(page);
}

function adminRegister() {
  const username = document.getElementById("adminRegUsername").value.trim();
  const password = document.getElementById("adminRegPassword").value.trim();
  const errorElement = document.getElementById("adminRegError");

  if (!username || !password) {
    errorElement.textContent = "Username and password are required";
    errorElement.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => errorElement.classList.remove('animate__animated', 'animate__shakeX'), 500);
    return;
  }
  if (password.length < 6) {
    errorElement.textContent = "Password must be at least 6 characters";
    errorElement.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => errorElement.classList.remove('animate__animated', 'animate__shakeX'), 500);
    return;
  }

  if (localStorage.getItem(username)) {
    errorElement.textContent = "Admin username already exists. Please choose a different username.";
    errorElement.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => errorElement.classList.remove('animate__animated', 'animate__shakeX'), 500);
  } else {
    localStorage.setItem(username, password);
    showSuccessMessage("registerSuccess", "Admin registered successfully! You can now log in.");
    showAdminLogin();
  }
}

function adminLogin() {
  const username = document.getElementById("adminUsername").value.trim();
  const password = document.getElementById("adminPassword").value.trim();
  const errorElement = document.getElementById("adminLoginError");

  if (!username || !password) {
    errorElement.textContent = "Username and password are required";
    errorElement.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => errorElement.classList.remove('animate__animated', 'animate__shakeX'), 500);
    return;
  }

  const storedPassword = localStorage.getItem(username);

  if (storedPassword && storedPassword === password) {
    localStorage.setItem("currentAdmin", username);
    currentAdmin = username;
    showItemManagement();
    showSuccessMessage("welcome", "Welcome back, Admin!");
  } else {
    errorElement.textContent = "Invalid credentials. Please try again.";
    errorElement.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => errorElement.classList.remove('animate__animated', 'animate__shakeX'), 500);
  }
}

// Change admin password
function changeAdminPassword() {
  const currentPassword = document.getElementById("currentAdminPassword").value;
  const newPassword = document.getElementById("newAdminPassword").value;
  const confirmPassword = document.getElementById("confirmAdminPassword").value;
  const errorElement = document.getElementById("adminPasswordError");
  
  if (!currentAdmin) {
    errorElement.textContent = "No admin logged in";
    errorElement.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => errorElement.classList.remove('animate__animated', 'animate__shakeX'), 500);
    return;
  }
  
  if (!currentPassword || !newPassword || !confirmPassword) {
    errorElement.textContent = "All fields are required";
    errorElement.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => errorElement.classList.remove('animate__animated', 'animate__shakeX'), 500);
    return;
  }
  
  if (newPassword.length < 6) {
    errorElement.textContent = "New password must be at least 6 characters";
    errorElement.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => errorElement.classList.remove('animate__animated', 'animate__shakeX'), 500);
    return;
  }
  
  if (newPassword !== confirmPassword) {
    errorElement.textContent = "New passwords don't match";
    errorElement.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => errorElement.classList.remove('animate__animated', 'animate__shakeX'), 500);
    return;
  }
  
  const storedPassword = localStorage.getItem(currentAdmin);
  if (storedPassword !== currentPassword) {
    errorElement.textContent = "Current password is incorrect";
    errorElement.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => errorElement.classList.remove('animate__animated', 'animate__shakeX'), 500);
    return;
  }
  
  localStorage.setItem(currentAdmin, newPassword);
  errorElement.textContent = "";
  showSuccessMessage("welcome", "Admin password changed successfully!");
  document.getElementById("currentAdminPassword").value = "";
  document.getElementById("newAdminPassword").value = "";
  document.getElementById("confirmAdminPassword").value = "";
  document.getElementById("adminChangePasswordSection").style.display = "none";
}

function adminLogout() {
  localStorage.removeItem("currentAdmin");
  currentAdmin = null;
  showWelcome();
}

function showItemManagement() {
  hideAllPages();
  const page = document.getElementById("itemManagement");
  page.style.display = "block";
  animateElements(page);
  loadItems();
}

// Item Management
function addItem() {
  const name = document.getElementById("itemName").value.trim();
  const price = parseFloat(document.getElementById("itemPrice").value);
  const quantity = parseInt(document.getElementById("itemQuantity").value);
  const errorElement = document.getElementById("itemError");

  if (!name) {
    errorElement.textContent = "Item name is required";
    errorElement.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => errorElement.classList.remove('animate__animated', 'animate__shakeX'), 500);
    return;
  }
  if (isNaN(price) || price <= 0) {
    errorElement.textContent = "Please enter a valid price";
    errorElement.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => errorElement.classList.remove('animate__animated', 'animate__shakeX'), 500);
    return;
  }
  if (isNaN(quantity) || quantity < 0) {
    errorElement.textContent = "Please enter a valid quantity";
    errorElement.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => errorElement.classList.remove('animate__animated', 'animate__shakeX'), 500);
    return;
  }

  const items = JSON.parse(localStorage.getItem("items")) || [];
  
  const existingItemIndex = items.findIndex(item => item.name.toLowerCase() === name.toLowerCase());
  
  if (existingItemIndex >= 0) {
    items[existingItemIndex].price = price;
    items[existingItemIndex].quantity += quantity;
    showSuccessMessage("welcome", `Item "${name}" updated successfully!`);
  } else {
    items.push({ name, price, quantity });
    showSuccessMessage("welcome", `Item "${name}" added successfully!`);
  }

  localStorage.setItem("items", JSON.stringify(items));

  document.getElementById("itemName").value = '';
  document.getElementById("itemPrice").value = '';
  document.getElementById("itemQuantity").value = '';
  errorElement.textContent = '';

  loadItems();
}

function loadItems() {
  const items = JSON.parse(localStorage.getItem("items")) || [];
  
  // User view
  const itemTable = document.getElementById("itemTable");
  const itemsTable = document.getElementById("itemsTable");
  const noItemsMessage = document.getElementById("noItemsMessage");

  itemTable.innerHTML = '';
  
  if (items.length === 0) {
    itemsTable.style.display = "none";
    noItemsMessage.style.display = "block";
    noItemsMessage.classList.add('animate__animated', 'animate__shakeX');
  } else {
    itemsTable.style.display = "table";
    itemsTable.classList.add('animate__animated', 'animate__fadeIn');
    noItemsMessage.style.display = "none";
    noItemsMessage.classList.remove('animate__animated', 'animate__shakeX');
    
    items.forEach((item, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.price.toFixed(2)}</td>
        <td>${item.quantity}</td>
        <td><input type="number" id="quantity-${index}" min="0" max="${item.quantity}" value="0"></td>
      `;
      row.classList.add('animate__animated', 'animate__fadeIn');
      row.style.animationDelay = `${index * 0.1}s`;
      itemTable.appendChild(row);
    });
  }

  // Admin view
  const existingItems = document.getElementById("existingItems");
  existingItems.innerHTML = '';

  if (items.length === 0) {
    existingItems.innerHTML = '<p>No items available. Please add items.</p>';
  } else {
    items.forEach((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "item-row";
      itemDiv.style.margin = "5px 0";
      itemDiv.innerHTML = `
        <input type="checkbox" id="item-${index}" class="item-checkbox">
        <label for="item-${index}">
          <strong>${item.name}</strong> - Price: ₹${item.price.toFixed(2)}, Quantity: ${item.quantity}
        </label>
      `;
      itemDiv.classList.add('animate__animated', 'animate__fadeIn');
      itemDiv.style.animationDelay = `${index * 0.1}s`;
      existingItems.appendChild(itemDiv);
    });
  }
}

function removeSelectedItems() {
  const items = JSON.parse(localStorage.getItem("items")) || [];
  const checkboxes = document.querySelectorAll(".item-checkbox:checked");
  
  if (checkboxes.length === 0) {
    showSuccessMessage("welcome", "Please select at least one item to remove.");
    return;
  }
  
  const indicesToRemove = Array.from(checkboxes).map(checkbox => 
    parseInt(checkbox.id.split("-")[1])
  );
  
  const updatedItems = items.filter((_, index) => !indicesToRemove.includes(index));
  
  localStorage.setItem("items", JSON.stringify(updatedItems));
  loadItems();
  showSuccessMessage("welcome", `${indicesToRemove.length} item(s) removed successfully.`);
}

function updateExistingItems() {
  const items = JSON.parse(localStorage.getItem("items")) || [];
  const checkboxes = document.querySelectorAll(".item-checkbox:checked");
  
  if (checkboxes.length === 0) {
    showSuccessMessage("welcome", "Please select at least one item to update.");
    return;
  }
  
  let updatedCount = 0;
  
  checkboxes.forEach(checkbox => {
    const index = parseInt(checkbox.id.split("-")[1]);
    const item = items[index];
    
    const newName = prompt(`Enter new name for ${item.name}:`, item.name);
    if (newName === null) return;
    
    const newPrice = parseFloat(prompt(`Enter new price for ${newName}:`, item.price));
    if (isNaN(newPrice)) {
      showSuccessMessage("welcome", "Invalid price. Update cancelled for this item.");
      return;
    }
    
    const newQuantity = parseInt(prompt(`Enter new quantity for ${newName}:`, item.quantity));
    if (isNaN(newQuantity)) {
      showSuccessMessage("welcome", "Invalid quantity. Update cancelled for this item.");
      return;
    }
    
    items[index].name = newName.trim();
    items[index].price = newPrice;
    items[index].quantity = newQuantity;
    updatedCount++;
  });
  
  if (updatedCount > 0) {
    localStorage.setItem("items", JSON.stringify(items));
    loadItems();
    showSuccessMessage("welcome", `${updatedCount} item(s) updated successfully.`);
  }
}

// User Management Functions
function toggleUserDetails() {
  const userDetails = document.getElementById("userDetails");
  if (userDetails.style.display === "none" || userDetails.style.display === "") {
    loadUserDetails();
    userDetails.style.display = "block";
    userDetails.classList.add('animate__animated', 'animate__fadeIn');
  } else {
    userDetails.style.display = "none";
    userDetails.classList.remove('animate__animated', 'animate__fadeIn');
  }
}

function loadUserDetails() {
  const userTableBody = document.getElementById("userTableBody");
  userTableBody.innerHTML = "";
  
  const users = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!["currentUser", "currentAdmin", "items"].includes(key) && 
        !key.endsWith("_history") && 
        !localStorage.getItem(key).startsWith("{")) {
      users.push(key);
    }
  }
  
  if (users.length === 0) {
    userTableBody.innerHTML = "<tr><td colspan='2'>No users found</td></tr>";
    return;
  }
  
  users.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user}</td>
      <td><button onclick="deleteUser('${user}')" class="ripple">Delete</button></td>
    `;
    row.classList.add('animate__animated', 'animate__fadeIn');
    row.style.animationDelay = `${index * 0.1}s`;
    userTableBody.appendChild(row);
  });
}

function deleteUser(username) {
  if (confirm(`Are you sure you want to delete user "${username}"? This will also delete their history.`)) {
    localStorage.removeItem(username);
    localStorage.removeItem(`${username}_history`);
    loadUserDetails();
    showSuccessMessage("welcome", `User "${username}" deleted successfully.`);
  }
}

// Admin History Management
function toggleAdminHistory() {
  const adminHistory = document.getElementById("adminHistory");
  if (adminHistory.style.display === "none" || adminHistory.style.display === "") {
    loadAdminHistory();
    adminHistory.style.display = "block";
    adminHistory.classList.add('animate__animated', 'animate__fadeIn');
  } else {
    adminHistory.style.display = "none";
    adminHistory.classList.remove('animate__animated', 'animate__fadeIn');
  }
}

function loadAdminHistory() {
  const adminHistoryTableBody = document.getElementById("adminHistoryTableBody");
  adminHistoryTableBody.innerHTML = "";
  
  const usersWithHistory = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.endsWith("_history")) {
      usersWithHistory.push(key.replace("_history", ""));
    }
  }
  
  if (usersWithHistory.length === 0) {
    adminHistoryTableBody.innerHTML = "<tr><td colspan='4'>No bill history found</td></tr>";
    return;
  }
  
  usersWithHistory.forEach((username, userIndex) => {
    const history = JSON.parse(localStorage.getItem(`${username}_history`)) || [];
    history.forEach((entry, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${username}</td>
        <td>${formatDate(entry.date)}</td>
        <td>₹${entry.grandTotal.toFixed(2)}</td>
        <td>
          <button onclick="viewAdminBillDetails('${username}', ${index})" class="ripple">View</button>
          <button onclick="deleteAdminHistoryItem('${username}', ${index})" class="ripple">Delete</button>
        </td>
      `;
      row.classList.add('animate__animated', 'animate__fadeIn');
      row.style.animationDelay = `${(userIndex * history.length + index) * 0.1}s`;
      adminHistoryTableBody.appendChild(row);
    });
  });
}

function viewAdminBillDetails(username, index) {
  const history = JSON.parse(localStorage.getItem(`${username}_history`)) || [];
  if (index >= 0 && index < history.length) {
    document.getElementById("adminHistoryContent").innerHTML = history[index].billContent;
    document.getElementById("adminGrandTotal").textContent = history[index].grandTotal.toFixed(2);
    const adminHistoryDisplay = document.getElementById("adminHistoryDisplay");
    adminHistoryDisplay.style.display = "block";
    adminHistoryDisplay.classList.add('animate__animated', 'animate__fadeInUp');
  }
}

function hideAdminHistory() {
  const adminHistoryDisplay = document.getElementById("adminHistoryDisplay");
  adminHistoryDisplay.style.display = "none";
  adminHistoryDisplay.classList.remove('animate__animated', 'animate__fadeInUp');
}

function deleteAdminHistoryItem(username, index) {
  if (confirm(`Are you sure you want to delete this bill from ${username}'s history?`)) {
    const history = JSON.parse(localStorage.getItem(`${username}_history`)) || [];
    history.splice(index, 1);
    localStorage.setItem(`${username}_history`, JSON.stringify(history));
    loadAdminHistory();
    showSuccessMessage("welcome", "Bill history item deleted successfully.");
  }
}

// Bill Generation
function generateBill() {
  const items = JSON.parse(localStorage.getItem("items")) || [];
  let billContent = "";
  let grandTotal = 0;
  let insufficientStock = false;
  let hasItems = false;

  for (let i = 0; i < items.length; i++) {
    const quantity = parseInt(document.getElementById(`quantity-${i}`).value) || 0;
    if (quantity > 0) {
      hasItems = true;
      if (quantity > items[i].quantity) {
        insufficientStock = true;
        showSuccessMessage("welcome", `Insufficient stock for ${items[i].name}. Available quantity: ${items[i].quantity}`);
      } else {
        const amount = quantity * items[i].price;
        grandTotal += amount;
        billContent += `<tr><td>${items[i].name}</td><td>${quantity}</td><td>₹${amount.toFixed(2)}</td></tr>`;
        items[i].quantity -= quantity;
      }
    }
  }

  if (!hasItems) {
    showSuccessMessage("welcome", "Please select at least one item.");
    return;
  }

  if (grandTotal > 0 && !insufficientStock) {
    document.getElementById("billContent").innerHTML = billContent;
    document.getElementById("grandTotal").textContent = grandTotal.toFixed(2);
    const billDisplay = document.getElementById("billDisplay");
    billDisplay.style.display = "block";
    billDisplay.classList.add('animate__animated', 'animate__fadeInUp');
    localStorage.setItem("items", JSON.stringify(items));
    saveToHistory(grandTotal, billContent);
    showSuccessMessage("billSuccess", "Bill generated successfully!");
  } else if (insufficientStock) {
    showSuccessMessage("welcome", "Please adjust your quantities and try again.");
  }
}

function resetValues() {
  const inputs = document.querySelectorAll("input[type=number]");
  inputs.forEach(input => {
    if (input.id.startsWith("quantity-")) {
      input.value = 0;
    }
  });
  const billDisplay = document.getElementById("billDisplay");
  billDisplay.style.display = "none";
  billDisplay.classList.remove('animate__animated', 'animate__fadeInUp');
}

// History Management
function saveToHistory(grandTotal, billContent) {
  if (!currentUser) return;
  
  const history = JSON.parse(localStorage.getItem(`${currentUser}_history`)) || [];
  history.push({ date: new Date().toISOString(), grandTotal, billContent });
  localStorage.setItem(`${currentUser}_history`, JSON.stringify(history));
}

function viewHistory() {
  if (!currentUser) {
    showSuccessMessage("welcome", "Please login to view history.");
    return;
  }
  
  const history = JSON.parse(localStorage.getItem(`${currentUser}_history`)) || [];
  const historyContent = document.getElementById("historyContent");
  historyContent.innerHTML = "";
  
  if (history.length === 0) {
    historyContent.innerHTML = "<tr><td colspan='3'>No history available</td></tr>";
  } else {
    history.forEach((entry, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${formatDate(entry.date)}</td>
        <td><button onclick="viewBillDetails(${index})" class="ripple">View Bill ${index + 1}</button></td>
        <td>₹${entry.grandTotal.toFixed(2)}</td>
      `;
      row.classList.add('animate__animated', 'animate__fadeIn');
      row.style.animationDelay = `${index * 0.1}s`;
      historyContent.appendChild(row);
    });
  }
  
  const historyDisplay = document.getElementById("historyDisplay");
  historyDisplay.style.display = "block";
  historyDisplay.classList.add('animate__animated', 'animate__fadeInUp');
}

function hideHistory() {
  const historyDisplay = document.getElementById("historyDisplay");
  historyDisplay.style.display = "none";
  historyDisplay.classList.remove('animate__animated', 'animate__fadeInUp');
}

function viewBillDetails(index) {
  if (!currentUser) return;
  
  const history = JSON.parse(localStorage.getItem(`${currentUser}_history`)) || [];
  if (index >= 0 && index < history.length) {
    document.getElementById("billContent").innerHTML = history[index].billContent;
    document.getElementById("grandTotal").textContent = history[index].grandTotal.toFixed(2);
    const billDisplay = document.getElementById("billDisplay");
    billDisplay.style.display = "block";
    billDisplay.classList.add('animate__animated', 'animate__fadeInUp');
  }
}

function clearHistory() {
  if (!currentUser) {
    showSuccessMessage("welcome", "Please login to clear history.");
    return;
  }
  
  if (confirm("Are you sure you want to clear all your calculation history?")) {
    localStorage.removeItem(`${currentUser}_history`);
    document.getElementById("historyContent").innerHTML = "";
    showSuccessMessage("welcome", "History cleared successfully.");
  }
}

// Initialize the app
window.onload = function() {
  if (currentUser || currentAdmin) {
    document.getElementById('preloader').style.display = 'none';
    checkExistingSession();
  } else {
    simulateProgress();
  }
};