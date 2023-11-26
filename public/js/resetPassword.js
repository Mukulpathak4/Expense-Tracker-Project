// Get a reference to the "resetPasswordBtn" element using its ID
const resetPasswordBtn = document.getElementById("resetPasswordBtn");

// Define an asynchronous function to update the user's password
async function updatePassword() {
  try {
    // Get the new password from the "newPassword" input field
    const newPassword = document.getElementById("newPassword").value;

    // Send a POST request to update the user's password using the new password
    const res = await axios.post(
<<<<<<< HEAD
      "http://localhost:4000/password/resetPassword",
=======
      "http://localhost:3000/password/resetPassword",
>>>>>>> 1a64d42092b089a650b20cf407a83246f579f45b
      {
        password: newPassword,
      }
    );

    // Display a success message to the user
    alert(res.data.message);

    // Redirect the user to the root URL ("/") after successfully updating the password
    window.location.href = "/";
  } catch (error) {
    console.log(error); // Log any errors to the console

    // Display an error message to the user based on the response from the server
    alert(error.response.data.message);

    // Reload the current page to allow the user to retry the password update
    window.location.reload();
  }
}

// Add a click event listener to the "resetPasswordBtn" to trigger the "updatePassword" function
resetPasswordBtn.addEventListener("click", updatePassword);
