document.addEventListener("DOMContentLoaded", function() {
    const confirmRegisterButton = document.getElementById("confirmRegister");
    const registerForm = document.getElementById("registerForm");
  
    confirmRegisterButton.addEventListener("click", function() {
      registerForm.submit();
    });
  });
  