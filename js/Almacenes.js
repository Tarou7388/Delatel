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
  let idMarcaSeleccionada;
  let idTipoProductoActualizado;

  async function cargarMapa() {
    await mapa.iniciarMapa({}, "map", "modal");
    mapa.obtenerCoordenadasClick();
    document.querySelector("#map").addEventListener("click", async () => {
      $("#CoordenadaModel").val(mapa.ultimaCoordenada.latitud + "," + mapa.ultimaCoordenada.longitud);
    });
  }

  async function cargarTabla() {
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
      info: true,
      searching: false
    });
  }

  async function tablaReutilizable(idTabla, urlAjax, columnas = [], entidad = "") {
    const columns = columnas.map(col => {
      const [colName, colWidth] = col.split('=');
      const width = colWidth ? `${colWidth}%` : 'auto';

      return {
        data: colName,
        title: colName.charAt(0).toUpperCase() + colName.slice(1),
        className: 'text-start',
        render: colName === 'acciones' ? function (data, type, row) {
          if (row && typeof row === 'object') {
            const firstValue = Object.values(row)[0];

            return `
              <button class="btn btn-primary btn-sm ${entidad ? `actualizar${entidad}` : 'actualizarAlmacen'}" data-id="${firstValue}">
                <i class="fa-solid fa-pencil"></i>
              </button>
              <button class="btn btn-danger btn-sm ${entidad ? `eliminar${entidad}` : 'eliminarAlmacen'}" data-id="${firstValue}">
                <i class="fa-solid fa-trash"></i>
              </button>
            `;
          } else {
            return '';
          }
        } : null
      };
    });

    const tablaReutilizable = new DataTable(`#${idTabla}`, {
      ajax: {
        url: urlAjax,
        type: "GET",
        dataSrc: function (json) {
          return json;
        },
        error: function (xhr, error, thrown) {
          console.error('Error en la carga de datos:', error, thrown);
          alert('Error al cargar los datos. Por favor, revisa la consola para más detalles.');
        }
      },
      columnDefs: columnas.map((col, index) => {
        const [colName, colWidth] = col.split('=');
        const width = colWidth ? `${colWidth}%` : 'auto';

        return {
          targets: index,
          width: width,
          title: colName.charAt(0).toUpperCase() + colName.slice(1)
        };
      }),
      columns: columns,
      order: [],
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      paging: false,
      info: true,
      searching: false
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

    $("#tablaMarca").on("click", ".actualizarMarcas", async function () {
      const id = $(this).data("id");
      idMarcaSeleccionada = id;
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
        document.querySelector("#btnAccionMarcas").innerText = "Actualizar";
        document.querySelector("#btnAccionMarcas").classList.remove("btn-primary");
        document.querySelector("#btnAccionMarcas").classList.add("btn-warning");
      }
    });

    $("#tablaTipoProducto").on("click", ".actualizarTipoProductos", async function () {
      console.log("Actualizar almacén");
      const id = $(this).data("id");
      idTipoProductoActualizado = id;
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
        document.querySelector("#btnAccionTipoProducto").innerText = "Actualizar";
        document.querySelector("#btnAccionTipoProducto").classList.remove("btn-primary");
        document.querySelector("#btnAccionTipoProducto").classList.add("btn-warning");
      }
    });


    $("#tablaMarca").on("click", ".eliminarMarcas", async function () {
      console.log("Eliminar almacén");

    });
    $("#tablaTipoProducto").on("click", ".eliminarTipoProductos", async function () {
      console.log("Eliminar almacén");
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
    await tablaReutilizable("tablaMarca", `${config.HOST}app/controllers/Marcas.controllers.php?operacion=listarmarca`, ["marca=5", "acciones=10"], "Marcas");
    await tablaReutilizable("tablaTipoProducto", `${config.HOST}app/controllers/Producto.controllers.php?operacion=listarTipoProductos`, ["tipo_nombre=5", "acciones=5"], "TipoProductos");
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
