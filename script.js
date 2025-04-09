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

// Preloader animation - Modified to check for existing session
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

// New function to check existing session
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
    document.getElementById('welcomePage').style.display = 'block';
    animateElements(document.getElementById('welcomePage'));
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
  if (section.style.display === "none") {
    section.style.display = "block";
  } else {
    section.style.display = "none";
  }
}

// Show success message
function showSuccessMessage(type, message) {
  const msgElement = document.getElementById(`${type}Message`);
  if (msgElement) {
    msgElement.textContent = message;
    msgElement.style.display = "flex";
    setTimeout(() => {
      msgElement.style.display = "none";
    }, 3500);
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
  const elements = container.querySelectorAll('h1, h2, h3, input, button, table');
  elements.forEach((el, index) => {
    el.classList.add('animate__animated', 'animate__fadeIn');
    el.style.animationDelay = `${index * 0.1}s`;
  });
}

function register() {
  const username = document.getElementById("regUsername").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const errorElement = document.getElementById("regError");

  // Validation
  if (!username || !password) {
    errorElement.textContent = "Username and password are required";
    return;
  }
  if (password.length < 6) {
    errorElement.textContent = "Password must be at least 6 characters";
    return;
  }

  if (localStorage.getItem(username)) {
    errorElement.textContent = "Username already exists. Please choose a different username.";
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
  
  // Validation
  if (!currentUser) {
    errorElement.textContent = "No user logged in";
    return;
  }
  
  if (!currentPassword || !newPassword || !confirmPassword) {
    errorElement.textContent = "All fields are required";
    return;
  }
  
  if (newPassword.length < 6) {
    errorElement.textContent = "New password must be at least 6 characters";
    return;
  }
  
  if (newPassword !== confirmPassword) {
    errorElement.textContent = "New passwords don't match";
    return;
  }
  
  const storedPassword = localStorage.getItem(currentUser);
  if (storedPassword !== currentPassword) {
    errorElement.textContent = "Current password is incorrect";
    return;
  }
  
  // Change password
  localStorage.setItem(currentUser, newPassword);
  errorElement.textContent = "";
  showSuccessMessage("welcome", "Password changed successfully!");
  document.getElementById("currentUserPassword").value = "";
  document.getElementById("newUserPassword").value = "";
  document.getElementById("confirmUserPassword").value = "";
  document.getElementById("userChangePasswordSection").style.display = "none";
}

// Show main content and hide all other pages
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

  // Validation
  if (!username || !password) {
    errorElement.textContent = "Username and password are required";
    return;
  }
  if (password.length < 6) {
    errorElement.textContent = "Password must be at least 6 characters";
    return;
  }

  if (localStorage.getItem(username)) {
    errorElement.textContent = "Admin username already exists. Please choose a different username.";
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
  }
}

// Change admin password
function changeAdminPassword() {
  const currentPassword = document.getElementById("currentAdminPassword").value;
  const newPassword = document.getElementById("newAdminPassword").value;
  const confirmPassword = document.getElementById("confirmAdminPassword").value;
  const errorElement = document.getElementById("adminPasswordError");
  
  // Validation
  if (!currentAdmin) {
    errorElement.textContent = "No admin logged in";
    return;
  }
  
  if (!currentPassword || !newPassword || !confirmPassword) {
    errorElement.textContent = "All fields are required";
    return;
  }
  
  if (newPassword.length < 6) {
    errorElement.textContent = "New password must be at least 6 characters";
    return;
  }
  
  if (newPassword !== confirmPassword) {
    errorElement.textContent = "New passwords don't match";
    return;
  }
  
  const storedPassword = localStorage.getItem(currentAdmin);
  if (storedPassword !== currentPassword) {
    errorElement.textContent = "Current password is incorrect";
    return;
  }
  
  // Change password
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

  // Validation
  if (!name) {
    errorElement.textContent = "Item name is required";
    return;
  }
  if (isNaN(price) || price <= 0) {
    errorElement.textContent = "Please enter a valid price";
    return;
  }
  if (isNaN(quantity) || quantity < 0) {
    errorElement.textContent = "Please enter a valid quantity";
    return;
  }

  const items = JSON.parse(localStorage.getItem("items")) || [];
  
  // Check if item already exists
  const existingItemIndex = items.findIndex(item => item.name.toLowerCase() === name.toLowerCase());
  
  if (existingItemIndex >= 0) {
    // Update existing item
    items[existingItemIndex].price = price;
    items[existingItemIndex].quantity += quantity;
    showSuccessMessage("welcome", `Item "${name}" updated successfully!`);
  } else {
    // Add new item
    items.push({ 
      name, 
      price, 
      quantity 
    });
    showSuccessMessage("welcome", `Item "${name}" added successfully!`);
  }

  localStorage.setItem("items", JSON.stringify(items));

  // Clear form
  document.getElementById("itemName").value = '';
  document.getElementById("itemPrice").value = '';
  document.getElementById("itemQuantity").value = '';
  errorElement.textContent = '';

  loadItems();
  
  // Add animation to the new item
  const itemRows = document.querySelectorAll(".item-row");
  if (itemRows.length > 0) {
    const lastItem = itemRows[itemRows.length - 1];
    lastItem.classList.add("animate__animated", "animate__fadeIn");
  }
}

function loadItems() {
  const items = JSON.parse(localStorage.getItem("items")) || [];
  
  // Load items for main content (user view)
  const itemTable = document.getElementById("itemTable");
  const itemsTable = document.getElementById("itemsTable");
  const noItemsMessage = document.getElementById("noItemsMessage");

  itemTable.innerHTML = '';
  
  if (items.length === 0) {
    itemsTable.style.display = "none";
    noItemsMessage.style.display = "block";
  } else {
    itemsTable.style.display = "table";
    noItemsMessage.style.display = "none";
    
    items.forEach((item, index) => {
      const row = `<tr>
        <td>${item.name}</td>
        <td>${item.price.toFixed(2)}</td>
        <td>${item.quantity}</td>
        <td><input type="number" id="quantity-${index}" min="0" max="${item.quantity}" value="0"></td>
      </tr>`;
      itemTable.innerHTML += row;
    });
  }

  // Load items for admin view (item management)
  const existingItems = document.getElementById("existingItems");
  existingItems.innerHTML = '';

  if (items.length === 0) {
    existingItems.innerHTML = '<p>No items available. Please add items.</p>';
  } else {
    items.forEach((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "item-row";
      itemDiv.style.margin = "5px 0";
      
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `item-${index}`;
      checkbox.className = "item-checkbox";
      
      const label = document.createElement("label");
      label.htmlFor = `item-${index}`;
      label.innerHTML = `
        <strong>${item.name}</strong> - 
        Price: ₹${item.price.toFixed(2)}, 
        Quantity: ${item.quantity}
      `;
      
      itemDiv.appendChild(checkbox);
      itemDiv.appendChild(label);
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
  
  // Get indices of selected items
  const indicesToRemove = Array.from(checkboxes).map(checkbox => 
    parseInt(checkbox.id.split("-")[1])
  );
  
  // Filter out selected items
  const updatedItems = items.filter((_, index) => 
    !indicesToRemove.includes(index)
  );
  
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
    if (newName === null) return; // User cancelled
    
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
  if (userDetails.style.display === "none") {
    loadUserDetails();
    userDetails.style.display = "block";
    document.querySelector(".toggle-btn").textContent = "Hide User Details";
  } else {
    userDetails.style.display = "none";
    document.querySelector(".toggle-btn").textContent = "Show User Details";
  }
}

function loadUserDetails() {
  const userTableBody = document.getElementById("userTableBody");
  userTableBody.innerHTML = "";
  
  // Get all keys from localStorage
  const users = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    // Skip items that are not user accounts (like currentUser, currentAdmin, items, etc.)
    if (!["currentUser", "currentAdmin", "items"].includes(key) && 
        !key.endsWith("_history") && 
        !localStorage.getItem(key).startsWith("{")) { // Skip JSON objects
      users.push(key);
    }
  }
  
  if (users.length === 0) {
    userTableBody.innerHTML = "<tr><td colspan='2'>No users found</td></tr>";
    return;
  }
  
  users.forEach(user => {
    const row = document.createElement("tr");
    row.classList.add("animate__animated", "animate__fadeIn");
    
    const usernameCell = document.createElement("td");
    usernameCell.textContent = user;
    
    const actionsCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function() { deleteUser(user); };
    deleteButton.classList.add("animate__animated", "animate__pulse", "ripple");
    
    actionsCell.appendChild(deleteButton);
    row.appendChild(usernameCell);
    row.appendChild(actionsCell);
    
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
  if (adminHistory.style.display === "none") {
    loadAdminHistory();
    adminHistory.style.display = "block";
    document.querySelector(".toggle-admin-history").textContent = "Hide All Bill History";
  } else {
    adminHistory.style.display = "none";
    document.querySelector(".toggle-admin-history").textContent = "Show All Bill History";
  }
}

function loadAdminHistory() {
  const adminHistoryTableBody = document.getElementById("adminHistoryTableBody");
  adminHistoryTableBody.innerHTML = "";
  
  // Get all users with history
  const usersWithHistory = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.endsWith("_history")) {
      const username = key.replace("_history", "");
      usersWithHistory.push(username);
    }
  }
  
  if (usersWithHistory.length === 0) {
    adminHistoryTableBody.innerHTML = "<tr><td colspan='4'>No bill history found</td></tr>";
    return;
  }
  
  // For each user, get their history and add to table
  usersWithHistory.forEach(username => {
    const history = JSON.parse(localStorage.getItem(`${username}_history`)) || [];
    
    history.forEach((entry, index) => {
      const row = document.createElement("tr");
      row.classList.add("animate__animated", "animate__fadeIn");
      
      const usernameCell = document.createElement("td");
      usernameCell.textContent = username;
      
      const dateCell = document.createElement("td");
      dateCell.textContent = formatDate(entry.date);
      
      const totalCell = document.createElement("td");
      totalCell.textContent = `₹${entry.grandTotal.toFixed(2)}`;
      
      const actionsCell = document.createElement("td");
      const viewButton = document.createElement("button");
      viewButton.textContent = "View";
      viewButton.onclick = function() { viewAdminBillDetails(username, index); };
      viewButton.classList.add("animate__animated", "animate__pulse", "ripple");
      
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.onclick = function() { deleteAdminHistoryItem(username, index); };
      deleteButton.classList.add("animate__animated", "animate__pulse", "ripple");
      
      actionsCell.appendChild(viewButton);
      actionsCell.appendChild(deleteButton);
      row.appendChild(usernameCell);
      row.appendChild(dateCell);
      row.appendChild(totalCell);
      row.appendChild(actionsCell);
      
      adminHistoryTableBody.appendChild(row);
    });
  });
}

function viewAdminBillDetails(username, index) {
  const history = JSON.parse(localStorage.getItem(`${username}_history`)) || [];
  if (index >= 0 && index < history.length) {
    document.getElementById("adminHistoryContent").innerHTML = history[index].billContent;
    document.getElementById("adminGrandTotal").textContent = history[index].grandTotal.toFixed(2);
    document.getElementById("adminHistoryDisplay").style.display = "block";
  }
}

function hideAdminHistory() {
  document.getElementById("adminHistoryDisplay").style.display = "none";
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
        // Update the item quantity in local storage
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
    document.getElementById("billDisplay").style.display = "block";
    localStorage.setItem("items", JSON.stringify(items)); // Update items in local storage
    saveToHistory(grandTotal, billContent); // Save the bill to history
    showSuccessMessage("billSuccess", "Bill generated successfully!");
  } else if (insufficientStock) {
    showSuccessMessage("welcome", "Please adjust your quantities and try again.");
  }
}

function resetValues() {
  const inputs = document.querySelectorAll("input[type=number]");
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].id.startsWith("quantity-")) {
      inputs[i].value = 0;
    }
  }
  document.getElementById("billDisplay").style.display = "none";
}

