import config from "../env.js";
import * as Herramientas from "../js/Herramientas.js";

document.addEventListener("DOMContentLoaded", async function () {
  let login = await Herramientas.obtenerLogin();
  const userid = login.idUsuario;
  const tipoMovimientoSelect = document.getElementById("slcTipomovimiento");
  const slcMotivo = document.getElementById("slcMotivo");
  const idproductoField = document.querySelector("#idproducto");
  const stockactualField = document.querySelector("#txtStockactual");
  const txtCantidad = document.querySelector("#txtCantidad");
  const txtvalorhistorico = document.querySelector("#txtValorunitario");
  const fecha = document.querySelector("#txtfecha");
  const Almacen = document.querySelector("#slcAlmacen");

  const accesos = await Herramientas.permisos();
  fecha.value = new Date().toISOString().split("T")[0];

  /**
   * Asynchronously updates the options of a select element based on the provided value.
   *
   * This function fetches data from a specified endpoint using the provided value as a query parameter.
   * It then populates the select element with options created from the fetched data.
   *
   * @param {string} valor - The value used to filter the data from the endpoint.
   * @returns {Promise<void>} A promise that resolves when the select element has been updated.
   */
  async function actualizarMtv(valor) {
    const respuesta = await fetch(
      `${config.HOST}app/controllers/Movimiento.controllers.php?operacion=FiltrarSoportePrioridad&movimiento=${valor}`
    );
    const data = await respuesta.json();

    slcMotivo.innerHTML = "";
    data.forEach((movimiento) => {
      const option = document.createElement("option");
      option.value = movimiento.id_tipooperacion;
      option.textContent = movimiento.descripcion;
      slcMotivo.appendChild(option);
    });
  }

  /**
   * Muestra el stock actual y el valor histórico de un producto en un almacén específico.
   *
   * @param {number} idproducto - El ID del producto.
   * @param {number} idAlmacen - El ID del almacén.
   * @returns {Promise<void>} - Una promesa que se resuelve cuando se han actualizado los campos de stock y valor histórico.
   */
  const mostrarStockActual = async (idproducto, idAlmacen) => {
    const [stockRes, productoRes] = await Promise.all([
      fetch(`${config.HOST}app/controllers/Kardex.controllers.php?operacion=buscarStockId&idProducto=${idproducto}&idAlmacen=${idAlmacen}`),
      fetch(`${config.HOST}app/controllers/Producto.controllers.php?operacion=buscarProductoId&idProducto=${idproducto}`)
    ]);

    const stockData = await stockRes.json();
    const productoData = await productoRes.json();

    stockactualField.value = stockData[0]?.saldo_total || 0;
    txtvalorhistorico.value = productoData[0]?.precio_actual || 0;
  };

  /**
   * Función asíncrona para guardar un registro en el Kardex.
   * Verifica si el usuario tiene permisos para crear registros en el inventario.
   * Si tiene permisos, envía una solicitud POST al servidor con los datos del formulario.
   * Muestra un mensaje de éxito o error basado en la respuesta del servidor.
   * 
   * @async
   * @function guardarKardex
   * @returns {void}
   */
  const guardarKardex = async () => {
    if (accesos?.inventariado?.crear) {
      const params = new FormData();
      params.append("operacion", "registrarKardex");
      params.append("idAlmacen", Almacen.value);
      params.append("idProducto", idproductoField.value);
      params.append("fecha", fecha.value);
      params.append("idtipoOperacion", slcMotivo.value);
      params.append("cantidad", txtCantidad.value);
      params.append("valorUnitarioHistorico", txtvalorhistorico.value);
      params.append("idUsuario", userid);

      try {
        const response = await fetch(`${config.HOST}app/controllers/Kardex.controllers.php`, {
          method: "POST",
          body: params,
        });
        const data = await response.json();
        const message = data.Guardado ? "Se ha guardado correctamente" : "Error: Verifique la cantidad ingresada";
        const messageType = data.Guardado ? "SUCCESS" : "ERROR";

        showToast(message, messageType);
        document.querySelector("#form-validaciones-kardex").reset();
        tablaKardex.ajax.reload();
        fecha.value = new Date().toISOString().split("T")[0];
      } catch (error) {
        showToast("No se pudo realizar la operacion", "ERROR");
      }
    } else {
      showToast("No tienes permisos para guardar en el Kardex", "ERROR");
    }
  };

  (async () => {
    const response = await fetch(`${config.HOST}app/controllers/Producto.controllers.php?operacion=listarProductos`);
    const data = await response.json();

    if (Array.isArray(data)) {
      data.forEach(producto => {
        const tagOption = document.createElement("option");
        tagOption.value = producto.id_producto;
        tagOption.textContent = `${producto.marca} ${producto.modelo}`;
        idproductoField.appendChild(tagOption);
      });
    }
  })();

  (async () => {
    const response = await fetch(
      `${config.HOST}app/controllers/Almacen.controllers.php?operacion=listarAlmacen`
    );
    const data = await response.json();
    data.forEach((row) => {
      const tagOption = document.createElement("option");
      tagOption.value = row.id_almacen;
      tagOption.textContent = `${row.nombre_almacen}`;
      Almacen.appendChild(tagOption);
    });
  })();

  tipoMovimientoSelect.addEventListener("change", async function () {
    await actualizarMtv(tipoMovimientoSelect.value);
  });


  document.querySelector("#form-validaciones-kardex").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (await ask("¿Estás seguro de realizar esta actualización?")) {
      guardarKardex();
    }
  });

  idproductoField.addEventListener("change", () => {
    console.log(idproductoField.value, Almacen.value)
    if (idproductoField.value >= 1 && Almacen.value >= 1) {
      mostrarStockActual(idproductoField.value, Almacen.value);
    }
  });

  Almacen.addEventListener("change", () => {
    if (idproductoField.value >= 1 && Almacen.value >= 1) {
      mostrarStockActual(idproductoField.value, Almacen.value);
    }
  });


});
