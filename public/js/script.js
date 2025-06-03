const toggleBtn = document.getElementById("togglePassword")
  const passwordInput = document.getElementById("account_password")

  toggleBtn.addEventListener("click", function () {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
    passwordInput.setAttribute("type", type)
    this.textContent = type === "password" ? "Show" : "Hide"
  })
function togglePassword() {
  const input = document.getElementById("account_password");
  input.type = input.type === "password" ? "text" : "password";
}