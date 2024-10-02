import config from '../env.js';

document.addEventListener("DOMContentLoaded", function () {
  if (permisos[0].permisos.inventariado.leer != 1) {
    window.location.href = `${config.HOST}views`;
  }
    const userid= user['idUsuario'];
    const tipoMovimientoSelect = document.getElementById("slcTipomovimiento");
    const motivoSelect = document.getElementById("txtaMotivo");

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

    tipoMovimientoSelect.addEventListener("change", actualizarMotivo);

    // Inicializar estado
    actualizarMotivo();

    const idproductoField = document.querySelector("#idproducto");
    const stockactualField = document.querySelector("#txtStockactual");
    const tipomovimientoField = document.querySelector("#slcTipomovimiento");
    const cantidadField = document.querySelector("#txtCantidad");
    const motivoField = document.querySelector("#txtaMotivo");
    const txtvalorhistorico = document.querySelector("#txtValorunitario");
    const fecha = document.querySelector("#txtfecha");
    const date = new Date().toISOString().split("T")[0];

    (() => {
      fetch(`${config.HOST}app/controllers/Productos.controllers.php?operacion=getAll`)
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
          console.error(e);
        });
    })();

    idproductoField.addEventListener("change", () => {
      const idproducto = idproductoField.value;

      if (idproducto) {
        MostrarStockActual(idproducto);
        cantidadField.value = "";
        tablaKardex.ajax
          .url(
            `${config.HOST}app/controllers/kardex.controllers.php?operacion=obtenerProducto&id_producto=${idproducto}`
          )
          .load();
      } else {
        cantidadField.value = 0;
      }
    });

    async function MostrarStockActual(idproducto) {
      try {
        const response = await fetch(
          `${config.HOST}app/controllers/kardex.controllers.php?operacion=obtenerStock&id_producto=${idproducto}`
        );
        const data = await response.json();
        const response2 = await fetch(
          `${config.HOST}app/controllers/Productos.controllers.php?operacion=getById&id_producto=${idproducto}`
        );
        const data2 = await response2.json();
        stockactualField.value =
          data.saldo_total !== undefined ? data.saldo_total : 0;
        txtvalorhistorico.value =
          data2.precio_actual !== undefined ? data2.precio_actual : 0;
        fecha.value = date;
      } catch (error) {
        console.error("Error al obtener el stock actual:", error);
        stockactualField.value = 0;
      }
    }

    //Función para guardar el registro de kardex
    function GuardarKardex() {
      if (permisos[0].permisos.inventariado.crear != 1) {
        alert("No tienes permiso para esta acción");
      }
      const params = new FormData();
        params.append("operacion", "add");
        params.append("idproducto", idproductoField.value);
        params.append("fecha", fecha.value);
        params.append("tipooperacion", tipomovimientoField.value);
        params.append("motivo", motivoField.value);
        params.append("cantidad", cantidadField.value);
        params.append("valorunitariohistorico", txtvalorhistorico.value);
        params.append("iduser_create", userid);

        const options = {
          method: "POST",
          body: params,
        };
        fetch(`../../controllers/kardex.controllers.php`, options)
          .then((response) => response.json())
          .then((data) => {
            if (data.Guardado) {
              alert("Se ha guardado correctamente");
            } else {
              alert("Error: Verfique la cantidad ingresada");
            }
            document.querySelector("#form-validaciones-kardex").reset();
            tablaKardex.ajax.reload();
          })
          .catch((e) => {
            console.error(e);
          });
    }

    // Manejar el evento submit del formulario
    document
      .querySelector("#form-validaciones-kardex")
      .addEventListener("submit", (event) => {
        event.preventDefault();

        if (confirm("¿Estás seguro de realizar esta actualización?")) {
          GuardarKardex();
        }
      });
});
