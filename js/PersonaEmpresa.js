import config from '../env.js';

document.addEventListener("DOMContentLoaded", function () {
  if (permisos[0].permisos.personas.leer != 1) {
    window.location.href = `${config.HOST}views`;
  }

  const changeTp = document.querySelector("#slchangeRegistro");
  const empresaCard = document.querySelector("#empresaCard");
  const personaCard = document.querySelector("#personaCard");

  // Inicializar la visibilidad de los formularios
  function toggleForms(value) {
    if (value === "Persona") {
      personaCard.classList.remove("d-none");
      empresaCard.classList.add("d-none");
    } else if (value === "Empresa") {
      personaCard.classList.add("d-none");
      empresaCard.classList.remove("d-none");
    } else {
      personaCard.classList.add("d-none");
      empresaCard.classList.add("d-none");
    }
  }

  changeTp.addEventListener("change", () => {
    const valor = changeTp.value;
    toggleForms(valor);
  });

  toggleForms(changeTp.value);
});
