import config from "../env.js";

document.addEventListener("DOMContentLoaded", function () {
  const userid = JSON.stringify(user["idUsuario"]);

  if (permisos[0].permisos.personas.leer != 1) {
    window.location.href = `${config.HOST}views`;
  }

  const slcChangeRegistro = document.getElementById("slcChangeRegistro");

  const divPersonaCard = document.getElementById("divPersonaCard");
  const frmPersonas = document.getElementById("frmPersonas");

  const slcTipoDocumento = document.getElementById("slcTipoDocumento");
  const txtNumDocumentoPersona = document.getElementById(
    "txtNumDocumentoPersona"
  );
  const txtNombresPersona = document.getElementById("txtNombresPersona");
  const txtApellidosPersona = document.getElementById("txtApellidosPersona");
  const txtTelefono = document.getElementById("txtTelefonoPersona");
  const txtEmail = document.getElementById("txtEmailPersona");
  const txtcoordenadasPersona = document.getElementById("txtCoordenadasPersona");
  const slcNacionalidad = document.getElementById("slcNacionalidad");

  const txtDireccion = document.getElementById("txtDireccionPersona");
  const txtReferencia = document.getElementById("txtReferenciaPersona");

  const btnCancelarPersona = document.getElementById("btnCancelarPersona");
  const btnBuscar = document.getElementById("btnBuscar");

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
    event.preventDefault();
    const bandera = verificarCamposPersona();
    if (!bandera) {
      if (permisos[0].permisos.personas.crear != 1) {
        alert("No tienes permiso de registrar");
      }
      registrarpersona();
    }

  });

  function registrarpersona() {
    if (permisos[0].permisos.personas.crear == 1) {
      const params = new FormData();
      params.append("Operacion", "Registrar");
      params.append("tipoDoc", slcTipoDocumento.value);
      params.append("nroDoc", txtNumDocumentoPersona.value);
      params.append("nombres", txtNombresPersona.value);
      params.append("apellidos", txtApellidosPersona.value);
      params.append("telefono", txtTelefono.value);
      params.append("telefono", txtTelefono.value);
      params.append("email", txtEmail.value);
      params.append("nacionalidad", slcNacionalidad.value);
      params.append("iduser_create", userid);

      const options = {
        method: "POST",
        body: params,
      };

      fetch(`${config.HOST}controllers/Personas.controlles.php`, options)
        .then((response) => response.json())
        .then((data) => {
          if (data.id_persona > 0) {
            alert("Persona registrada correctamente");
            registrarcliente(data.id_persona);
          } else {
            alert("Error: Verifique los datos ingresados");
          }
          frmPersonas.reset();
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }

  (function () {
    const peruanoOpcion = new Option('Peruano', 'Peruano');
    peruanoOpcion.id = 'peruanoOpcion';
  
    txtNumDocumentoPersona.addEventListener('input', cambiarslc);
  
    function cambiarslc() {
      const length = txtNumDocumentoPersona.value.length;
  
      if (length === 8) {
        if (![...slcNacionalidad.options].some(option => option.value === 'Peruano')) {
          slcNacionalidad.add(peruanoOpcion);
        }
        slcTipoDocumento.value = 'DNI';
        slcTipoDocumento.disabled = true;
        slcNacionalidad.value = 'Peruano';
        slcNacionalidad.disabled = true;
      } else {
        if ([...slcNacionalidad.options].some(option => option.value === 'Peruano')) {
          slcNacionalidad.remove(slcNacionalidad.querySelector('#peruanoOpcion').index);
        }
        slcTipoDocumento.disabled = false;
        if (length === 12) {
          slcTipoDocumento.value = 'PAS';
        } else if (length === 10) {
          slcTipoDocumento.value = 'CAR';
        } else {
          slcTipoDocumento.value = '';
        }
        slcNacionalidad.disabled = false;
      }
    }
  })();
  
  




  slcChangeRegistro.addEventListener("change", () => {
    const valor = slcChangeRegistro.value;
    toggleForms(valor);
  });

  toggleForms(slcChangeRegistro.value);

  function registrarcliente(idPersonar) {
    const params = new FormData();
    params.append("operacion", "add");
    params.append("direccion", txtDireccion.value);
    params.append("referencia", txtReferencia.value);
    params.append("idempresa", "");
    params.append("idPersona", idPersonar);
    params.append("iduser_create", userid);
    params.append("coordenadas", txtcoordenadasPersona.value);

    const options = {
      method: "POST",
      body: params,
    };

    fetch(`${config.HOST}controllers/Cliente.controllers.php`, options)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.Guardado) {
          alert("Correcto");
          tablaClientes.ajax.reload();
        } else {
          alert("Error: Verifique");
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }

  btnBuscar.addEventListener("click", () => {
    ObtenerDataDNI("getapi", txtNumDocumentoPersona.value);
  });

  function ObtenerDataDNI(operacion, dni) {
    fetch(
      `${config.HOST}controllers/Personas.controlles.php?Operacion=${operacion}&dni=${encodeURIComponent(
        dni
      )}`
    )
      .then((response) => response.json())
      .then((data) => {

        txtNombresPersona.value = data.nombres ?? "";
        txtApellidosPersona.value = (data.apellidoPaterno ?? "") + (data.apellidoMaterno ? " " + data.apellidoMaterno : "");


      })
      .catch((e) => {
        alert("Persona no encontrada, verifique DNI")
      });
  }

  function verificarCamposPersona() {
    const camposPersona = [
      slcTipoDocumento, txtNumDocumentoPersona, txtNombresPersona,
      txtApellidosPersona, txtTelefono, txtEmail,
      txtDireccion, txtReferencia, txtcoordenadasPersona
    ];

    for (let campo of camposPersona) {
      if (campo.value.trim() === '') {
        alert('Por favor, complete todos los campos de la persona.');
        return true;
      }
    }

    return false;
  }
});
