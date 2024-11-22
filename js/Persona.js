import config from "../env.js";
import * as mapa from "./Mapa.js";
import * as Herramientas from "../js/Herramientas.js";

document.addEventListener("DOMContentLoaded", async function () {
  const accesos = await Herramientas.permisos()
  const userid = JSON.stringify(user["idUsuario"]);
  const slcPaquetes = document.getElementById("slcPaquetes");
  const slcTipoServicio = document.getElementById("slcTipoServicio");
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

  slcPaquetes.disabled = true;

  // Le avisa al select cuando se activa, elimina, actualiza o agrega un servicio
  document.addEventListener("servicioActivado", cargarServicios);
  document.addEventListener("servicioDesactivado", cargarServicios);
  document.addEventListener("servicioAgregado", cargarServicios);
  document.addEventListener("servicioActualizado", cargarServicios);

  function toggleForms(value) {
    if (value === "Persona") {
      resetUI();
      divPersonaCard.classList.remove("d-none");
      divEmpresaCard.classList.add("d-none");
    } else if (value === "Empresa") {
      resetUI();
      divPersonaCard.classList.add("d-none");
      divEmpresaCard.classList.remove("d-none");
    } else {
      resetUI();
      divPersonaCard.classList.remove("d-none");
      divEmpresaCard.classList.add("d-none");
    }
  }

  async function fetchPaquetesPorServicio(idServicio) {
    const response = await fetch(
      `${config.HOST}app/controllers/Paquete.controllers.php?operacion=buscarPaquetePorIdServicio&idServicio=${idServicio}`
    );
    const data = await response.json();
    return data;
  }

  function agregarOpcion(selectElement, value, text, disabled = false, selected = false) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;
    option.disabled = disabled;
    option.selected = selected;
    selectElement.appendChild(option);
  }

  async function cargarPaquetes(idServicio) {
    const dataPaquetes = await fetchPaquetesPorServicio(idServicio);
    slcPaquetes.innerHTML = '';
    const paquetesFiltrados = dataPaquetes.filter(paquete => {
      const servicios = JSON.parse(paquete.id_servicio).id_servicio;
      return servicios.length === 1 && !paquete.inactive_at;
    });

    if (paquetesFiltrados.length === 0) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No hay paquetes disponibles";
      option.disabled = true;
      slcPaquetes.appendChild(option);
    } else {
      const optionSeleccionar = document.createElement("option");
      optionSeleccionar.value = "";
      optionSeleccionar.textContent = "Seleccione un paquete";
      optionSeleccionar.disabled = true;
      optionSeleccionar.selected = true;
      slcPaquetes.appendChild(optionSeleccionar);

      paquetesFiltrados.forEach(paquete => {
        const option = document.createElement("option");
        const id = `${paquete.id_paquete}`;
        option.value = id;
        option.textContent = paquete.paquete;
        slcPaquetes.appendChild(option);
      });
    }
    slcPaquetes.disabled = false;
  }

  async function cargarPaquetesMultiples(tipo) {
    try {
      slcPaquetes.disabled = true;
      const response = await fetch(
        `${config.HOST}app/controllers/Paquete.controllers.php?operacion=listarPaquetes`
      );
      const dataPaquetes = await response.json();
      slcPaquetes.innerHTML = '<option value="" disabled selected>Seleccione un paquete</option>';

      let paquetesFiltrados = [];
      if (tipo === "duos") {
        paquetesFiltrados = dataPaquetes.filter(paquete => {
          const servicios = JSON.parse(paquete.id_servicio).id_servicio;
          return servicios.length === 2 && !paquete.inactive_at;
        });
      } else if (tipo === "trios") {
        paquetesFiltrados = dataPaquetes.filter(paquete => {
          const servicios = JSON.parse(paquete.id_servicio).id_servicio;
          return servicios.length === 3 && !paquete.inactive_at;
        });
      } else if (tipo === "cuarteto") {
        paquetesFiltrados = dataPaquetes.filter(paquete => {
          const servicios = JSON.parse(paquete.id_servicio).id_servicio;
          return servicios.length === 4 && !paquete.inactive_at;
        });
      }

      if (paquetesFiltrados.length === 0) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "No hay paquetes disponibles";
        option.disabled = true;
        slcPaquetes.appendChild(option);
      } else {
        const optionSeleccionar = document.createElement("option");
        optionSeleccionar.value = "";
        optionSeleccionar.textContent = "Seleccione un paquete";
        optionSeleccionar.disabled = true;
        optionSeleccionar.selected = true;
        slcPaquetes.appendChild(optionSeleccionar);

        paquetesFiltrados.forEach(paquete => {
          const option = document.createElement("option");
          const id = `${paquete.id_paquete}`;
          option.value = id;
          option.textContent = paquete.paquete;
          slcPaquetes.appendChild(option);
        });
      }
      slcPaquetes.disabled = false;
    } catch (error) {
      console.error("Error al cargar los paquetes:", error);
    }
  }

  slcTipoServicio.addEventListener("change", async function () {
    const idServicioSeleccionado = slcTipoServicio.value;
    const tiposMultiples = ["duos", "trios", "cuarteto"];

    if (tiposMultiples.includes(idServicioSeleccionado)) {
      await cargarPaquetesMultiples(idServicioSeleccionado);
    } else {
      await cargarPaquetes(idServicioSeleccionado);
    }
  });

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

  function resetUI() {
    txtNumDocumentoPersona.value = '';
    txtNombresPersona.value = '';
    txtApellidosPersona.value = '';
    txtTelefono.value = '';
    txtEmail.value = '';
    txtDireccion.value = '';
    txtReferencia.value = '';
    txtcoordenadasPersona.value = '';
    slcTipoDocumento.value = '';
    slcNacionalidad.value = '';
    txtRuc.value = '';
    txtRepresentanteLegal.value = '';
    txtRazonSocial.value = '';
    txtNombreComercial.value = '';
    txtTelefono.value = '';
    txtEmail.value = '';
    txtCoordenadas.value = '';
    txtDireccion.value = '';
    txtReferencia.value = '';
    slcTipoServicio.value = '';
    slcPaquetes.value = '';
  }

  function verificarCamposPersona() {
    const camposPersona = [
      slcTipoDocumento, txtNumDocumentoPersona, txtNombresPersona,
      txtApellidosPersona, txtTelefono,
      txtDireccion, txtReferencia, txtcoordenadasPersona,
    ];
    let bandera = {
      mensaje: "",
      confirmacion: true
    };
    const length = txtNumDocumentoPersona.value.length;
    if ((slcTipoDocumento.value === 'DNI' && length !== 8) || (slcTipoDocumento.value === 'CAR' && length !== 9)) {
      bandera.mensaje = "El número de documento no es válido";
      bandera.confirmacion = false;
    }

    for (let campo of camposPersona) {
      if (campo.value.trim() == '') {
        bandera.mensaje = "Por favor complete el campo " + campo.placeholder;
        campo.focus();
        bandera.confirmacion = false;
      }
    }
    return bandera;
  }

  async function registrarPersona() {
    if (accesos?.personas?.crear) {
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
    } else {
      showToast("No tienes permiso para crear personas", "ERROR")
    }
  }

  async function registrarContacto(idPersona) {
    const Servicio = slcTipoServicio.value;
    const Paquete = slcPaquetes.value;
    const direccion = txtDireccion.value;
    const referencia = txtReferencia.value;
    const coordenadas = txtcoordenadasPersona.value;
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 14);
    const datos = {
      operacion: "registrarContacto",
      idPersona: idPersona,
      idEmpresa: '',
      idPaquete: parseInt(slcPaquetes.value.split((" - ")[0])),
      direccion: direccion,
      nota: "Para llamar",
      idUsuario: userid,
      fechaLimite: fecha.toISOString().slice(0, 10),
    };
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
          window.location.href = `${config.HOST}views/Contratos?nroDoc=${dniActual}&idObjeto=${idPersona}&Servicio=${Servicio}&Paquete=${Paquete}&referencia=${referencia}&coordenadas=${coordenadas}&direccion=${direccion}`;
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
    slcTipoDocumento.disabled = show;
    if (slcTipoDocumento.value != 'DNI') {
      slcNacionalidad.disabled = show;
    }
    txtNumDocumentoPersona.disabled = show;
    slcTipoServicio.disabled = show;
    slcPaquetes.disabled;
    btnBuscar.disabled = show;
    frmPersonas.querySelector("button[type=submit]").disabled = show;
  }

  function manejarDocumentoNacionalidad() {
    const peruanoOpcion = new Option('Peruano', 'Peruano');
    peruanoOpcion.id = 'peruanoOpcion';

    txtNumDocumentoPersona.addEventListener('input', cambiarslc);

    function cambiarslc() {
      txtApellidosPersona.value = '';
      txtNombresPersona.value = '';
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
        if (length === 9) {
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

  (() => {
    manejarDocumentoNacionalidad();
  })();

  $(".select2me").select2({ theme: "bootstrap-5", placeholder: "Seleccione", allowClear: true });
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
    if (bandera.confirmacion) {
      registrarPersona();
    } else {
      showToast(bandera.mensaje, "WARNING");
    }
  });

  document.querySelector("#btnBuscarCoordenadas").addEventListener("click", async () => {
    const params = { cajas: true, mufas: true }
    const id = "map"
    const renderizado = "modal"
    mapa.iniciarMapa(params, id, renderizado);
  })

  btnBuscar.addEventListener("click", () => {
    ObtenerDataDNI("obtenerDni", txtNumDocumentoPersona.value);
  });

  async function cargarServicios() {
    try {
      const response = await fetch(
        `${config.HOST}app/controllers/Servicio.controllers.php?operacion=listarServicio`
      );
      const servicios = await response.json();

      slcTipoServicio.innerHTML = '<option value="" disabled selected>Seleccione</option>';

      const serviciosActivos = servicios.filter(servicio => servicio.inactive_at === null);
      if (serviciosActivos.length === 0) {
        agregarOpcion(slcTipoServicio, "", "No hay servicios disponibles", true);
      } else {
        serviciosActivos.forEach(servicio => {
          agregarOpcion(slcTipoServicio, servicio.id_servicio, `${servicio.tipo_servicio} (${servicio.servicio})`);
        });

        agregarOpcion(slcTipoServicio, "duos", "Duos");
        agregarOpcion(slcTipoServicio, "trios", "Trios");
        agregarOpcion(slcTipoServicio, "cuarteto", "Cuarteto");
      }
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    }
  }

  cargarServicios();
});
