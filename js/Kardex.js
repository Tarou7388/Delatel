import config from "../env.js";
import * as Herramientas from "../js/Herramientas.js";

document.addEventListener("DOMContentLoaded", async function () {

  const userid = user["idUsuario"];
  const tipoMovimientoSelect = document.getElementById("slcTipomovimiento");
  const slcMotivo = document.getElementById("slcMotivo");
  const idproductoField = document.querySelector("#idproducto");
  const stockactualField = document.querySelector("#txtStockactual");
  const txtCantidad = document.querySelector("#txtCantidad");
  const txtvalorhistorico = document.querySelector("#txtValorunitario");
  const fecha = document.querySelector("#txtfecha");
  const Almacen = document.querySelector("#slcAlmacen");
  const accesos = await Herramientas.permisos()
  fecha.value = new Date().toISOString().split("T")[0];

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

  const mostrarStockActual = async (idproducto) => {
    const [stockRes, productoRes] = await Promise.all([
      fetch(`${config.HOST}app/controllers/Kardex.controllers.php?operacion=buscarStockId&idProducto=${idproducto}`),
      fetch(`${config.HOST}app/controllers/Producto.controllers.php?operacion=buscarProductoId&idProducto=${idproducto}`)
    ]);

    const stockData = await stockRes.json();
    const productoData = await productoRes.json();

    stockactualField.value = stockData[0]?.saldo_total || 0;
    txtvalorhistorico.value = productoData[0]?.precio_actual || 0;
  };


  const guardarKardex = () => {
    console.log(accesos)
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
        fetch(`${config.HOST}app/controllers/Kardex.controllers.php`, {
          method: "POST",
          body: params,
        })
          .then((response) => response.json())
          .then((data) => {
            showToast(data.Guardado ? "Se ha guardado correctamente" : "Error: Verifique la cantidad ingresada",
              data.Guardado ? "SUCCESS" : "ERROR"
            );
            document.querySelector("#form-validaciones-kardex").reset();
            tablaKardex.ajax.reload();
            fecha.value = new Date().toISOString().split("T")[0];
          });
      } catch (error) {
        showToast("No se pudo realizar la operacion", "ERROR")
      }
    } else{
      showToast("No tienes permisos para guardar en el Kardex","ERROR")
    }
  };

  (async () => {
    const response = await fetch(
      `${config.HOST}app/controllers/Producto.controllers.php?operacion=listarProductos`
    );
    const data = await response.json();
    data.forEach((row) => {
      const tagOption = document.createElement("option");
      tagOption.value = row.id_producto;
      tagOption.textContent = `${row.marca} ${row.modelo}`;
      idproductoField.appendChild(tagOption);
    });
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

  idproductoField.addEventListener("change", () => mostrarStockActual(idproductoField.value));

  document.querySelector("#form-validaciones-kardex").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (await ask("¿Estás seguro de realizar esta actualización?")) {
      guardarKardex();
    }
  });
});
