import config from "../env.js";
import * as mapa from "./Mapa.js";

document.addEventListener("DOMContentLoaded", function () {
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

  let dniActual = null;

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

  function ObtenerDataDNI(operacion, dni) {
    bloquearCargar(true);
    fetch(`${config.HOST}app/controllers/Persona.controllers.php?operacion=${operacion}&dni=${encodeURIComponent(dni)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener la información');
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.nombres && data.apellidoPaterno) {
          dniActual = dni;
          txtNombresPersona.value = data.nombres;
          txtApellidosPersona.value = `${data.apellidoPaterno} ${data.apellidoMaterno || ''}`.trim();
        } else {
          showToast('No se encontraron datos para el DNI proporcionado', 'WARNING');
          dniActual = null;
        }
      })
      .catch((error) => {
        showToast('Error al obtener la información de la persona: ' + error.message, 'ERROR');
      })
      .finally(() => {
        bloquearCargar(false);
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

  async function registrarPersona() {
    const params = new FormData();
    params.append("operacion", "registrarPersona");
    params.append("tipoDoc", slcTipoDocumento.value);
    params.append("nroDoc", txtNumDocumentoPersona.value);
    params.append("apellidos", txtApellidosPersona.value);
    params.append("nombres", txtNombresPersona.value);
    params.append("telefono", txtTelefono.value);
    params.append("nacionalidad", slcNacionalidad.value);
    params.append("email", txtEmail.value);
    params.append("idUsuario", userid);

    const options = {
      method: "POST",
      body: params
    };

    const response = await fetch(`${config.HOST}app/controllers/Persona.controllers.php`, options);
    const data = await response.json();
    if (data.error) {
      showToast(data.error.message, "WARNING");
    } else {
      registrarContacto(data[0].id_persona);
    }
  }

  async function registrarContacto(idPersona) {
    const Paquete = slcServicio.value;
    const direccion = txtDireccion.value;
    const referencia = txtReferencia.value;
    const coordenadas = txtcoordenadasPersona.value;
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 14);
    const datos = {
      operacion: "registrarContacto",
      idPersona: idPersona,
      idEmpresa: '',
      idPaquete: parseInt(slcServicio.value.split((" - ")[0])),
      direccion: direccion,
      nota: "Para llamar",
      idUsuario: userid,
      fechaLimite: fecha.toISOString().slice(0, 10),
    };
    console.log(datos);
    const response = await fetch(`${config.HOST}app/controllers/Contactabilidad.controllers.php`, {
      method: "POST",
      body: JSON.stringify(datos),
    });
    const data = await response.json();
    if (data.guardado) {
      await showToast("Persona registrada correctamente", "SUCCESS", 650);
      setTimeout(async () => {
        frmPersonas.reset();
        if (await ask("¿Desea registrar un contrato?")) {
          window.location.href = `${config.HOST}views/Contratos/?nroDoc=${dniActual}&idObjeto=${idPersona}&Paquete=${Paquete}&direccion=${direccion}&referencia=${referencia}&coordenadas=${coordenadas}`;
        }
      }, 650);
    }
  }

  toggleForms(slcChangeRegistro.value);

  async function bloquearCargar(show) {
    txtTelefono.disabled = show;
    txtEmail.disabled = show;
    txtDireccion.disabled = show;
    txtReferencia.disabled = show;
    txtcoordenadasPersona.disabled = show;
    slcTipoDocumento.disabled = show;
    slcNacionalidad.disabled = show;
    txtNumDocumentoPersona.disabled = show;
    slcServicio.disabled = show;
    btnBuscar.disabled = show;
    frmPersonas.querySelector("button[type=submit]").disabled = show;
  }


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
        btnBuscar.disabled = false;
        slcTipoDocumento.value = 'DNI';
        slcTipoDocumento.disabled = true;
        slcNacionalidad.value = 'Peruano';
        slcNacionalidad.disabled = true;
        txtApellidosPersona.disabled = true;
          txtNombresPersona.disabled = true;
      } else {
        btnBuscar.disabled = true;
        if ([...slcNacionalidad.options].some(option => option.value === 'Peruano')) {
          slcNacionalidad.remove(slcNacionalidad.querySelector('#peruanoOpcion').index);
        }
        slcTipoDocumento.disabled = false;
        if (length === 12) {
          slcTipoDocumento.value = 'PAS';
          slcTipoDocumento.disabled = true;
          txtApellidosPersona.disabled = false;
          txtNombresPersona.disabled = false;
        } else if (length === 9) {
          slcTipoDocumento.value = 'CAR';
          slcTipoDocumento.disabled = true;
          txtApellidosPersona.disabled = false;
          txtNombresPersona.disabled = false;
        } else {
          slcTipoDocumento.value = '';
          txtApellidosPersona.disabled = true;
          txtNombresPersona.disabled = true;
        }
        slcNacionalidad.disabled = false;
      }
    }
  }

  async function cargarPaquetes() {
    const response = await fetch(`${config.HOST}app/controllers/Paquete.controllers.php?operacion=listarPaquetes`);
    const data = await response.json();
    data.forEach((paquetes) => {
      const option = document.createElement("option");
      const id = `${paquetes.id_servicio} - ${paquetes.precio}`;
      option.value = id;
      option.textContent = paquetes.servicio;
      slcServicio.appendChild(option);
    });
  }

  (() => {
    manejarDocumentoNacionalidad();
  })();

  (async () => {
    await cargarPaquetes();
  })();

  $(".select2me").select2({theme: "bootstrap-5", placeholder: "Seleccione Servicio", allowClear: true});
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
      registrarPersona();
    }
  });

  document.querySelector("#btnBuscarCoordenadas").addEventListener("click", mapa.iniciarMapa)

  /* btnBuscar.addEventListener("click", () => {
    ObtenerDataDNI("obtenerDni", txtNumDocumentoPersona.value);
  }); */
});
