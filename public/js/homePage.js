// Select various elements from the HTML document using their IDs and classes.
const categoryItems = document.querySelectorAll(".dropdown-item");
const categoryInput = document.querySelector("#categoryInput");
const categoryBtn = document.querySelector("#categoryBtn");
const form = document.getElementById("form1");
const addExpenseBtn = document.getElementById("submitBtn");
const table = document.getElementById("tbodyId");
const buyPremiumBtn = document.getElementById("buyPremiumBtn");
const reportsLink = document.getElementById("reportsLink");
const leaderboardLink = document.getElementById("leaderboardLink");

// Attach event listeners to each category item in a dropdown.
categoryItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    // When a category item is clicked, update the selected category in the UI.
    const selectedCategory = e.target.getAttribute("data-value");
    categoryBtn.textContent = e.target.textContent;
    categoryInput.value = selectedCategory;
  });
});

// Function to handle the premium membership purchase.
async function buyPremium(e) {
  // Get the user's token from local storage.
  const token = localStorage.getItem("token");

  // Send a GET request to the server to initiate the premium membership purchase.
  const res = await axios.get("http://localhost:3000/purchase/premiumMembership", {
    headers: { Authorization: token },
  });
  console.log(res);

  // Configure payment options using the response from the server.
  var options = {
    key: res.data.key_id, // Enter the Key ID generated from the Dashboard
    order_id: res.data.order.id, // For one-time payment

    // This handler function will handle the successful payment.
    handler: async function (response) {
      // Send a POST request to update the transaction status.
      const res = await axios.post(
        "http://localhost:3000/purchase/updateTransactionStatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );

      console.log(res);

      // Display a success message and update the user's token.
      alert("Welcome to our Premium Membership! You now have access to Reports and Leaderboard");
      localStorage.setItem("token", res.data.token);
    },
  };

  // Create a Razorpay instance with the configured options and open the payment modal.
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();
}

// Function to check if the user is a premium member and update UI accordingly.
async function isPremiumUser() {
  const token = localStorage.getItem("token");

  // Send a GET request to check if the user is a premium member.
  const res = await axios.get("http://localhost:3000/user/isPremiumUser", {
    headers: { Authorization: token },
  });

  if (res.data.isPremiumUser) {
    // If the user is a premium member, update UI elements.
    buyPremiumBtn.innerHTML = "Premium Member &#128081";
    reportsLink.removeAttribute("onclick");
    leaderboardLink.removeAttribute("onclick");
  }
}

// Function to add an expense record.
async function addExpense() {
  try {
    // Get user input values.
    const category = document.getElementById("categoryBtn");
    const description = document.getElementById("descriptionValue");
    const amount = document.getElementById("amountValue");
    const categoryValue = category.textContent.trim();
    const descriptionValue = description.value.trim();
    const amountValue = amount.value.trim();

    // Validate input values.
    if (categoryValue == "Select Category") {
      alert("Select the Category!");
      window.location.href("/homePage");
    }
    if (!descriptionValue) {
      alert("Add the Description!");
      window.location.href("/homePage");
    }
    if (!parseInt(amountValue)) {
      alert("Please enter a valid amount!");
      window.location.href("/homePage");
    }

    // Get the current date.
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    // Add leading zeros to day and month if needed.
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    // Create the date string in the format: date-month-year.
    const dateStr = `${formattedDay}-${formattedMonth}-${year}`;

    // Get the user's token from local storage.
    const token = localStorage.getItem("token");

    // Send a POST request to add the expense record.
    const res = await axios.post(
      "http://localhost:3000/expense/addExpense",
      {
        date: dateStr,
        category: categoryValue,
        description: descriptionValue,
        amount: parseInt(amountValue),
      },
      { headers: { Authorization: token } }
    );

    if (res.status == 200) {
      // If the request is successful, reload the page to update the expense list.
      window.location.reload();
    }
  } catch {
    console.error("AddExpense went wrong");
  }
}

// Function to retrieve and display all expenses.
async function getAllExpenses() {
  try {
    // Get the user's token from local storage.
    const token = localStorage.getItem("token");

    // Send a GET request to fetch all expenses.
    const res = await axios.get("http://localhost:3000/expense/getAllExpenses", {
      headers: { Authorization: token },
    });

    // Iterate through the expenses and create table rows to display them.
    res.data.forEach((expenses) => {
      const id = expenses.id;
      const date = expenses.date;
      const categoryValue = expenses.category;
      const descriptionValue = expenses.description;
      const amountValue = expenses.amount;

      // Create a table row.
      let tr = document.createElement("tr");
      tr.className = "trStyle";

      // Create table cells for ID, date, category, description, and amount.
      let idValue = document.createElement("th");
      idValue.setAttribute("scope", "row");
      idValue.setAttribute("style", "display: none");

      let th = document.createElement("th");
      th.setAttribute("scope", "row");

      tr.appendChild(idValue);
      tr.appendChild(th);

      idValue.appendChild(document.createTextNode(id));
      th.appendChild(document.createTextNode(date));

      let td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(categoryValue));

      let td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(descriptionValue));

      let td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(amountValue));

      let td4 = document.createElement("td");

      // Create buttons for deleting and editing expenses.
      let deleteBtn = document.createElement("button");
      deleteBtn.className = "editDelete btn btn-danger delete";
      deleteBtn.appendChild(document.createTextNode("Delete"));

      let editBtn = document.createElement("button");
      editBtn.className = "editDelete btn btn-success edit";
      editBtn.appendChild(document.createTextNode("Edit"));

      td4.appendChild(deleteBtn);
      td4.appendChild(editBtn);

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);

      // Append the row to the expense table.
      table.appendChild(tr);
    });
  } catch {
    (err) => console.log(err);
  }
}

