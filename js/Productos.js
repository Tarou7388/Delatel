import config from '../env.js';
document.addEventListener("DOMContentLoaded", () => {
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

      const params = new FormData();
      params.append("operacion", "registrarProducto");
      params.append("marca", marca.value);
      params.append("tipoProducto", tipoProducto.value);
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
          if (data.Guardado) {
            showToast("Se ha guardado correctamente","SUCCESS");
          } else {
            showToast("Verfique que se haya hecho bien la operacion","ERROR");
          }
          document.querySelector("#form-productos").reset();

          tablaProductos.ajax.reload();
        });
    });
});