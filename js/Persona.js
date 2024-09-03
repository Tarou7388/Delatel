import config from "../env.js";

document.addEventListener("DOMContentLoaded", function () {
  const userid= JSON.stringify(user['idUsuario']);

  if (permisos[0].permisos.personas.leer != 1) {
    window.location.href = `${config.HOST}views`;
  }

  const slcChangeRegistro = document.getElementById("slcChangeRegistro");

  const divPersonaCard = document.getElementById("divPersonaCard");
  const frmPersonas = document.getElementById("frmPersonas");

  const slcTipoDocumento = document.getElementById("slcTipoDocumento");
  const txtNumDocumentoPersona = document.getElementById("txtNumDocumentoPersona");
  const txtNombresPersona = document.getElementById("txtNombresPersona");
  const txtApellidosPersona = document.getElementById("txtApellidosPersona");
  const txtTelefono = document.getElementById("txtTelefonoPersona");
  const txtEmail = document.getElementById("txtEmailPersona");

  const btnCancelarPersona = document.getElementById("btnCancelarPersona");

  function toggleForms(value) {
    if (value === "Persona") {
      divPersonaCard.classList.remove("d-none");
      divEmpresaCard.classList.add("d-none");
    } else if (value === "Empresa") {
      divPersonaCard.classList.add("d-none");
      divEmpresaCard.classList.remove("d-none");
    } else {
      divPersonaCard.classList.remove("d-none");
      divEmpresaCard.classList.add("d-none");
    }
  }

  frmPersonas.addEventListener("submit", (event) => {
    event.preventDefault(); event.preventDefault();

    if (permisos[0].permisos.personas.crear == 1) {
      const params = new FormData();
      params.append("Operacion", "Registrar");
      params.append("tipoDoc", slcTipoDocumento.value);
      params.append("nroDoc", txtNumDocumentoPersona.value);
      params.append("nombres", txtNombresPersona.value);
      params.append("apellidos", txtApellidosPersona.value);
      params.append("telefono", txtTelefono.value);
      params.append("email", txtEmail.value);
      params.append("iduser_create",userid);

      console.log(txtEmail.value);
      console.log(txtTelefono.value);

      const options = {
        method: "POST",
        body: params,
      };

      fetch(`${config.HOST}controllers/Personas.controlles.php`, options)
        .then((response) => response.json())
        .then((data) => {
          if (data.id_persona > 0) {
            alert("Persona registrada correctamente");
          } else {
            alert("Error: Verifique los datos ingresados");
          }
          frmPersonas.reset();
        })
        .catch((e) => {
          console.error(e);
        });
    }
  });

  slcChangeRegistro.addEventListener("change", () => {
    const valor = slcChangeRegistro.value;
    toggleForms(valor);
  });


  toggleForms(slcChangeRegistro.value);
});