// History Management
function saveToHistory(grandTotal, billContent) {
  if (!currentUser) return;
  
  const history = JSON.parse(localStorage.getItem(`${currentUser}_history`)) || [];
  history.push({ 
    date: new Date().toISOString(),
    grandTotal, 
    billContent 
  });
  localStorage.setItem(`${currentUser}_history`, JSON.stringify(history));
}

function viewHistory() {
  if (!currentUser) {
    showSuccessMessage("welcome", "Please login to view history.");
    return;
  }
  
  const history = JSON.parse(localStorage.getItem(`${currentUser}_history`)) || [];
  
  let historyContent = "";
  if (history.length === 0) {
    historyContent = "<tr><td colspan='3'>No history available</td></tr>";
  } else {
    history.forEach((entry, index) => {
      historyContent += `
        <tr class="animate__animated animate__fadeIn">
          <td>${formatDate(entry.date)}</td>
          <td><button onclick="viewBillDetails(${index})" class="ripple">View Bill ${index + 1}</button></td>
          <td>₹${entry.grandTotal.toFixed(2)}</td>
        </tr>`;
    });
  }
  
  document.getElementById("historyContent").innerHTML = historyContent;
  document.getElementById("historyDisplay").style.display = "block";
}

function hideHistory() {
  document.getElementById("historyDisplay").style.display = "none";
}

function viewBillDetails(index) {
  if (!currentUser) return;
  
  const history = JSON.parse(localStorage.getItem(`${currentUser}_history`)) || [];
  if (index >= 0 && index < history.length) {
    const billDetails = history[index].billContent;
    document.getElementById("billContent").innerHTML = billDetails;
    document.getElementById("grandTotal").textContent = history[index].grandTotal.toFixed(2);
    document.getElementById("billDisplay").style.display = "block";
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
  // Check if we're coming from a refresh and already past preloader
  if (currentUser || currentAdmin) {
    document.getElementById('preloader').style.display = 'none';
    checkExistingSession();
  } else {
    // Start preloader animation only if no existing session
    simulateProgress();
  }
};