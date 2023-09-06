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