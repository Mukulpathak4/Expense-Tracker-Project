const loginButton = document.getElementById("signInBtn");
const loginEmail = document.getElementById("loginEmail"); // Updated to match the new ID
const loginPassword = document.getElementById("loginPassword"); // Updated to match the new ID

function login() {
  const loginDetails = {
    loginEmail: loginEmail.value, // Updated to match the new ID
    loginPassword: loginPassword.value, // Updated to match the new ID
  };

  axios
    .post("http://localhost:3000/user/login", loginDetails)
    .then((result) => {
      alert(result.data.message);
      localStorage.setItem("token", result.data.token);
      window.location.href = "/homePage";
    })
    .catch((error) => {
      if (error.response) {
        const errorMessage = error.response.data.message;
        alert(errorMessage);
      } else {
        alert("An error occurred. Please try again later.");
      }
    });
}

loginButton.addEventListener("click", login);

const signupButton = document.getElementById("signUpBtn");
const signUpName = document.getElementById('name'); // Assuming you have a name input field
const signUpEmail = document.getElementById('signupEmail'); // Updated to match the new ID
const signUpPassword = document.getElementById('signupPassword'); // Updated to match the new ID

function signup() {
  const signUpDetails = {
    name: signUpName.value, // Assuming you have a name input field
    email: signUpEmail.value, // Updated to match the new ID
    password: signUpPassword.value, // Updated to match the new ID
  };

  axios
    .post("http://localhost:3000/user/signup", signUpDetails)
    .then((result) => {
      alert(result.data.message);
      window.location.href = "/";
    })
    .catch((error) => {
      if (error.response) {
        const errorMessage = error.response.data.message;
        alert(errorMessage);
      } else {
        alert("An error occurred. Please try again later.");
      }
    });
}

signupButton.addEventListener("click", signup);
