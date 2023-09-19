// Get a reference to an HTML element with the ID "resetPasswordLinkBtn"
const resetPasswordLinkBtn = document.getElementById("resetPasswordLinkBtn");

// Define an asynchronous function named "sendMail"
async function sendMail() {
  try {
    // Get the value of the input field with the ID "email"
    const email = document.getElementById("email").value;
    
    // Send a POST request to the "http://13.48.27.29:3000/password/sendMail" endpoint
    // with the email as the data payload
    const res = await axios.post("http://13.48.27.29:3000/password/sendMail", {
      email: email,
    });
    
    // If the request is successful, show an alert with the message from the response
    alert(res.data.message);
    
    // Redirect the user to the root URL ("/")
    window.location.href = "/";
  } catch (error) {
    // If an error occurs, log the error to the console for debugging purposes
    console.log(error);
    
    // Show an alert with the error message from the response (if available)
    // Note: error.response.data.message assumes that the error object has a
    // "response" property, which contains a "data" property, which in turn
    // contains a "message" property.
    alert(error.response.data.message);
    
    // Reload the current page to start over
    window.location.reload();
  }
}

// Add a click event listener to the "resetPasswordLinkBtn" element
// When the button is clicked, it will trigger the "sendMail" function
resetPasswordLinkBtn.addEventListener("click", sendMail);
