import config from "../env.js";

document.addEventListener("DOMContentLoaded", function () {
  if (permisos[0].permisos.personas.leer != 1) {
    window.location.href = `${config.HOST}views`;
  }

  const changeTp = document.querySelector("#slchangeRegistro");
  const empresaCard = document.querySelector("#empresaCard");
  const personaCard = document.querySelector("#personaCard");

  const a1="";
  const a2="";
  const a3="";
  const a4="";
  const a5="";
  const a6="";


  const empreForm = document.querySelector("#Empresas");
  const persForm = document.querySelector("#Personas");

  // Inicializar la visibilidad de los formularios
  function toggleForms(value) {
    if (value === "Persona") {
      personaCard.classList.remove("d-none");
      empresaCard.classList.add("d-none");
    } else if (value === "Empresa") {
      personaCard.classList.add("d-none");
      empresaCard.classList.remove("d-none");
    } else {
      personaCard.classList.remove("d-none");
      empresaCard.classList.add("d-none");
    }
  }

  // Funcionalidad de Boton
  empreForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Corregido aquí

    if (permisos[0].permisos.personas.crear == 1) {
      console.log("Permitido");
      const params = new FormData();
      params.append("operacion", "add");
      params.append("ruc", idproductoField.value);
      params.append("representante_legal", fecha.value);
      params.append("razon_social", tipomovimientoField.value);
      params.append("nombre_comercial", motivoField.value);
      params.append("telefono", cantidadField.value);
      params.append("email", txtvalorhistorico.value);

      const options = {
        method: "POST",
        body: params,
      };
      fetch(`../controllers/kardex.controllers.php`, options)
        .then((response) => response.json())
        .then((data) => {
          if (data.Guardado) {
            alert("Se ha guardado correctamente");
          } else {
            alert("Error: Verfique que se haya hecho bien la operacion");
          }
          document.querySelector("#form-validaciones-kardex").reset();
          tablaKardex.ajax.reload();
        })
        .catch((e) => {
          console.error(e);
        });
    }

    console.log("Empresas");
  });

  persForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Corregido aquí

    console.log("Personas");
  });

  changeTp.addEventListener("change", () => {
    const valor = changeTp.value;
    toggleForms(valor);
  });

  toggleForms(changeTp.value);
});
