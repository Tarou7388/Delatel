
document.addEventListener("DOMContentLoaded", () => {

  const idproductoField = document.querySelector("#idproducto");
  const stockactualField = document.querySelector("#stockactual");

  //Función Autoejecutable para mostrar los productos en el select 
  (() => {
    fetch(`../../controllers/tipoProducto.controller.php?operacion=getAll`)
      .then(response => response.json())
      .then(data => {
        const tipoProducto = document.querySelector("#idproducto")
        data.forEach(row => {
          const tagOption = document.createElement("option")
          tagOption.value = row.idtipoproducto
          tagOption.innerHTML = row.tipoproducto
          tipoProducto.appendChild(tagOption)
        });
      })
      .catch(e => {
        console.error(e)
      })
  })();

  //Función AutoEjecutable para mostrar los nombre de usuarios de los colaboradores
  (() => {
    fetch(`../../controllers/colaborador.controller.php?operacion=getAll`)
      .then(response => response.json())
      .then(data => {
        const NomUsuario = document.querySelector("#idcolaborador")
        data.forEach(row => {
          const tagOption = document.createElement("option")
          tagOption.value = row.idcolaborador
          tagOption.innerHTML = row.nomusuario
          NomUsuario.appendChild(tagOption)
        });
      })
      .catch(e => {
        console.error(e)
      })
  })();

  //Obtener valor del idproducto
  idproductoField.addEventListener("change", () => {
    const idproducto = idproductoField.value;
    if (idproducto) {
      MostrarStockActual(idproducto);
    }
  });

  //Obtiene el idprodcuto de manera asíncrona 
  async function MostrarStockActual(idproducto) {
    try {
      const response = await fetch(`../../controllers/kardex.controller.php?operacion=mostrarStockActual&idproducto=${idproducto}`);
      const stockactual = await response.json();
      stockactualField.value = stockactual;
    } catch (error) {
      console.error(error);
    }
  }

  // Muestra el stock actual si el idproducto ya tiene valor
  if (idproductoField.value) {
    MostrarStockActual(idproductoField.value);
  }

  //Función para validar si la cantidad es mayor al stock actual 
  //si es mayor no se podrá guardar el registro
  function ValidarCantidadSalida() {
    if (tipomovimiento.value === 'S') {
      if (parseInt(cantidad.value) > parseInt(stockactualField.value)) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "La Cantidad de Salida no puede ser mayor al stock Actual",
        });
        return false;
      }
    }
    return true;
  }

  //Función para guardar el registro de kardex
  function GuardarKardex() {
    const params = new FormData()
    params.append("operacion", "add")
    params.append("idproducto", document.querySelector("#idproducto").value)
    params.append("idcolaborador", document.querySelector("#idcolaborador").value)
    params.append("tipomovimiento", document.querySelector("#tipomovimiento").value)
    params.append("cantidad", document.querySelector("#cantidad").value)


    //options > fetch
    const options = {
      'method': 'POST',
      'body': params
    }

    //Ejecutamos el envío asíncrono
    fetch(`../../controllers/kardex.controller.php`, options)
      .then(response => response.json())
      .then(data => {
        //Limpiar el formulario
        document.querySelector("#form-validaciones-kardex").reset();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Kardex Actualizado Correctamente",
          showConfirmButton: false,
          timer: 1500
        });
      })
      .catch(e => {
        console.error(e)
      })
  }

  document.querySelector("#form-validaciones-kardex").addEventListener("submit", (event) => {
    event.preventDefault();

    //Si la cantidad es mayor que el stock actual
    if (!ValidarCantidadSalida()) {
      return;
    }

    if (confirm("¿Estás seguro de realizar esta Actualización?")) {
      GuardarKardex();
    }
  });

})