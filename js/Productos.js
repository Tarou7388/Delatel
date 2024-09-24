import config from '../env.js';
document.addEventListener("DOMContentLoaded", () => {
  if (!permisos[0].permisos.personas.leer) {
    window.location.href = `${config.HOST}views`;
  }
  const userid= user['idUsuario'];
  const marca = document.querySelector("#slcMarca");
  const precioActual = document.querySelector("#txtPrecioActual");
  const tipoProducto = document.querySelector("#slcTipoProducto");
  const Modelo = document.querySelector("#txtModelo");
  const CodigoBarras = document.querySelector("#txtCodigoBarras");



  document
    .getElementById("form-productos")
    .addEventListener("submit", (event) => {
      event.preventDefault();

      if (permisos[0].permisos.inventariado.crear != 1) {
        alert("No tienes permiso para esta acción");
      }
      const params = new FormData();
      params.append("operacion", "add");
      params.append("tipo_producto", tipoProducto.value);
      params.append("marca", marca.value);
      params.append("precio_actual", precioActual.value);
      params.append("modelo", Modelo.value);
      params.append("Codigo_Barras", CodigoBarras.value);
      params.append("iduser_create", userid);

      fetch(`${config.HOST}controllers/Productos.controllers.php`, {
        method: "POST",
        body: params,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.Guardado) {
            alert("Se ha guardado correctamente");
          } else {
            alert("Error: Verfique que se haya hecho bien la operacion");
          }
          document.querySelector("#form-productos").reset();

          tablaProductos.ajax.reload();
        });
    });
});