document.addEventListener("DOMContentLoaded", () => {

  const idproductoField = document.querySelector("#idproducto");
  const stockactualField = document.querySelector("#txtStockactual");
  const tipomovimientoField = document.querySelector("#slcTipomovimiento");
  const cantidadField = document.querySelector("#txtCantidad");
  const motivoField = document.querySelector("#txtaMotivo");

  (() => {
    fetch(`../controllers/Productos.controllers.php?operacion=getAll`)
      .then(response => response.json())
      .then(data => {
        const tipoProducto = document.querySelector("#idproducto");
        data.forEach(row => {
          const tagOption = document.createElement("option");
          tagOption.value = row.id_producto;
          tagOption.innerHTML = row.nombre + " " + row.modelo;
          tipoProducto.appendChild(tagOption);
        });
      })
      .catch(e => {
        console.error(e);
      });
  })();

  //Obtener valor del idproducto
  idproductoField.addEventListener("change", () => {
    const idproducto = idproductoField.value;
    if (idproducto) {
      MostrarStockActual(idproducto);
    }
  });

  async function MostrarStockActual(idproducto) {
    try {
      const response = await fetch(`../controllers/kardex.controller.php?operacion=obtenerStock&id_producto=${idproducto}`);
      const data = await response.json();
      stockactualField.value = data.stock_actual;
    } catch (error) {
      console.error("Error al obtener el stock actual:", error);
    }
  }

  //Función para guardar el registro de kardex
  function GuardarKardex() {
    const params = new FormData();
    params.append("operacion", "add");
    params.append("idproducto", idproductoField.value);
    params.append("fecha", document.querySelector("#txtfecha").value);
    params.append("tipooperacion", tipomovimientoField.value);
    params.append("motivo", motivoField.value);
    params.append("cantidad", cantidadField.value);
    params.append("valorunitariohistorico", 0); // Ajuste de valor, ya que no se especificó en el HTML

    const options = {
      method: 'POST',
      body: params
    };

    //Ejecutar la solicitud asíncrona
    fetch(`../controllers/kardex.controller.php`, options)
      .then(response => response.json())
      .then(data => {
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
