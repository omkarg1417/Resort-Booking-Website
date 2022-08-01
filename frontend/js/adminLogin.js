const createAccount = document.querySelector("#create-account");
const logIn= document.querySelector("#log-in");
const registerForm = document.querySelector(".register-form");
const loginForm = document.querySelector(".login-form");

const backendUrl = "http://localhost:8000/"


const loginBtn = document.querySelector('#login-btn');
const signinBtn = document.querySelector('#signin-btn');
// password@123
const sendLoginData = async (e) => {
   e.preventDefault();
   // console.log(loginForm.querySelector('#email'));
   const data = {
      email: loginForm.querySelector('#email').value,
      password: loginForm.querySelector('#password').value,
   }

   fetch('http://localhost:8000/admin/login', {
      method: 'POST',
      headers: {
         "Content-Type" : "application/json"
      },
      body: JSON.stringify(data)
   })
   .then(res => res.json())
   .then((res) => {
      if(res.err) {
         alert(res.err);
         return;
      }

   // setting user id for frontend to get user data whenever needed
   localStorage.setItem('token', res.token)

      console.log({
         res,
         message: "success"
      })

   window.location = "../html/adminDashboard.html";
   
})
   .catch((err) => {console.log({
      err,
      message: "failure"
   })});
   
   // console.log(data)
}

loginBtn.addEventListener("click", sendLoginData);


const sendRegisterData = (e) => {
   e.preventDefault();
   const data = {
      name: registerForm.querySelector('#name').value,
      email: registerForm.querySelector('#email').value,
      password: registerForm.querySelector('#password').value,
      confirmPassword: registerForm.querySelector('#confirm-password').value,
   }

   fetch('http://localhost:8000/admin/signup', {
      method: 'POST',
      headers: {
         "Content-Type" : "application/json"
      },
      body: JSON.stringify(data)
   })
   .then((res) => {console.log({
      res,
      message: "success"
   })})
   .catch((err) => {console.log({
      err,
      message: "failure"
   })});
   
}

signinBtn.addEventListener("click", sendRegisterData);



createAccount.addEventListener("click", () => {
    // const registerForm = document.querySelector(".register-form");
    // const loginForm = document.querySelector(".login-form");
    registerForm.style.display = "block";
    loginForm.style.display = "none";
 });
 
 logIn.addEventListener("click", () => {
    // const registerForm = document.querySelector(".register-form");
    // const loginForm = document.querySelector(".login-form");
    registerForm.style.display = "none";
    loginForm.style.display = "block";
 });
 
 