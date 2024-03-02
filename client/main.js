const loginButton = document.getElementById("login")
const logoutButton = document.getElementById("logout")
const signUpButton = document.getElementById("signup")
const getSecretButton = document.getElementById("secret")
const deleteAccount = document.getElementById("delete-account")

const usernameInput = document.getElementById("username")
const passwordInput = document.getElementById("password")
const log = document.getElementById("log")

function doLog(json) {
  logElement = document.createElement("p")
  logElement.textContent = JSON.stringify(json) 
  log.appendChild(logElement)
}

function getCookie(name) {
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
      
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  
  return null;
}

signUpButton.addEventListener("click", async () => {
  const response = await fetch("http://localhost:3000/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({
      username: usernameInput.value,
      password: passwordInput.value
    })
  })

  doLog(await response.json()) 
})

loginButton.addEventListener("click", async () => {
  const response = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: usernameInput.value,
      password: passwordInput.value,
    })
  })

  doLog(await response.json())
  console.log(response.headers)
})

getSecretButton.addEventListener("click", async () => {
  const response = await fetch("http://localhost:3000/secret", {
    method: "GET",
    headers: {
      "X-CSRF-Token": getCookie("csrfToken")
    }
  })

  doLog(await response.json())
})

logoutButton.addEventListener("click", async () => {
  const response = await fetch("http://localhost:3000/auth/logout", {
    method: "DELETE",
    headers: {
      "X-CSRF-Token": getCookie("csrfToken")
    }
  })

  doLog(await response.json())
})