const loginBtn = document.getElementById("signInBtn");
const loginEmail = document.getElementById("email");
const loginPassword = document.getElementById("password");

function login() {
  const loginDetails = {
    loginEmail: loginEmail.value,
    loginPassword: loginPassword.value,
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

loginBtn.addEventListener("click", login);



const signUp = document.getElementById("signUpBtn");
const signUpName = document.getElementById('name');
const signUpEmail = document.getElementById('email');
const signUpPassword = document.getElementById('password');



function signUp() {
  const signUpDetails = {
    signUpName: signUpName.value,
    signUpEmail: signUpEmail.value,
    signUpPassword: signUpPassword.value,
  };

  axios
    .post("http://localhost:3000/user/login", signUpDetails)
    .then((result) => {
      alert(result.data.message);
      localStorage.setItem("token", result.data.token);
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

signUpBtn.addEventListener("click", signUp);