document.addEventListener("DOMContentLoaded", () => {

  const idproductoField = document.querySelector("#idproducto");
  const stockactualField = document.querySelector("#txtStockactual");
  const tipomovimientoField = document.querySelector("#slcTipomovimiento");
  const cantidadField = document.querySelector("#txtCantidad");
  const motivoField = document.querySelector("#txtaMotivo");
  const txtvalorhistorico = document.querySelector("#txtValorunitario");
  const fecha = document.querySelector("#txtfecha");

  (() => {
    fetch(`../controllers/Productos.controllers.php?operacion=getAll`)
      .then(response => response.json())
      .then(data => {
        const tipoProducto = document.querySelector("#idproducto");
        data.forEach(row => {
          const tagOption = document.createElement("option");
          tagOption.value = row.id_producto;
          tagOption.innerHTML = `${row.nombre} ${row.modelo}`;
          tipoProducto.appendChild(tagOption);
        });
      })
      .catch(e => {
        console.error(e);
      });
  })();

  idproductoField.addEventListener("change", () => {
    const idproducto = idproductoField.value;
    if (idproducto) {
      MostrarStockActual(idproducto);
      cantidadField.value = "";
    }
  });

  async function MostrarStockActual(idproducto) {
    try {
      const response = await fetch(`../controllers/kardex.controllers.php?operacion=obtenerStock&id_producto=${idproducto}`);
      const data = await response.json();
      stockactualField.value = data.saldo_total;
    } catch (error) {
      console.error("Error al obtener el stock actual:", error);
    }
  }

  //Función para guardar el registro de kardex
  function GuardarKardex() {
    const params = new FormData();
    params.append("operacion", "add");
    params.append("idproducto", idproductoField.value);
    params.append("fecha", fecha.value);
    params.append("tipooperacion", tipomovimientoField.value);
    params.append("motivo", motivoField.value);
    params.append("cantidad", cantidadField.value);
    params.append("valorunitariohistorico", txtvalorhistorico.value);

    const options = {
      method: 'POST',
      body: params
    };

    fetch(`../controllers/kardex.controllers.php`, options)
      .then(response => response.text())
      .then(data => {
        console.log(data)
        document.querySelector("#form-validaciones-kardex").reset();
      })
      .catch(e => {
        console.error(e);
      });
  }

  // Manejar el evento submit del formulario
  document.querySelector("#form-validaciones-kardex").addEventListener("submit", (event) => {
    event.preventDefault();

    if (confirm("¿Estás seguro de realizar esta actualización?")) {
      GuardarKardex();
    }
  });

});
