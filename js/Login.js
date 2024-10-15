import config from "../env.js";
document.addEventListener("DOMContentLoaded", () => {
  function $(object = null) {
    return document.querySelector(object);
  }

  async function login() {
    const nomUser = $("#txtNomUser").value;
    const pass = $("#txtPassUser").value;

    if (!nomUser || !pass) {
      showToast("Por favor, complete todos los campos.", "WARNING");
      return;
    }

    const parametros = new FormData();
    parametros.append("operacion", "login");
    parametros.append("nombreUser", nomUser);
    parametros.append("pass", pass);

    const response = await fetch(
      `${config.HOST}/app/controllers/Usuario.controllers.php`, {
        method: "POST",
        body: parametros,
      });

      const data = await response.json();
      
      if (data.login) { 
        showToast(data.mensaje, "SUCCESS", 2500);
        window.location.href = `${config.HOST}views/`; 
      } else {
        showToast(data.mensaje, "ERROR");
      }
  }

  $("#frmLogin").addEventListener("submit", async (event) => {
    event.preventDefault();
    await login();
  });

  const mostrarPassword = document.getElementById("mostrarPassword");
  const passwordInput = document.getElementById("txtPassUser");
  const eyeIcon = document.getElementById("eyeIcon");

  mostrarPassword.addEventListener("click", function () { 
    const type = passwordInput.getAttribute("type") == "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    eyeIcon.classList.toggle("bi-eye");
    eyeIcon.classList.toggle("bi-eye-slash");
  });
});