import config from "../env.js";

document.addEventListener("DOMContentLoaded", function () {
  if (!permisos[0].permisos.personas.leer) {
    window.location.href = `${config.HOST}views`;
  }

  const userid = JSON.stringify(user["idUsuario"]);
  const slcServicio = document.getElementById("slcServicio");
  const slcChangeRegistro = document.getElementById("slcChangeRegistro");
  const divPersonaCard = document.getElementById("divPersonaCard");
  const divEmpresaCard = document.getElementById("divEmpresaCard");
  const frmPersonas = document.getElementById("frmPersonas");
  const slcTipoDocumento = document.getElementById("slcTipoDocumento");
  const txtNumDocumentoPersona = document.getElementById("txtNumDocumentoPersona");
  const txtNombresPersona = document.getElementById("txtNombresPersona");
  const txtApellidosPersona = document.getElementById("txtApellidosPersona");
  const txtTelefono = document.getElementById("txtTelefonoPersona");
  const txtEmail = document.getElementById("txtEmailPersona");
  const txtcoordenadasPersona = document.getElementById("txtCoordenadasPersona");
  const slcNacionalidad = document.getElementById("slcNacionalidad");
  const txtDireccion = document.getElementById("txtDireccionPersona");
  const txtReferencia = document.getElementById("txtReferenciaPersona");
  const btnBuscar = document.getElementById("btnBuscar");


  // 3. Funciones externas
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

  async function registrarcontacto(idPersona) {
    const Paquete = slcServicio.value.split(" - ")[0];
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 14);
    const datos = {
      operacion: "add",
      idPersona: idPersona,
      idPaquete: Paquete,
      direccion: txtDireccion.value,
      nota: "Para llamar",
      idUsuario: userid,
      fechaLimite: fecha.toISOString().slice(0, 10),
    };
    const response = await fetch(`${config.HOST}app/controllers/Contactabilidad.controllers.php`, {
      method: "POST",
      body: JSON.stringify(datos),
    });
    const data = await response.json();
    console.log(data);
  }

  function ObtenerDataDNI(operacion, dni) {
    fetch(`${config.HOST}app/controllers/Personas.controlles.php?Operacion=${operacion}&dni=${encodeURIComponent(dni)}`)
      .then((response) => response.json())
      .then((data) => {
        txtNombresPersona.value = data.nombres ?? "";
        txtApellidosPersona.value = (data.apellidoPaterno ?? "") + (data.apellidoMaterno ? " " + data.apellidoMaterno : "");
      })
      .catch((e) => {
        showToast("Persona no encontrada, verifique DNI", "ERROR");
      });
  }

  function verificarCamposPersona() {
    const camposPersona = [
      slcTipoDocumento, txtNumDocumentoPersona, txtNombresPersona,
      txtApellidosPersona, txtTelefono, txtEmail,
      txtDireccion, txtReferencia, txtcoordenadasPersona,
    ];

    for (let campo of camposPersona) {
      if (campo.value.trim() === '') {
        showToast('Por favor, complete todos los campos de la persona.', "WARNING");
        return true;
      }
    }

    return false;
  }

  function registrarpersona() {
    if (permisos[0].permisos.personas.crear == 1) {
      const params = new FormData();
      params.append("Operacion", "Registrar");
      params.append("tipoDoc", slcTipoDocumento.value);
      params.append("nroDoc", txtNumDocumentoPersona.value);
      params.append("nombres", txtNombresPersona.value);
      params.append("apellidos", txtApellidosPersona.value);
      params.append("telefono", txtTelefono.value);
      params.append("email", txtEmail.value);
      params.append("nacionalidad", slcNacionalidad.value);
      params.append("iduser_create", userid);

      const options = {
        method: "POST",
        body: params,
      };

      fetch(`${config.HOST}app/controllers/Personas.controlles.php`, options)
        .then((response) => response.json())
        .then((data) => {
          if (data.id_persona > 0) {
            showToast("Persona registrada correctamente", "SUCCESS");
            registrarcontacto(data.id_persona);
          } else {
            showToast("Verifique los datos ingresados", "ERROR");
          }
          frmPersonas.reset();
        })
        .catch((e) => {
          showToast("PERSONA YA REGISTRADA", "WARNING");
        });
    }
  }

  toggleForms(slcChangeRegistro.value);

  function manejarDocumentoNacionalidad() {
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
  }
  async function cargarPaquetes() {
    const response = await fetch(`${config.HOST}app/controllers/paquetes.controllers.php?operacion=getAll`);
    const data = await response.json();
    data.forEach((paquetes) => {
      const option = document.createElement("option");
      const id = paquetes.id + " - " + paquetes.tipo_paquete + " - " + paquetes.precio;
      option.value = id;
      option.textContent = paquetes.nombre;
      slcServicio.appendChild(option);
    });
  }

  (() => {
    manejarDocumentoNacionalidad();
  })();

  (async () => {
    await cargarPaquetes();
  })();

  $(".select2me").select2({
    theme: "bootstrap-5",
    placeholder: "Seleccione Servicio",
    allowClear: true,
  });
  $('.select2me').parent('div').children('span').children('span').children('span').css('height', ' calc(3.5rem + 2px)');
  $('.select2me').parent('div').children('span').children('span').children('span').children('span').css('margin-top', '18px');
  $('.select2me').parent('div').find('label').css('z-index', '1');

  slcChangeRegistro.addEventListener("change", () => {
    const valor = slcChangeRegistro.value;
    toggleForms(valor);
  });

  frmPersonas.addEventListener("submit", (event) => {
    event.preventDefault();
    const bandera = verificarCamposPersona();
    if (!bandera) {
      if (permisos[0].permisos.personas.crear != 1) {
        showToast("No tienes permiso de registrar", "ERROR");
      }
      registrarpersona();
    }
  });

  btnBuscar.addEventListener("click", () => {
    ObtenerDataDNI("getapi", txtNumDocumentoPersona.value);
  });
});
