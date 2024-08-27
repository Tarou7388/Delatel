document.addEventListener("DOMContentLoaded", () => {

  const idproductoField = document.querySelector("#idproducto");
  const stockactualField = document.querySelector("#txtStockactual");
  const tipomovimientoField = document.querySelector("#slcTipomovimiento");
  const cantidadField = document.querySelector("#txtCantidad");
  const motivoField = document.querySelector("#txtaMotivo");
  const txtvalorhistorico = document.querySelector("#txtValorunitario");
  const fecha = document.querySelector("#txtfecha");
  const date = new Date().toISOString().split('T')[0];


  (() => {
    fetch(`../controllers/Productos.controllers.php?operacion=getAll`)
      .then(response => response.json())
      .then(data => {
        const tipoProducto = document.querySelector("#idproducto");
        data.forEach(row => {
          const tagOption = document.createElement("option");
          tagOption.value = row.id_producto;
          tagOption.innerHTML = `${row.marca} ${row.modelo} ${row.tipo_producto}`;
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
      tablaKardex.ajax.url(`../controllers/kardex.controllers.php?operacion=obtenerProducto&id_producto=${idproducto}`).load();
    } else {
      cantidadField.value = 0;
    }
  });

  async function MostrarStockActual(idproducto) {
    try {
      const response = await fetch(`../controllers/kardex.controllers.php?operacion=obtenerStock&id_producto=${idproducto}`);
      const data = await response.json();
      stockactualField.value = data.saldo_total !== undefined ? data.saldo_total : 0;
      txtvalorhistorico.value = data.precio_actual !== undefined ? data.precio_actual : 0;
      fecha.value = date;
    } catch (error) {
      console.error("Error al obtener el stock actual:", error);
      stockactualField.value = 0;
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
      .then(response => response.json())
      .then(data => {
        if(data.Guardado){
            alert("Se ha guardado correctamente");
        }else{
            alert("Error: Verfique que se haya hecho bien la operacion");
        }
        document.querySelector("#form-validaciones-kardex").reset();
        tablaKardex.ajax.reload();
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
