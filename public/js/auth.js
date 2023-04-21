



const formLogin = document.getElementById("form")
const submitButton = document.getElementById("submit")

const url = (window.location.hostname == "localhost") 
  ? "http://localhost:8080/api/auth/"
  : ""

submitButton.addEventListener("click", (e) => {
  e.preventDefault();

  const formData = {};

  for(let el of formLogin.elements) {
    if (el.name.length > 0) formData[el.name] = el.value;
  }

  fetch( url + "login", {
    method: "POST",
    body: JSON.stringify( formData ),
    headers: { "Content-Type": "application/json" }
  })
    .then((res) => res.json())
    .then(({ token }) => {
      localStorage.setItem("token", token);
      window.location = "chat.html";
    })
    .catch((err) => console.error(err))

})


// TODO: Hacer funcionar correctamente la autenticación con Facebook

// function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
//   console.log('statusChangeCallback');
//   console.log(response);                   // The current login status of the person.
//   if (response.status === 'connected') {   // Logged into your webpage and Facebook.

//       const logoutButton = document.getElementById("logout-button");
//       logoutButton.style.display = "inline";
//       logoutButton.addEventListener("click", () => {
//           return logout(response);
//       })

//       fetch("http://localhost:8080/api/auth/facebook", {
//           method: "POST",
//           headers: {"Content-Type": "application/json"},
//           body: JSON.stringify({fb_token: response.authResponse.accessToken})
//       })
//           .then(res => res.json())
//           .then(res => console.log(res))
//           .catch( console.warn )

//       testAPI();  
//   }
// }


// function checkLoginState() {               // Called when a person is finished with the Login Button.
//   FB.getLoginStatus(function(response) {   // See the onlogin handler
//       statusChangeCallback(response);
//   });
// }


// window.fbAsyncInit = function() {
//   FB.init({
//       appId      : '621596226450477',
//       cookie     : true,                     // Enable cookies to allow the server to access the session.
//       xfbml      : true,                     // Parse social plugins on this webpage.
//       version    : 'v0.16'           // Use this Graph API version for this call.
//   });

//   FB.getLoginStatus(function(response) {   // Called after the JS SDK has been initialized.
//       statusChangeCallback(response);        // Returns the login status.
//   });
// };

// function testAPI() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
//   console.log('Welcome!  Fetching your information.... ');
//   FB.api('/me', function(response) {
//       console.log('Successful login for: ' + response.name);
//   })
// }

// function logout(response) {
//   FB.logout(function(response) {
//       // user is now logged out
//       console.log("El usuario ha cerrado sesión");
//   });
// }