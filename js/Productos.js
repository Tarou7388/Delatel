import config from "../env.js";
import * as Herramientas from "./Herramientas.js";
document.addEventListener("DOMContentLoaded", async () => {
  let login = await Herramientas.obtenerLogin();
  const userid = login.idUsuario;
  const precioActual = document.querySelector("#txtPrecioActual");
  const tipoProducto = document.querySelector("#slcTipoProducto");
  const Modelo = document.querySelector("#txtModelo");
  const CodigoBarras = document.querySelector("#txtCodigoBarras");
  const slcMarca = document.querySelector("#slcMarca");
  const slcUnidadMedida = document.querySelector("#slcUnidadMedida");
  const accesos = await Herramientas.permisos;

  (async () => {
    try {
      const response = await fetch(`${config.HOST}app/controllers/Marcas.controllers.php?operacion=listarmarca`);
      const data = await response.json();
      if (Array.isArray(data)) {
        slcMarca.innerHTML = ""; // Limpiar opciones existentes
        data.forEach(data => {
          const option = document.createElement("option");
          option.value = data.id_marca;
          option.textContent = data.marca;
          slcMarca.appendChild(option);
        });
      }
    } catch (error) {
      console.error("Error al cargar las marcas:", error);
    }
  })();

  (async () => {
    try {
      const response = await fetch(`${config.HOST}app/controllers/Producto.controllers.php?operacion=listarTipoProductos`);
      const data = await response.json();
      if (Array.isArray(data)) {
        tipoProducto.innerHTML = ""; // Limpiar opciones existentes
        data.forEach(tipoProduc => {
          const option = document.createElement("option");
          option.value = tipoProduc.id_tipo;
          option.textContent = tipoProduc.tipo_nombre;
          tipoProducto.appendChild(option);
        });
      }
    } catch (error) {
      console.error("Error al cargar los Tipos de Producto:", error);
    }
  })();

  (async () => {
    try {
      const response = await fetch(`${config.HOST}app/controllers/Medidas.controllers.php?operacion=listarmedidas`);
      const data = await response.json();
      if (Array.isArray(data)) {
        slcUnidadMedida.innerHTML = ""; // Limpiar opciones existentes
        data.forEach(unidades => {
          const option = document.createElement("option");
          option.value = unidades.id_unidad;
          option.textContent = unidades.unidad_nombre;
          slcUnidadMedida.appendChild(option);
        });
      }
    } catch (error) {
      console.error("Error al cargar los Tipos de Producto:", error);
    }
  })();
  document.getElementById("formRegistrarTipoProductos").addEventListener("submit", (event) => {
    event.preventDefault();

    fetch(`${config.HOST}app/controllers/Producto.controllers.php`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        operacion: "registrarTipoProducto",
        tipoProducto: document.getElementById("txtTipoProductoModal").value,
        idUsuario: userid
      })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.Guardado) {
          showToast("Se ha guardado correctamente", "SUCCESS");
        } else {
          showToast("Verifique que se haya hecho bien la operación", "ERROR");
        }
        document.querySelector("#formRegistrarTipoProductos").reset();
      })
      .catch((error) => {
        console.error("Error:", error);
        showToast("Ha ocurrido un error en la operación", "ERROR");
      });
  });


  document.getElementById("form-productos").addEventListener("submit", (event) => {
    event.preventDefault();

    const params = new FormData();
    params.append("operacion", "registrarProducto");
    params.append("idmarca", slcMarca.value);
    params.append("idtipoProducto", tipoProducto.value);
    params.append("idUnidad", slcUnidadMedida.value);
    params.append("modelo", Modelo.value);
    params.append("precioActual", precioActual.value);
    params.append("codigoBarra", CodigoBarras.value);
    params.append("idUsuario", userid);

    fetch(`${config.HOST}app/controllers/Producto.controllers.php`, {
      method: "POST",
      body: params,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.Guardado) {
          showToast("Se ha guardado correctamente", "SUCCESS");
        } else {
          showToast("Verifique que se haya hecho bien la operación", "ERROR");
        }
        document.querySelector("#form-productos").reset();

        tablaProductos.ajax.reload();
      });
  });

  precioActual.addEventListener("keypress", (event) => {
    const charCode = event.charCode;
    if (charCode === 45 || (charCode < 48 && charCode !== 46) || charCode > 57) {
      event.preventDefault();
    }
  });

  precioActual.addEventListener("input", (event) => {
    if (parseFloat(event.target.value) < 0) {
      event.target.value = "";
    }
  });
});