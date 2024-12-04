import config from "../env.js";
import * as mapa from "./Mapa.js";
import * as Herramientas from "../js/Herramientas.js";

document.addEventListener("DOMContentLoaded", async function () {
  const accesos = await Herramientas.permisos()

  const userid = JSON.stringify(user['idUsuario']);

  const divEmpresaCard = document.getElementById("divEmpresaCard");
  const frmEmpresas = document.getElementById("frmEmpresas");

  const txtRuc = document.getElementById("txtRuc");
  const txtRepresentanteLegal = document.getElementById("txtRepresentanteLegal");
  const txtRazonSocial = document.getElementById("txtRazonSocial");
  const txtNombreComercial = document.getElementById("txtNombreComercial");
  const txtTelefono = document.getElementById("txtTelefono");
  const txtEmail = document.getElementById("txtEmail");
  const txtCoordenadas = document.getElementById("txtCoordenadas");
  const txtDireccion = document.getElementById("txtDireccion");
  const txtReferencia = document.getElementById("txtReferencia");
  const slcPaquetes = document.getElementById("slcPaqueteEmpresa");
  const slcTipoServicio = document.getElementById("slcTipoServicioEmpresa");
  const btnCancelarEmpresa = document.getElementById("btnCancelarEmpresa");
  const btnBuscarEmpresa = document.getElementById("btnBuscarEmpresa");

  let ruc = null;

  slcPaquetes.disabled = true;

  // Le avisa al select cuando se activa, elimina, actualiza o agrega un servicio
  document.addEventListener("servicioActivado", cargarServicios);
  document.addEventListener("servicioDesactivado", cargarServicios);
  document.addEventListener("servicioAgregado", cargarServicios);
  document.addEventListener("servicioActualizado", cargarServicios);

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
      if (tipo === "FIBRA + CABLE") {
        paquetesFiltrados = dataPaquetes.filter(paquete => {
          const servicios = JSON.parse(paquete.id_servicio).id_servicio;
          return servicios.length === 2 && !paquete.inactive_at;
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
    const tiposMultiples = ["FIBRA + CABLE"];

    if (tiposMultiples.includes(idServicioSeleccionado)) {
      await cargarPaquetesMultiples(idServicioSeleccionado);
    } else {
      await cargarPaquetes(idServicioSeleccionado);
    }
  });

  async function verificarCampos() {
    const campos = [
      txtRuc, txtRepresentanteLegal, txtRazonSocial,
      txtNombreComercial, txtTelefono, 
      txtDireccion, txtReferencia, txtCoordenadas
    ];

    for (let campo of campos) {
      if (campo.value.trim() === '') {
        showToast("¡Por favor complete todos los campos!", "INFO");
        return true;
      }
    }
    return false;
  }

  async function registrarEmpresa() {
    if (accesos?.personas?.crear) {
      const params = new FormData();
      params.append("operacion", "registrarEmpresa");
      params.append("ruc", txtRuc.value);
      params.append("representanteLegal", txtRepresentanteLegal.value);
      params.append("razonSocial", txtRazonSocial.value);
      params.append("nombreComercial", txtNombreComercial.value);
      params.append("telefono", txtTelefono.value);
      params.append("email", txtEmail.value);
      params.append("idUsuario", userid);

      const options = {
        method: "POST",
        body: params,
      };

      const response = await fetch(`${config.HOST}app/controllers/Empresa.controllers.php`, options);
      const data = await response.json();
      if (data.error) {
        showToast(data.error.message, "WARNING");
      }
      else {
        ruc = txtRuc.value;
        await showToast("Empresa registrada correctamente", "SUCCESS", 650);
        await registrarContacto(data[0].id_empresa);
        frmEmpresas.reset();
      }
    }

  }

  async function registrarContacto(idEmpresa) {
    if (accesos?.personas?.crear) {
      const Paquete = slcPaquetes.value;
      const fecha = new Date();
      fecha.setDate(fecha.getDate() + 14);
      const datos = {
        operacion: "registrarContacto",
        idPersona: '',
        idEmpresa: idEmpresa,
        idPaquete: parseInt(slcPaquetes.value.split((" - ")[0])),
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
      if (data.guardado) {
        const Paquete = slcPaquetes.value;
        const direccion = txtDireccion.value;
        const referencia = txtReferencia.value;
        const coordenadas = txtCoordenadas.value;
        await showToast("Empresa registrada correctamente", "SUCCESS", 650);
        setTimeout(async () => {
          frmPersonas.reset();
          if (await ask("¿Desea registrar un contrato?")) {
            window.location.href = `${config.HOST}views/Contratos/?nroDoc=${ruc}&Paquete=${Paquete}&direccion=${direccion}&referencia=${referencia}&coordenadas=${coordenadas}`;
          }
        }, 650);
      }
    }
  }

  async function ObtenerDataRUC(ruc) {
    try {
      if (ruc.length < 11) {
        showToast("¡El RUC debe tener 11 dígitos!", "INFO");
        return;
      } else {
        showLoadingMessage(true);
        const response = await fetch(`${config.HOST}app/controllers/Persona.controllers.php?operacion=obtenerRuc&ruc=${ruc}`);
        const data = await response.json();
        txtRazonSocial.value = data.razonSocial;
        txtDireccion.value = data.direccion;
      }
    } catch (error) {
      showToast("¡Empresa no encontrada, verifique RUC!", "INFO");
    } finally {
      showLoadingMessage(false);
    }
  }

  async function showLoadingMessage(show) {
    txtReferencia.disabled = show;
    txtNombreComercial.disabled = show;
    txtTelefono.disabled = show;
    txtEmail.disabled = show;
    txtRepresentanteLegal.disabled = show;
    btnBuscarEmpresa.disabled = show;
    btnCancelarEmpresa.disabled = show;
    slcTipoServicio.disabled = show;
    slcPaquetes.disabled;
  }

  frmEmpresas.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (!await verificarCampos()) {
      await registrarEmpresa();
    }
  });

  btnBuscarEmpresa.addEventListener("click", async function () {
    await ObtenerDataRUC(txtRuc.value);
  });

  document.querySelector("#btnBuscarCoordenadasEmpresa").addEventListener("click", async () => {
    await mapa.iniciarMapa();
  })

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

        agregarOpcion(slcTipoServicio, "FIBRA + CABLE", "FIBRA + CABLE (GPON)");
      }
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    }
  }

  cargarServicios();
});