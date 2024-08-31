document.addEventListener("DOMContentLoaded", () => {
  const boton = document.querySelector("#generar");

  boton.addEventListener("click", () => {
    window.open(`../Carpeta-PDF/soporte.php`);
  })

});