import config from "../env.js";

document.addEventListener("DOMContentLoaded", function () {
  // 1. Variables locales
  const userid = user["idUsuario"];
  const tipoMovimientoSelect = document.getElementById("slcTipomovimiento");
  const motivoSelect = document.getElementById("txtaMotivo");
  const idproductoField = document.querySelector("#idproducto");
  const stockactualField = document.querySelector("#txtStockactual");
  const tipomovimientoField = document.querySelector("#slcTipomovimiento");
  const cantidadField = document.querySelector("#txtCantidad");
  const motivoField = document.querySelector("#txtaMotivo");
  const txtvalorhistorico = document.querySelector("#txtValorunitario");
  const fecha = document.querySelector("#txtfecha");
  const date = new Date().toISOString().split("T")[0];

  const opcionesEntrada = `
        <optgroup label="Entrada">
            <option value="Compra de Equipos">Compra de Equipos</option>
            <option value="Reemplazo de Equipos">Reemplazo de Equipos</option>
            <option value="Actualización de Equipos">Actualización de Equipos</option>
            <option value="Recepción de Equipos Nuevos">Recepción de Equipos Nuevos</option>
        </optgroup>
    `;

  const opcionesSalida = `
        <optgroup label="Salida">
            <option value="Devolución por Cancelación">Devolución por Cancelación</option>
            <option value="Equipos en Desuso">Equipos en Desuso</option>
            <option value="Venta de Equipos">Venta de Equipos</option>
            <option value="Pérdida o Robo">Pérdida o Robo</option>
            <option value="Descarte por Obsolescencia">Descarte por Obsolescencia</option>
        </optgroup>
    `;

  function actualizarMotivo() {
    const valor = tipoMovimientoSelect.value;
    motivoSelect.innerHTML =
      valor === "ENTRADA"
        ? opcionesEntrada
        : valor === "SALIDA"
        ? opcionesSalida
        : '<option value="">Seleccione</option>';
  }

  async function MostrarStockActual(idproducto) {
    try {
      const response = await fetch(
        `${config.HOST}app/controllers/Kardex.controllers.php?operacion=buscarStockId&idProducto=${idproducto}`
      );
      const data = await response.json();
      const response2 = await fetch(
        `${config.HOST}app/controllers/Producto.controllers.php?operacion=buscarProductoId&idProducto=${idproducto}`
      );
      const data2 = await response2.json();

      const stockData = Array.isArray(data) && data.length > 0 ? data[0] : null;
      stockactualField.value =
        stockData && stockData.saldo_total !== undefined
          ? stockData.saldo_total
          : 0;

      // Manejo del producto
      const productoData =
        Array.isArray(data2) && data2.length > 0 ? data2[0] : null;
      txtvalorhistorico.value =
        productoData && productoData.precio_actual !== undefined
          ? productoData.precio_actual
          : 0;

      fecha.value = date;
    } catch (error) {
      console.error("Error al obtener el stock actual:", error);
      stockactualField.value = 0;
      showToast(
        "Error al obtener el stock actual. Por favor, inténtelo de nuevo.",
        "ERROR"
      );
    }
  }

  function GuardarKardex() {
    const params = new FormData();
    params.append("operacion", "registrarKardex");
    params.append("idProducto", idproductoField.value);
    params.append("fecha", fecha.value);
    params.append("tipoOperacion", tipomovimientoField.value);
    params.append("motivo", motivoField.value);
    params.append("cantidad", cantidadField.value);
    params.append("valorUnitarioHistorico", txtvalorhistorico.value);
    params.append("idUsuario", userid);

    const options = {
      method: "POST",
      body: params,
    };

    fetch(`${config.HOST}app/controllers/Kardex.controllers.php`, options)
      .then((response) => response.json())
      .then((data) => {
        if (data.Guardado) {
          showToast("Se ha guardado correctamente", "SUCCESS");
        } else {
          showToast("Error: Verifique la cantidad ingresada", "ERROR");
        }
        document.querySelector("#form-validaciones-kardex").reset();
        tablaKardex.ajax.reload();
      })
      .catch((e) => {
        console.error("Error al guardar el kardex:", e);
        showToast(
          "Ocurrió un error al guardar el kardex. Por favor, inténtelo de nuevo.",
          "ERROR"
        );
      });
  }

  function cargarProductos() {
    fetch(
      `${config.HOST}app/controllers/Producto.controllers.php?operacion=listarProductos`
    )
      .then((response) => response.json())
      .then((data) => {
        const tipoProducto = document.querySelector("#idproducto");
        data.forEach((row) => {
          const tagOption = document.createElement("option");
          tagOption.value = row.id_producto;
          tagOption.innerHTML = `${row.marca} ${row.modelo} ${row.tipo_producto}`;
          tipoProducto.appendChild(tagOption);
        });
      })
      .catch((e) => {
        console.error("Error al obtener productos:", e);
        showToast(
          "Ocurrió un error al cargar los productos. Por favor, inténtelo de nuevo.",
          "ERROR"
        );
      });
  }
  (() => {
    cargarProductos();
    actualizarMotivo();
  })();

  tipoMovimientoSelect.addEventListener("change", actualizarMotivo);
  idproductoField.addEventListener("change", () => {
    const idproducto = idproductoField.value;

    if (idproducto) {
      MostrarStockActual(idproducto);
      cantidadField.value = "";
      tablaKardex.ajax
        .url(
          `${config.HOST}app/controllers/Kardex.controllers.php?operacion=buscarStockId&idProducto=${idproducto}`
        )
        .load();
    } else {
      cantidadField.value = 0;
    }
  });

  document
    .querySelector("#form-validaciones-kardex")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      if (await ask("¿Estás seguro de realizar esta actualización?")) {
        GuardarKardex();
      }
    });
});
