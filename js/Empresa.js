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

  async function cargarPaquetes(idServicio) {
    const dataPaquetes = await fetchPaquetesPorServicio(idServicio);
    slcPaquetes.innerHTML = '<option value="" disabled selected>Seleccione un paquete</option>';
    dataPaquetes
      .filter(paquete =>
        !paquete.id_servicio2 &&
        !paquete.id_servicio3 &&
        !paquete.id_servicio4 &&
        !paquete.inactive_at
      )
      .forEach((paquete) => {
        const option = document.createElement("option");
        const id = `${paquete.id_paquete}`;
        option.value = id;
        option.textContent = paquete.paquete;
        slcPaquetes.appendChild(option);
      });
    slcPaquetes.disabled = false;
  }

  async function cargarPaquetesMultiples(tipo) {
    const response = await fetch(
      `${config.HOST}app/controllers/Paquete.controllers.php?operacion=listarPaquetes`
    );
    const dataPaquetes = await response.json();
    slcPaquetes.innerHTML = '<option value="" disabled selected>Seleccione un paquete</option>';

    let paquetesFiltrados = [];
    if (tipo === "duos") {
      paquetesFiltrados = dataPaquetes.filter(paquete => paquete.id_servicio && paquete.id_servicio2 && !paquete.id_servicio3 && !paquete.id_servicio4 && !paquete.inactive_at);
    } else if (tipo === "trios") {
      paquetesFiltrados = dataPaquetes.filter(paquete => paquete.id_servicio && paquete.id_servicio2 && paquete.id_servicio3 && !paquete.id_servicio4 && !paquete.inactive_at);
    } else if (tipo === "cuarteto") {
      paquetesFiltrados = dataPaquetes.filter(paquete => paquete.id_servicio && paquete.id_servicio2 && paquete.id_servicio3 && paquete.id_servicio4 && !paquete.inactive_at);
    }

    paquetesFiltrados.forEach((paquete) => {
      const option = document.createElement("option");
      const id = `${paquete.id_paquete}`;
      option.value = id;
      option.textContent = paquete.paquete;
      slcPaquetes.appendChild(option);
    });
    slcPaquetes.disabled = false;
  }

  slcTipoServicio.addEventListener("change", async function () {
    const idServicioSeleccionado = slcTipoServicio.value;
    if (idServicioSeleccionado === "duos" || idServicioSeleccionado === "trios" || idServicioSeleccionado === "cuarteto") {
      await cargarPaquetesMultiples(idServicioSeleccionado);
    } else {
      await cargarPaquetes(idServicioSeleccionado);
    }
  });

  async function verificarCampos() {
    const campos = [
      txtRuc, txtRepresentanteLegal, txtRazonSocial,
      txtNombreComercial, txtTelefono, txtEmail,
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
    txtCoordenadas.disabled = show;
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
    await mapa.iniciarMapa('map');
  })

  async function cargarServicios() {
    try {
      const response = await fetch(
        `${config.HOST}app/controllers/Servicio.controllers.php?operacion=listarServicio`
      );
      const servicios = await response.json();
      console.log(servicios);

      const slcTipoServicio = $("#slcTipoServicioEmpresa");

      slcTipoServicio.empty();

      slcTipoServicio.append(
        '<option value="" disabled selected>Seleccione</option>'
      );

      servicios
        .filter((servicio) => servicio.inactive_at === null)
        .forEach((servicio) => {
          const option = `<option value="${servicio.id_servicio}">${servicio.tipo_servicio} (${servicio.servicio})</option>`;
          slcTipoServicio.append(option);
        });

      slcTipoServicio.append('<option value="duos">Duos</option>');
      slcTipoServicio.append('<option value="trios">Trios</option>');
      slcTipoServicio.append('<option value="cuarteto">Cuarteto</option>');

      slcTipoServicio.on("change", function () {
        const idServicio = $(this).val();
        if (idServicio === "duos" || idServicio === "trios" || idServicio === "cuarteto") {
          cargarPaquetesMultiples(idServicio);
        } else {
          cargarPaquetes(idServicio);
        }
      });
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    }
  }

  cargarServicios();
});