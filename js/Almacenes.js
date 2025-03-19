import config from "../env.js";
import * as mapa from "./Mapa.js";
import * as Herramientas from "./Herramientas.js";

document.addEventListener("DOMContentLoaded", async () => {
  const txtNombreAlmacen = document.querySelector("#txtNombreAlmacen");
  const txtUbicación = document.querySelector("#txtUbicación");
  const CoordenadaModel = document.querySelector("#CoordenadaModel");

  let tablaAlmacen;
  let accion = "registrar";
  let idAlmacenSeleccionado;

  async function cargarMapa() {
    await mapa.iniciarMapa({}, "map", "modal");
    mapa.obtenerCoordenadasClick();
    document.querySelector("#map").addEventListener("click", async () => {
      $("#CoordenadaModel").val(mapa.ultimaCoordenada.latitud + "," + mapa.ultimaCoordenada.longitud);
    });
  }

  async function cargarTabla(params) {
    tablaAlmacen = new DataTable("#tablaAlmacenes", {
      processing: true,
      serverSide: true,
      ajax: {
        url: `${config.HOST}/app/controllers/Almacen.ssp.php`,
        type: "GET",
        dataSrc: function (json) {
          return json.data;
        },
        error: function (xhr, error, thrown) {
          console.error('Error en la carga de datos:', error, thrown);
          alert('Error al cargar los datos. Por favor, revisa la consola para más detalles.');
        }
      },
      columnDefs: [
        { targets: 0, width: '5%' },
        { targets: 1, width: '25%' },
        { targets: 2, width: '25%' },
        { targets: 3, width: '25%' },
        { targets: 4, width: '20%' }
      ],
      columns: [
        { data: 0, title: 'id', className: 'text-center' },
        { data: 1, title: 'nombre', className: 'text-center' },
        { data: 2, title: 'ubicacion', className: 'text-center' },
        { data: 3, title: 'coordenada', className: 'text-center' },
        {
          data: function (row) {
            return `
            <button class="btn btn-primary btn-sm actualizarAlmacen" data-id="${row[0]}">
              <i class="fa-solid fa-pencil"></i>
            </button>
            <button class="btn btn-danger btn-sm eliminarAlmacen" data-id="${row[0]}">
              <i class="fa-solid fa-trash"></i>
            </button>
            `;
          },
          title: 'Acciones',
          className: 'text-center'
        }
      ],
      order: [],
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      paging: false,
      info: true
    });
  }

  async function registrar() {
    const params = new FormData();
    params.append("nombre", txtNombreAlmacen.value);
    params.append("ubicacion", txtUbicación.value);
    params.append("coordenada", CoordenadaModel.value);
    params.append("operacion", "registrarAlmacen");

    const response = await fetch(`${config.HOST}/app/controllers/Almacen.controllers.php`, {
      method: "POST",
      body: params,
    });
    const data = await response.json();
    console.log(data);
    if (data.error) {
      console.error(data.error);
      showToast("No se pudo registrar el almacén", "ERROR");
    } else {
      showToast("Almacén registrado con éxito", "SUCCESS");
      tablaAlmacen.ajax.reload();
      limpiarFormulario();
    }
  }

  async function limpiarFormulario() {
    txtNombreAlmacen.value = "";
    txtUbicación.value = "";
    CoordenadaModel.value = "";
  }

  async function eventosBotonesTabla() {
    $("#tablaAlmacenes").on("click", ".actualizarAlmacen", async function () {
      console.log("Actualizar almacén");
      const id = $(this).data("id");
      idAlmacenSeleccionado = id;
      const response = await fetch(`${config.HOST}/app/controllers/Almacen.controllers.php?operacion=listarAlmacenPorId&id=${id}`);
      const data = await response.json();
      console.log(data);
      if (data.error) {
        console.error(data.error);
        showToast("No se pudo obtener el almacén", "ERROR");
      } else {
        txtNombreAlmacen.value = data[0].nombre_almacen;
        txtUbicación.value = data[0].ubicacion;
        CoordenadaModel.value = data[0].coordenada;
        accion = "actualizar";
        document.querySelector("#btnAccionAlmacen").innerText = "Actualizar";
        document.querySelector("#btnAccionAlmacen").classList.remove("btn-primary");
        document.querySelector("#btnAccionAlmacen").classList.add("btn-warning");
      }
    });
    $("#tablaAlmacenes").on("click", ".eliminarAlmacen", async function () {
      console.log("Eliminar almacén");
      const id = $(this).data("id");
      const params = {
        id: id,
        operacion: "eliminarAlmacen",
      }
      const response = await fetch(`${config.HOST}/app/controllers/Almacen.controllers.php`, {
        method: "PUT",
        body: JSON.stringify(params),
        headers: {
          "Content-Type": "application/json",
        }
      });
      const data = await response.json();
      console.log(data);
      if (data.error) {
        console.error(data.error);
        showToast("No se pudo eliminar el almacén", "ERROR");
      } else {
        showToast("Almacén eliminado con éxito", "SUCCESS");
        tablaAlmacen.ajax.reload();
      }
    });
  }

  async function actualizar() {
    const params = new FormData();
    params.append("nombre", txtNombreAlmacen.value);
    params.append("ubicacion", txtUbicación.value);
    params.append("coordenada", CoordenadaModel.value);
    params.append("id", idAlmacenSeleccionado);
    params.append("operacion", "actualizarAlmacen");

    const response = await fetch(`${config.HOST}/app/controllers/Almacen.controllers.php`, {
      method: "POST",
      body: params,
    });
    const data = await response.json();
    console.log(data);
    if (data.error) {
      console.error(data.error);
      showToast("No se pudo actualizar el almacén", "ERROR");
    } else {
      showToast("Almacén actualizado con éxito", "SUCCESS");
      tablaAlmacen.ajax.reload();
      limpiarFormulario();
      accion = "registrar";
      document.querySelector("#btnAccionAlmacen").innerText = "Guardar";
      document.querySelector("#btnAccionAlmacen").classList.remove("btn-warning");
      document.querySelector("#btnAccionAlmacen").classList.add("btn-primary");
      idAlmacenSeleccionado = null;
    }
  }

  (async function () {
    await cargarMapa();
    await cargarTabla();
    await eventosBotonesTabla();
  })();

  document.querySelector("#formAlmacen").addEventListener("submit", async (event) => {
    event.preventDefault();
    switch (accion) {
      case "registrar":
        await registrar();
        break;
      case "actualizar":
        await actualizar();
        break;
      default:
        console.error("Acción no definida");
        break;
    };
  });
});
