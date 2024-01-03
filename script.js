
var prices = {
  "pizza": 14.00,
  "hamburger": 12.00,
  "beer": 12.00
};
var quantities = {};

console.log('test')

function addToOrder(id) {
  var orderList = document.getElementById("orderList");
  var currentQuantity = quantities[id] || 0; // Get the current quantity or default to 0

  currentQuantity++; // Increment the quantity



  if (quantities[id]) {
    quantities[id] = currentQuantity;
    updateQuantity(id);
  } else {
    quantities[id] = currentQuantity;
    var li = document.createElement("div");
    li.id = id;

    var span = document.createElement("span");
    span.appendChild(document.createTextNode(id));
    li.appendChild(span);

    var button = document.createElement("span");
    button.onclick = function () {
      removeFromOrder(id);
    };
    button.appendChild(document.createTextNode("Remove"));
    li.appendChild(button);

    var select = document.createElement("select");
    select.onchange = function () {
      quantities[id] = parseInt(this.value);
      updateTotal();
    };
    for (var i = 1; i <= 30; i++) {
      var option = document.createElement("option");
      option.value = i;
      option.text = i;
      select.appendChild(option);
    }
    select.value = quantities[id];
    console.log(quantities[id])
    li.appendChild(select);


    var price = document.createElement("span");
    price.appendChild(document.createTextNode("* $" + prices[id].toFixed(2)));
    li.appendChild(price);

    var subtotal = document.createElement("span");
    subtotal.id = id + "-subtotal";
    subtotal.appendChild(
      document.createTextNode(" = $" + (prices[id] * quantities[id]).toFixed(2))
    );
    li.appendChild(subtotal);

    orderList.appendChild(li);
  }

  // Show complete order button if there is at least one item in the cart
  if (Object.keys(quantities).length > 0) {
    document.getElementById("completeOrderButton").style.display = "block";
  }
}

function removeFromOrder(id) {
  if (quantities[id]) {
    delete quantities[id];
    var li = document.getElementById(id);
    li.parentNode.removeChild(li);

    // Remove the corresponding subtotal
    var subtotal = document.getElementById(id + "-subtotal");
    if (subtotal) {
      subtotal.parentNode.removeChild(subtotal);
    }

    updateTotal();

    // Hide complete order button if there are no items in the cart
    if (Object.keys(quantities).length === 0) {
      document.getElementById("completeOrderButton").style.display = "none";
    }
  }
}

function updateQuantity(id) {
  var li = document.getElementById(id);
  var select = li.getElementsByTagName("select")[0];
  select.value = quantities[id];

  updateTotal();

  console.log(select.value)
}

function updateTotal() {
  var totalElement = document.getElementById("total");
  var newTotal = 0;

  for (var id in quantities) {
    newTotal += prices[id] * quantities[id];

    // Update the subtotal for the item
    var subtotalElement = document.getElementById(id + "-subtotal");
    if (subtotalElement) {
      subtotalElement.textContent = " = $" + (prices[id] * quantities[id]).toFixed(2);
    }
  }

  totalElement.innerHTML = newTotal.toFixed(2);
}

// Add event listener to complete order button
document.getElementById("completeOrderButton").addEventListener("click", function() {
  // Show payment modal
  document.getElementById("paymentModal").style.display = "block";
  // Hide complete order button
  this.style.display = "none";
});

// Add event listener to back button inside the payment modal
document.getElementById("backToCartButton").addEventListener("click", function () {
  // Hide payment modal
  document.getElementById("paymentModal").style.display = "none";
  // Show complete order button
  document.getElementById("completeOrderButton").style.display = "block";

  // Clear input fields in the payment modal
  document.getElementById("nameInput").value = "";
  document.getElementById("cardNumberInput").value = "";
  document.getElementById("cvvInput").value = "";

  // Clear validation message
  document.getElementById("validationMessage").innerHTML = "";
});


// Add event listener to pay button
document.getElementById("payButton").addEventListener("click", function() {
  // Get user's name, card number, and CVV
  var name = document.getElementById("nameInput").value;
  var cardNumber = document.getElementById("cardNumberInput").value;
  var cvv = document.getElementById("cvvInput").value;

  // Validate name, card number, and CVV
  var validationMessage = "";
  if (!/^[a-zA-Z]{2,}$/.test(name)) {
      validationMessage += "Name must be at least 2 characters and only letters.<br />";
  }
  if (!/^\d{16}$/.test(cardNumber)) {
      validationMessage += "Card number must be 16 digits and only numbers.<br />";
  }
  if (!/^\d{3}$/.test(cvv)) {
      validationMessage += "CVV must be 3 digits and only numbers.<br />";
  }

  if (validationMessage) {
      // Show validation message
      document.getElementById("validationMessage").innerHTML = validationMessage;
      return;
  }

  // Clear cart information
  quantities = {};
  document.getElementById("orderList").innerHTML = "";
  updateTotal();

  // Hide payment modal
  document.getElementById("paymentModal").style.display = "none";

  // Show thank you text
  document.getElementById("thankYouText").innerHTML = "Thank you for your order, " + name + "!";
  document.getElementById("thankYouText").style.display = "block";
});