// Function to handle the deletion of an expense.
async function deleteExpense(e) {
  try {
    // Get the user's token from local storage.
    const token = localStorage.getItem("token");

    // Check if the clicked element is a delete button.
    if (e.target.classList.contains("delete")) {
      // Get the row and ID of the expense to be deleted.
      let tr = e.target.parentElement.parentElement;
      let id = tr.children[0].textContent;

      // Send a GET request to delete the expense.
      const res = await axios.get(`http://localhost:3000/expense/deleteExpense/${id}`, {
        headers: { Authorization: token },
      });

      // Reload the page to update the expense list.
      window.location.reload();
    }
  } catch {
    (err) => console.log(err);
  }
}

// Function to handle the editing of an expense.
async function editExpense(e) {
  try {
    // Get the user's token from local storage.
    const token = localStorage.getItem("token");

    // Get references to various input fields.
    const categoryValue = document.getElementById("categoryBtn");
    const descriptionValue = document.getElementById("descriptionValue");
    const amountValue = document.getElementById("amountValue");
    const addExpenseBtn = document.getElementById("submitBtn");

    // Check if the clicked element is an edit button.
    if (e.target.classList.contains("edit")) {
      // Get the row and ID of the expense to be edited.
      let tr = e.target.parentElement.parentElement;
      let id = tr.children[0].textContent;

      // Fill the input values with the existing values of the selected expense.
      const res = await axios.get("http://localhost:3000/expense/getAllExpenses", {
        headers: { Authorization: token },
      });

      res.data.forEach((expense) => {
        if (expense.id == id) {
          categoryValue.textContent = expense.category;
          descriptionValue.value = expense.description;
          amountValue.value = expense.amount;
          addExpenseBtn.textContent = "Update";

          // Remove the previous click event listener and add an updated one for updating the expense.
          addExpenseBtn.removeEventListener("click", addExpense);

          addExpenseBtn.addEventListener("click", async function update(e) {
            e.preventDefault();
            console.log("request to backend for edit");

            // Send a POST request to update the expense details.
            const res = await axios.post(
              `http://localhost:3000/expense/editExpense/${id}`,
              {
                category: categoryValue.textContent.trim(),
                description: descriptionValue.value,
                amount: amountValue.value,
              },
              { headers: { Authorization: token } }
            );

            // Reload the page to update the expense list.
            window.location.reload();
          });
        }
      });
    }
  } catch {
    (err) => console.log(err);
  }
}

// Attach event listeners to various elements on the page.
buyPremiumBtn.addEventListener("click", buyPremium);
document.addEventListener("DOMContentLoaded", isPremiumUser);
document.addEventListener("DOMContentLoaded", getAllExpenses);
addExpenseBtn.addEventListener("click", addExpense);
table.addEventListener("click", (e) => {
  deleteExpense(e);
});
table.addEventListener("click", (e) => {
  editExpense(e);
});
